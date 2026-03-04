---
name: lint-and-validate
description: Linting, code formatting, type checking, and automated validation for code quality.
---

# Lint and Validate

> Automated code quality checks and formatting.

---

## 1. ESLint

### Configuration
```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### Commands
```bash
npm run lint          # Check for issues
npm run lint:fix      # Fix auto-fixable issues
```

---

## 2. Prettier

### Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### Commands
```bash
npm run format        # Format all files
npm run format:check  # Check formatting
```

---

## 3. TypeScript

### Commands
```bash
npx tsc --noEmit      # Type check without emitting
npx tsc --watch       # Watch mode
```

---

## 4. Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  }
}
```

---

## 5. CI Integration

```yaml
- name: Lint
  run: npm run lint

- name: Type Check
  run: npx tsc --noEmit

- name: Format Check
  run: npm run format:check
```

---

## 6. Best Practices

- ✅ Run linting before commits
- ✅ Fix errors immediately
- ✅ Use consistent configuration
- ✅ Integrate with CI/CD
- ✅ Don't disable rules without reason

---

> **Remember:** Automated checks catch errors early. Don't skip them.
