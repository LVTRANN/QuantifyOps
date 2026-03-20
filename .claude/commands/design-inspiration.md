# Design Inspiration

You are about to work on a design task. Before writing any frontend code or modifying any UI, follow these steps:

## Step 1 — Load Reference Images

Read every file inside `.claude/design-inspiration/references/`. These are visual references showing the exact look and feel the user wants to achieve.

Use the Read tool on each image file found. If the folder is empty, skip to Step 3 and note that no references are loaded.

## Step 2 — Extract Design Principles

For each reference image, identify and document:

- **Layout:** grid structure, spacing rhythms, content hierarchy, alignment
- **Typography:** font weights, sizes, line heights, letter spacing, text color usage
- **Color:** backgrounds, surfaces, borders, text colors, accent usage, contrast levels
- **Components:** buttons, cards, inputs, badges, tables — their shape, padding, border radius, shadow
- **Density:** how much whitespace, how compact or airy the UI feels
- **Interaction cues:** hover states, active states, focus rings, transitions

Summarize these as a short design brief (bullet points) before touching any code.

## Step 3 — Apply to the Current Task

Now proceed with the design task. At every decision point — color choice, spacing value, component shape — cross-reference the brief from Step 2 and match it.

If the current task involves modifying existing UI, check that your changes stay consistent with the reference aesthetic, not just the existing code's style.

## Step 4 — Self-Review

After generating or modifying the design:
1. Mentally compare the output against the reference images
2. Call out any deviations and fix them
3. Only present the result to the user when it matches the references as closely as the constraints allow

## Notes

- References folder: `.claude/design-inspiration/references/`
- Supported formats: PNG, JPG, WEBP, PDF screenshots
- To add new references: drop image files into the references folder — no other setup needed
- References are additive — all images in the folder apply simultaneously
- If two references conflict, prefer the most recent file (by filename date or sequence number)
