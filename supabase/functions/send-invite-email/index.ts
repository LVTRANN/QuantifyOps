import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const APP_URL = 'https://quantifyops.net';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Manager',
  supervisor: 'Superintendent',
  coordinator: 'Coordinator',
  viewer: 'Viewer',
};

Deno.serve(async (req) => {
  try {
    const payload = await req.json();

    // Only handle INSERT events for project_invite notifications
    if (payload.type !== 'INSERT' || payload.record?.type !== 'project_invite') {
      return new Response('skipped', { status: 200 });
    }

    const { user_id, project_id, invited_by, role } = payload.record;

    // Use service role client to access auth.users and all tables
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Fetch invitee email from auth.users
    const { data: inviteeAuth } = await sb.auth.admin.getUserById(user_id);
    const inviteeEmail = inviteeAuth?.user?.email;
    if (!inviteeEmail) {
      console.error('No email found for user', user_id);
      return new Response('no email', { status: 200 });
    }

    // Fetch invitee display name from profiles
    const { data: inviteeProfile } = await sb
      .from('profiles')
      .select('full_name')
      .eq('id', user_id)
      .single();
    const inviteeName = inviteeProfile?.full_name || inviteeEmail;

    // Fetch inviter name from profiles
    const { data: inviterProfile } = await sb
      .from('profiles')
      .select('full_name, email')
      .eq('id', invited_by)
      .single();
    const inviterName = inviterProfile?.full_name || inviterProfile?.email || 'A team member';

    // Fetch project name
    const { data: project } = await sb
      .from('projects')
      .select('name')
      .eq('id', project_id)
      .single();
    const projectName = project?.name || 'a project';

    const roleLabel = ROLE_LABELS[role] || role;

    // Send email via Resend
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'QuantifyOps <invites@quantifyops.net>',
        to: [inviteeEmail],
        subject: `You've been invited to ${projectName} on QuantifyOps`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f7f6f3;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f3;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e4e2de;">

        <!-- Header -->
        <tr>
          <td style="background:#1e1d1a;padding:28px 32px;">
            <div style="display:inline-block;width:28px;height:3px;background:#E07B00;border-radius:2px;margin-bottom:12px;"></div>
            <div style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">QuantifyOps</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;font-size:15px;color:#5c5a54;">Hi ${inviteeName},</p>
            <h1 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#1c1b18;letter-spacing:-0.3px;">
              You've been invited to join a project
            </h1>
            <p style="margin:0 0 24px;font-size:15px;color:#5c5a54;line-height:1.6;">
              <strong style="color:#1c1b18;">${inviterName}</strong> has invited you to
              <strong style="color:#1c1b18;">${projectName}</strong> as a
              <strong style="color:#1c1b18;">${roleLabel}</strong>.
            </p>

            <!-- Project card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f3;border-radius:8px;border:1px solid #e4e2de;margin-bottom:28px;">
              <tr>
                <td style="padding:20px 24px;">
                  <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#8c8a84;margin-bottom:6px;">Project</div>
                  <div style="font-size:18px;font-weight:700;color:#1c1b18;margin-bottom:4px;">${projectName}</div>
                  <div style="font-size:13px;color:#5c5a54;">Role: <strong>${roleLabel}</strong></div>
                </td>
              </tr>
            </table>

            <!-- CTA Button -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#E07B00;border-radius:6px;">
                  <a href="${APP_URL}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.1px;">
                    Open QuantifyOps →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:28px 0 0;font-size:13px;color:#8c8a84;line-height:1.6;">
              Sign in to QuantifyOps and you'll see the invite waiting in your notifications.
              If you don't have an account yet, you can create one using this email address.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f7f6f3;padding:20px 32px;border-top:1px solid #e4e2de;">
            <p style="margin:0;font-size:12px;color:#8c8a84;">
              Sent by QuantifyOps · <a href="${APP_URL}" style="color:#8c8a84;">${APP_URL}</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error('Resend error:', err);
      return new Response('email failed', { status: 500 });
    }

    console.log(`Invite email sent to ${inviteeEmail} for project ${projectName}`);
    return new Response('ok', { status: 200 });
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response('error', { status: 500 });
  }
});
