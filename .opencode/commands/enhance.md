---
name: enhance
description: Improve existing code, add features, refactor, and optimize current implementations.
---

# /enhance Command

## Usage

```
/enhance
[description of improvement needed]
```

## Examples

```
/enhance
Refactor the authentication middleware to use JWT tokens
```

```
/enhance
Add error handling to the payment processing module
```

## What It Does

This command invokes the `@vibe-implementer` agent to:

1. **Analyze Current Code**
   - Understand existing implementation
   - Identify improvement opportunities
   - Review related code

2. **Plan Changes**
   - Design improvements
   - Consider edge cases
   - Plan refactoring steps

3. **Implement Enhancements**
   - Write improved code
   - Maintain backward compatibility (when needed)
   - Follow existing patterns

4. **Quality Assurance**
   - Run tests
   - Check for regressions
   - Update documentation

## Types of Enhancements

- **Refactoring**: Improve code structure without changing behavior
- **Feature Addition**: Add new functionality
- **Performance**: Optimize speed and efficiency
- **Security**: Improve security measures
- **Maintainability**: Better naming, structure, documentation

## When to Use

- Improving existing features
- Technical debt reduction
- Performance optimization
- Code modernization
- Adding missing functionality

## Output

The agent will:
- Show before/after comparison
- Explain changes made
- Run quality checks
- Update related code
- Ensure tests pass
