---
name: code-review-checklist
description: Code review standards, best practices, and systematic review process for quality assurance.
---

# Code Review Checklist

> Systematic code review process for quality assurance.

---

## 1. Review Process

### Before Review
- [ ] Understand the context
- [ ] Read the ticket/requirement
- [ ] Check related PRs/commits

### During Review
- [ ] Review in small chunks
- [ ] Run the code locally if needed
- [ ] Check tests
- [ ] Verify edge cases

### After Review
- [ ] Provide constructive feedback
- [ ] Approve or request changes
- [ ] Follow up on comments

---

## 2. Checklist

### Functionality
- [ ] Does it do what it's supposed to?
- [ ] Are edge cases handled?
- [ ] Is error handling adequate?
- [ ] Are there any obvious bugs?

### Code Quality
- [ ] Is the code readable?
- [ ] Are names descriptive?
- [ ] Is the code well-structured?
- [ ] Is there unnecessary complexity?

### Testing
- [ ] Are there adequate tests?
- [ ] Do tests cover edge cases?
- [ ] Are tests meaningful?
- [ ] Is test coverage sufficient?

### Security
- [ ] Are there SQL injection risks?
- [ ] Is input validated?
- [ ] Are secrets handled properly?
- [ ] Are there XSS vulnerabilities?

### Performance
- [ ] Any obvious performance issues?
- [ ] Unnecessary database queries?
- [ ] Memory leaks?
- [ ] Algorithmic efficiency?

### Maintainability
- [ ] Is the code documented?
- [ ] Are there TODOs to address?
- [ ] Is the code DRY?
- [ ] Will future developers understand this?

---

## 3. Review Comments

### Good Comments
```
✅ "Consider extracting this logic into a separate function for readability"
✅ "This variable name is unclear. Could we use 'userCount' instead?"
✅ "Should we handle the case where the API returns null?"
```

### Bad Comments
```
❌ "This is wrong"
❌ "Fix this"
❌ "I wouldn't do it this way"
```

---

## 4. Approving Code

- ✅ Approve when satisfied
- ✅ Approve with minor comments
- ✅ Request changes for major issues
- ✅ Never approve code you don't understand

---

> **Remember:** Code review is about code, not the person. Be kind and constructive.
