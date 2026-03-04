---
name: webapp-testing
description: E2E testing with Playwright, test automation, page object model, and CI/CD integration for web applications.
---

# Web Application Testing

> End-to-end testing with Playwright for reliable web applications.

---

## 1. Testing Strategy

### What to Test

**Critical Paths (Always Test):**
- User authentication (login/logout)
- Core user journeys (checkout, signup)
- Payment flows
- Data creation/editing/deletion
- Error handling

**Secondary (Test When Time Permits):**
- UI details (spacing, colors)
- Edge cases
- All form validations
- Cross-browser specifics

### Test Independence

```typescript
// ❌ BAD: Tests depend on each other
test('create user', async () => {
  await page.goto('/signup');
  await createUser();
});

test('login', async () => {
  // Assumes user from previous test exists
  await page.goto('/login');
  await login();
});

// ✅ GOOD: Each test is independent
test('user can sign up and login', async () => {
  await page.goto('/signup');
  const user = await createUser();
  
  await page.goto('/login');
  await login(user.email, user.password);
  
  await expect(page.locator('[data-testid="welcome"]')).toBeVisible();
});
```

---

## 2. Playwright Setup

### Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('basic navigation', async ({ page }) => {
  await page.goto('/');
  
  await expect(page).toHaveTitle(/My App/);
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

---

## 3. Selectors

### Best Practices

```typescript
// ✅ GOOD: Data attributes (most stable)
await page.click('[data-testid="submit-button"]');
await page.fill('[data-testid="email-input"]', 'test@example.com');

// ✅ GOOD: Role-based (accessible)
await page.click('role=button[name="Submit"]');
await page.fill('role=textbox[name="Email"]', 'test@example.com');

// ✅ GOOD: Text content (user-centric)
await page.click('text=Sign In');
await page.click('text=/sign in/i'); // Case insensitive

// ⚠️ OK: CSS selectors
await page.click('.submit-button');

// ❌ BAD: XPath (brittle)
await page.click('xpath=//button[@id="submit"]');

// ❌ BAD: Auto-generated selectors
await page.click('#btn-123-xyz');
```

### Custom Data Attributes

```tsx
// Component
<button
  data-testid="checkout-button"
  data-loading={isLoading}
  onClick={handleCheckout}
>
  Checkout
</button>

// Test
await page.click('[data-testid="checkout-button"]');
```

---

## 4. Page Object Model

### Page Object

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  
  constructor(readonly page: Page) {
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.submitButton = page.locator('[data-testid="submit-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }
  
  async goto() {
    await this.page.goto('/login');
  }
  
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
  
  async expectError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}
```

### Using Page Objects

```typescript
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  
  await dashboardPage.expectLoaded();
  await expect(page).toHaveURL('/dashboard');
});
```

---

## 5. User Actions

### Form Interactions

```typescript
// Fill form
await page.fill('[data-testid="name"]', 'John Doe');
await page.fill('[data-testid="email"]', 'john@example.com');

// Select dropdown
await page.selectOption('[data-testid="country"]', 'USA');

// Checkboxes and radios
await page.check('[data-testid="terms"]');
await page.uncheck('[data-testid="newsletter"]');

// File upload
await page.setInputFiles('[data-testid="avatar"]', 'path/to/file.jpg');

// Clear field
await page.fill('[data-testid="search"]', 'query');
await page.clear('[data-testid="search"]');
```

### Mouse Actions

```typescript
// Click
await page.click('button');
await page.dblclick('button');
await page.hover('button');

// Right click
await page.click('button', { button: 'right' });

// Drag and drop
await page.dragAndDrop('[data-testid="item-1"]', '[data-testid="drop-zone"]');

// Scroll
await page.evaluate(() => window.scrollTo(0, 500));
```

### Keyboard Actions

```typescript
// Type with delay
await page.type('[data-testid="search"]', 'hello', { delay: 100 });

// Press keys
await page.press('[data-testid="search"]', 'Enter');
await page.press('[data-testid="search"]', 'Control+a');
await page.press('[data-testid="search"]', 'Backspace');
```

---

## 6. Assertions

### Element State

```typescript
// Visibility
await expect(page.locator('h1')).toBeVisible();
await expect(page.locator('.loading')).toBeHidden();

// Content
await expect(page.locator('h1')).toHaveText('Welcome');
await expect(page.locator('h1')).toContainText('Welcome');
await expect(page.locator('input')).toHaveValue('test@example.com');

// Attributes
await expect(page.locator('img')).toHaveAttribute('src', '/logo.png');
await expect(page.locator('button')).toHaveClass('primary');

// Count
await expect(page.locator('.item')).toHaveCount(5);

// Enabled/disabled
await expect(page.locator('button')).toBeEnabled();
await expect(page.locator('button')).toBeDisabled();
```

### Page State

```typescript
// URL
await expect(page).toHaveURL('/dashboard');
await expect(page).toHaveURL(/.*dashboard.*/);

// Title
await expect(page).toHaveTitle('Dashboard');

// Screenshot
await expect(page).toHaveScreenshot('dashboard.png');
```

---

## 7. Waiting Strategies

### Auto-waiting

Playwright automatically waits for elements to be actionable:

```typescript
// Automatically waits for button to be visible and enabled
await page.click('button');

// Automatically waits for text to appear
await expect(page.locator('.status')).toHaveText('Loaded');
```

### Explicit Waits

```typescript
// Wait for navigation
await Promise.all([
  page.waitForNavigation(),
  page.click('a'),
]);

// Wait for request/response
await Promise.all([
  page.waitForResponse('**/api/users'),
  page.click('[data-testid="load-users"]'),
]);

// Wait for element
await page.waitForSelector('[data-testid="loaded"]');

// Wait for timeout (avoid when possible)
await page.waitForTimeout(1000);
```

### Custom Wait Conditions

```typescript
// Wait for function to return true
await page.waitForFunction(() => {
  return document.querySelector('.item')?.textContent === 'Ready';
});

// Wait for specific state
await page.waitForLoadState('networkidle');
```

---

## 8. Test Data Management

### API Setup

```typescript
test.beforeEach(async ({ request }) => {
  // Create test user via API
  await request.post('/api/test/users', {
    data: {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    }
  });
});

test.afterEach(async ({ request }) => {
  // Clean up
  await request.delete('/api/test/users/test@example.com');
});
```

### Database Seeding

```typescript
// setup.ts
export async function setupTestData() {
  await db.insert(users).values({
    id: 'test-user',
    email: 'test@example.com',
    name: 'Test User'
  });
}

export async function cleanupTestData() {
  await db.delete(users).where(eq(users.id, 'test-user'));
}
```

---

## 9. Visual Testing

### Screenshots

```typescript
test('visual regression', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Full page screenshot
  await expect(page).toHaveScreenshot('dashboard.png', {
    fullPage: true
  });
  
  // Element screenshot
  await expect(page.locator('[data-testid="chart"]'))
    .toHaveScreenshot('chart.png');
});
```

### Masking Dynamic Content

```typescript
test('visual regression with masked date', async ({ page }) => {
  await page.goto('/report');
  
  await expect(page).toHaveScreenshot('report.png', {
    mask: [page.locator('[data-testid="current-date"]')]
  });
});
```

---

## 10. CI/CD Integration

### GitHub Actions

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run Playwright tests
        run: npx playwright test
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: |
            playwright-report/
            test-results/
```

---

## 11. Debugging

### Debug Mode

```bash
# Run in debug mode
npx playwright test --debug

# Step through each action
npx playwright test --headed --slowmo 500

# Show browser
npx playwright test --headed
```

### Trace Viewer

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'on-first-retry', // Record trace on first retry
  },
});

// View trace
npx playwright show-trace trace.zip
```

### Console Logs

```typescript
test('capture console logs', async ({ page }) => {
  const logs = [];
  page.on('console', msg => logs.push(msg.text()));
  
  await page.goto('/');
  
  console.log('Console logs:', logs);
});
```

---

## 12. Best Practices

### Do:
✅ Use data-testid attributes
✅ Keep tests independent
✅ Use Page Object Model for complex apps
✅ Test critical user journeys
✅ Run tests in CI
✅ Use parallel execution
✅ Take screenshots on failure
✅ Clean up test data

### Don't:
❌ Depend on test order
❌ Use arbitrary waits (waitForTimeout)
❌ Test implementation details
❌ Share state between tests
❌ Ignore flaky tests
❌ Test everything (focus on critical paths)

---

> **Remember:** E2E tests are expensive. Use them for critical paths and user workflows. Unit and integration tests should cover the rest.
