---
name: preview
description: Preview changes, generate screenshots, and validate UI/UX before deployment.
---

# /preview Command

## Usage

```
/preview [feature or page]
```

## Examples

```
/preview New dashboard design
/preview Login page changes
```

## What It Does

This command invokes the `@frontend-specialist` agent to:

1. **Generate Previews**
   - Screenshot different states
   - Responsive views (mobile, tablet, desktop)
   - Interactive states (hover, focus, active)

2. **Validate Design**
   - Check visual consistency
   - Verify responsive behavior
   - Accessibility checks
   - Cross-browser compatibility

3. **Compare Changes**
   - Before/after screenshots
   - Highlight differences
   - Document changes

## Preview Types

- **Static Screenshots**: Visual appearance
- **Interactive**: User interactions
- **Responsive**: Multiple device sizes
- **Accessibility**: Screen reader compatibility

## When to Use

- Before deploying UI changes
- Design reviews
- Responsive testing
- Accessibility audits
- Stakeholder demos

## Output

The agent will:
- Generate preview screenshots
- Provide comparison views
- List any issues found
- Suggest improvements
- Document for review
