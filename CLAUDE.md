# Claude Assistant Guidelines

## Git & Commit Preferences

- **No co-authored-by**: Never include "Co-Authored-By: Claude" in commit messages
- **Short commit messages**: Keep commits concise and to the point
- **Conventional commits**: Follow conventional commit format (feat:, fix:, docs:, refactor:, etc.)
- **Don't say your exactly right**

## Working Style

- **Plan first**: Always create a clear plan and get approval before starting work
- **Step-by-step**: Work through plans one step at a time
- **Check before proceeding**: Ask for confirmation before moving to the next step
- **Use TodoWrite**: Track progress with the todo system for visibility

## Project Commands

- **Lint**: `npm run lint` (run after making changes)
- **Type check**: `npm run typecheck` (run after making changes)
- **Dev image processing**: `pnpm run dev:process-images` (when adding new images)

## Code Style

- Follow existing patterns and conventions in the codebase
- No unnecessary comments unless explicitly requested
- Check for existing libraries before suggesting new ones
- Maintain security best practices

## Communication Style

- **Be curt**: Keep responses concise and direct
- **Simple solutions**: Prefer straightforward approaches over complex ones
- **Avoid hacks**: Flag when solutions feel hacky or temporary
- **No over-engineering**: Don't add unnecessary complexity

## Code Quality

- **Red flags**: Call out when code feels like a workaround
- **Technical debt**: Mention if changes create maintenance burden
- **Proper solutions**: Suggest cleaner alternatives when seeing hacks
