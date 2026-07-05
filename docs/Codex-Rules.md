# Codex Development Rules

These rules guide future Codex-assisted development for Real Estate Empire.

## Safety Rules

1. Never break existing working features.
2. Make small, focused commits.
3. Explain what changed in every final response and pull request body.
4. Do not change unrelated files.
5. Do not rewrite architecture without a clear reason.
6. Do not delete user work or manually revert changes unless explicitly asked.

## Code Rules

| Rule | Reason |
| --- | --- |
| Keep backend and web separated. | Prevent browser/server dependency confusion. |
| Prefer reusable managers/classes in Phaser. | Keeps scenes maintainable as gameplay grows. |
| Do not add random dependencies without reason. | Reduces bloat and security risk. |
| Do not hardcode production secrets. | Protects credentials and deployment safety. |
| Keep mobile responsiveness. | Mobile browser is a primary target. |
| Validate economy actions on the backend. | Prevents cheating and inconsistent state. |
| Keep API response shapes consistent. | Simplifies client handling and future admin tools. |

## Asset Rules

- Do not use paid assets unless the project owner explicitly approves the license.
- Do not use copied assets from other games.
- Use AI-generated original assets only when adding new game art.
- Keep one consistent 2.5D isometric style.
- Do not mix unrelated asset styles in the city scene.

## Testing Rules

- Always test with `npm run dev` when changing runnable backend or web behavior.
- For documentation-only changes, verify files and markdown structure instead of starting dev servers.
- Run the narrowest useful checks first, then broader checks when code changes are significant.
- Report every command run and whether it passed, failed, or was limited by the environment.

## Commit Rules

- Commit only the intended changes.
- Keep commit messages clear and descriptive.
- Prefer one logical change per commit.
- Review `git diff` before committing.

## Pull Request Rules

A pull request summary should include:

- What changed.
- Why it changed.
- Tests or checks performed.
- Any known limitations or follow-up work.

## Future Feature Rules

- Phase 1 features must prioritize stable account, city, plot, building, and economy foundations.
- Phase 2 should add content and polish without destabilizing the core loop.
- Phase 3 multiplayer features must include anti-cheat, moderation, logging, and abuse prevention plans.
