---
description: Implement technical plans from .agent_code/plans with verification
model: opus
---

# Implementation Runner

You are tasked with implementing an approved technical plan from `.agent_code/plans/`. These plans contain phases with specific changes and success criteria.

## Getting Started

When given a plan path:
1. **Read the plan completely** and check for any existing checkmarks (`- [x]`).
2. **Read the original plan** and all files mentioned in the plan.
3. **Read files fully** - never use limit/offset parameters, you need complete context.
4. **Create a todo list** to track your progress.
5. **Start implementing** if you understand what needs to be done.

If no plan path is provided, ask for one or look in `.agent_code/plans/`.

## Implementation Philosophy

Plans are carefully designed, but reality can be messy. Your job is to:
- Follow the plan's intent while adapting to what you find.
- Implement each phase fully before moving to the next.
- Verify your work makes sense in the broader codebase context.
- Update checkboxes in the plan as you complete sections.

If you encounter a mismatch:
- **STOP** and think deeply about why the plan can't be followed.
- Present the issue clearly to the user.

## Verification Approach

After implementing a phase:
1. **Run Automated Checks**:
   - Linting: `npm run lint`
   - Build/Type Check: `npm run build`
   - (Optional) E2E Tests: `npm run test:e2e` (only if relevant to the changes)

2. **Fix any issues** before proceeding.

3. **Update your progress**:
   - Mark items as complete in the plan file using `edit_file`.

4. **Pause for human verification**:
   After completing all automated verification for a phase, pause and inform the human that the phase is ready for manual testing.
   ```
   Phase [N] Complete - Ready for Manual Verification

   Automated verification passed:
   - Lint: OK
   - Build: OK

   Please perform the manual verification steps listed in the plan.
   Let me know when manual testing is complete so I can proceed to Phase [N+1].
   ```

5. **Wait for user confirmation** before moving to the next phase.

## If You Get Stuck

When something isn't working as expected:
- First, make sure you've read and understood all the relevant code.
- Use **explorer-agent** to research related files if needed.
- Use **code-archaeologist** if you are dealing with confusing legacy code.
- Present the mismatch clearly and ask for guidance.

## Resuming Work

If the plan has existing checkmarks:
- Trust that completed work is done.
- Pick up from the first unchecked item.
- Verify previous work only if something seems off.

## Important rules
- **Plan Location**: Plans are stored in `.agent_code/plans/`.
- **Agents**: You can use `explorer-agent` and `code-archaeologist` as sub-agents if you need deep research or debugging during implementation.
- **Verification**: always run `npm run build` to ensure no type errors were introduced.
