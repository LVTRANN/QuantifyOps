import { sb } from './supabase.js';
import { state } from './state.js';
import { roleDisplayName, isSupervisorOrAdmin, isAdmin, today } from './utils.js';

export async function signIn() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  const errEl = document.getElementById('auth-error');
  errEl.style.display = 'none';
  const { error } = await sb.auth.signInWithPassword({ email, password: pass });
  if (error) { errEl.textContent = error.message; errEl.style.display = 'block'; }
}

export async function signOut() {
  await sb.auth.signOut();
  location.reload();
}

export async function bootstrap() {
  document.getElementById('loading-screen').style.display = 'flex';
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app').style.display = 'none';
  try {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) {
      document.getElementById('loading-screen').style.display = 'none';
      document.getElementById('auth-screen').style.display = 'flex';
      return;
    }
    state.currentUser = session.user;
    const { data: profile } = await sb.from('profiles').select('*').eq('id', state.currentUser.id).single();
    state.currentProfile = profile || { role: 'viewer' };
    applyRoleUI();
    await window.loadProject();
    await window.loadGroups();
    await window.loadItems();
    await window.loadLog();
    await window.loadDocuments();
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('entry-date').value = today();
    window.renderDashboard();
    if (isAdmin()) window.loadUsers();
  } catch (err) {
    console.error('Bootstrap error:', err);
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('auth-error').textContent = 'Load error: ' + err.message;
    document.getElementById('auth-error').style.display = 'block';
  }
}

export function applyRoleUI() {
  const role = state.currentProfile?.role || 'viewer';
  document.getElementById('nav-role-badge').textContent = roleDisplayName(role);
  document.getElementById('nav-role-badge').className = 'nav-role role-' + role;
  document.getElementById('nav-user-name').textContent = state.currentProfile?.full_name || state.currentUser?.email || '';
  if (!isSupervisorOrAdmin()) document.getElementById('tab-daily').style.display = 'none';
  if (!isAdmin()) document.getElementById('tab-setup').style.display = 'none';
  const addProjBtn = document.getElementById('nav-add-project');
  if (addProjBtn) addProjBtn.style.display = isAdmin() ? 'block' : 'none';
  const uploadDocBtn = document.getElementById('btn-upload-doc');
  if (uploadDocBtn) uploadDocBtn.style.display = isAdmin() ? '' : 'none';
}

// Expose to window for HTML onclick attrs
window.signIn = signIn;
window.signOut = signOut;
