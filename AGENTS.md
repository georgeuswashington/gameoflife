# AGENT WORKFLOW INSTRUCTIONS (Repository scope)

These instructions apply to the entire repository.

## Version discipline (required)
- The game version is stored in `app.js` as `GAME_VERSION`.
- **For every code/content change in this repository, bump `GAME_VERSION` in the same patch.**
- Use a simple incremental format: if current is `v0.21`, next is `v0.22` (increase the last number by `+0.01`).

## PR checklist for the agent
- Before committing, verify that:
  1) `GAME_VERSION` was bumped.
  2) UI that displays version (sidebar label) still uses `GAME_VERSION`.
  3) `node --check app.js` passes.

