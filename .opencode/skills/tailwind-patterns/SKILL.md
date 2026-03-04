---
name: tailwind-patterns
description: Tailwind CSS v4 patterns, utility classes, responsive design, and custom configurations. Triggers on tailwind, css, styling, responsive.
---

# Tailwind CSS Patterns

> Utility-first CSS framework for rapid, consistent styling.

---

## 1. Core Concepts

### Utility-First Approach

```html
<!-- ❌ BAD: Traditional CSS -->
<div class="card">
  <h2 class="card-title">Title</h2>
  <p class="card-text">Content</p>
</div>

<style>
  .card { padding: 1rem; border: 1px solid #ccc; }
  .card-title { font-size: 1.25rem; font-weight: bold; }
</style>

<!-- ✅ GOOD: Tailwind utilities -->
<div class="p-4 border border-gray-300 rounded-lg">
  <h2 class="text-xl font-bold">Title</h2>
  <p class="text-gray-600">Content</p>
</div>
```

### Benefits
- No context switching between HTML and CSS
- Consistent design system
- Smaller CSS bundle (purged)
- Responsive by default

---

## 2. Common Patterns

### Layout

```html
<!-- Flexbox -->
<div class="flex items-center justify-between gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Grid -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

<!-- Container -->
<div class="container mx-auto px-4 max-w-7xl">
  <!-- Content -->
</div>
```

### Spacing (8-Point Grid)

```
1  = 0.25rem  (4px)
2  = 0.5rem   (8px)
4  = 1rem     (16px)
6  = 1.5rem   (24px)
8  = 2rem     (32px)
12 = 3rem     (48px)
16 = 4rem     (64px)
```

```html
<!-- Padding -->
<div class="p-4">All sides</div>
<div class="px-4 py-2">Horizontal / Vertical</div>
<div class="pt-4 pr-2 pb-4 pl-2">Individual</div>

<!-- Margin -->
<div class="m-4">All sides</div>
<div class="mx-auto">Center horizontally</div>
<div class="mt-8 mb-4">Top / Bottom</div>

<!-- Gap -->
<div class="flex gap-4">Flex gap</div>
<div class="grid gap-x-4 gap-y-2">Grid gap</div>
```

### Typography

```html
<!-- Font sizes -->
<p class="text-sm">Small text</p>
<p class="text-base">Base text</p>
<p class="text-lg">Large text</p>
<h1 class="text-4xl font-bold">Heading</h1>

<!-- Font weights -->
<p class="font-normal">Normal</p>
<p class="font-medium">Medium</p>
<p class="font-semibold">Semibold</p>
<p class="font-bold">Bold</p>

<!-- Colors -->
<p class="text-gray-900">Dark gray</p>
<p class="text-blue-600">Blue</p>
<p class="text-red-500">Red</p>

<!-- Line height -->
<p class="leading-relaxed">Relaxed</p>
<p class="leading-tight">Tight</p>
```

---

## 3. Responsive Design

### Breakpoints

```
sm: 640px   (mobile landscape)
md: 768px   (tablet)
lg: 1024px  (desktop)
xl: 1280px  (large desktop)
2xl: 1536px (extra large)
```

### Mobile-First Approach

```html
<!-- Base styles apply to mobile -->
<!-- md: applies to 768px and up -->
<!-- lg: applies to 1024px and up -->

<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- Full width on mobile, half on tablet, third on desktop -->
</div>

<!-- Stack on mobile, side-by-side on desktop -->
<div class="flex flex-col md:flex-row gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<!-- Hide on mobile, show on desktop -->
<div class="hidden md:block">
  Desktop only content
</div>
```

### Common Responsive Patterns

```html
<!-- Navigation -->
<nav class="flex flex-col md:flex-row justify-between items-center">
  <div>Logo</div>
  <div class="flex flex-col md:flex-row gap-4">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
  </div>
</nav>

<!-- Cards grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <!-- Cards -->
</div>

<!-- Text sizes -->
<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive heading
</h1>
```

---

## 4. Components

### Buttons

```html
<!-- Primary button -->
<button class="
  px-6 py-3
  bg-blue-600 hover:bg-blue-700
  text-white font-semibold
  rounded-lg
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Click me
</button>

<!-- Secondary button -->
<button class="
  px-6 py-3
  border-2 border-blue-600
  text-blue-600 hover:bg-blue-50
  font-semibold
  rounded-lg
  transition-colors duration-200
">
  Secondary
</button>

<!-- Button sizes -->
<button class="px-4 py-2 text-sm">Small</button>
<button class="px-6 py-3 text-base">Medium</button>
<button class="px-8 py-4 text-lg">Large</button>
```

### Cards

```html
<!-- Basic card -->
<div class="bg-white rounded-lg shadow-md p-6">
  <h3 class="text-xl font-bold mb-2">Card Title</h3>
  <p class="text-gray-600 mb-4">Card description</p>
  <button class="text-blue-600 hover:text-blue-800">
    Learn more →
  </button>
</div>

<!-- Card with image -->
<div class="bg-white rounded-lg shadow-md overflow-hidden">
  <img src="image.jpg" alt="" class="w-full h-48 object-cover" />
  <div class="p-6">
    <h3 class="text-xl font-bold mb-2">Card Title</h3>
    <p class="text-gray-600">Description</p>
  </div>
</div>

<!-- Hover effects -->
<div class="
  bg-white rounded-lg shadow-md p-6
  hover:shadow-lg hover:-translate-y-1
  transition-all duration-200
">
  <!-- Content -->
</div>
```

### Forms

```html
<form class="space-y-4">
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      Email
    </label>
    <input
      type="email"
      class="
        w-full px-4 py-2
        border border-gray-300 rounded-lg
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        outline-none
      "
      placeholder="you@example.com"
    />
  </div>
  
  <button class="
    w-full px-6 py-3
    bg-blue-600 hover:bg-blue-700
    text-white font-semibold
    rounded-lg
    transition-colors
  ">
    Submit
  </button>
</form>
```

---

## 5. Custom Configuration

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      spacing: {
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 6. Dark Mode

```typescript
// tailwind.config.ts
export default {
  darkMode: 'class', // or 'media'
  // ...
};
```

```html
<!-- Dark mode classes -->
<div class="bg-white dark:bg-gray-900">
  <p class="text-gray-900 dark:text-white">
    Content adapts to theme
  </p>
</div>

<!-- Toggle -->
<button class="
  p-2 rounded-lg
  bg-gray-200 dark:bg-gray-700
  text-gray-800 dark:text-gray-200
">
  Toggle theme
</button>
```

---

## 7. Best Practices

### Do:
✅ Use `@apply` sparingly (prefer utilities)
✅ Extract components when patterns repeat
✅ Use semantic HTML
✅ Ensure sufficient color contrast
✅ Test on real devices

### Don't:
❌ Use arbitrary values excessively
❌ Create custom classes for single use
❌ Ignore accessibility
❌ Hardcode colors (use config)
❌ Overuse !important

### Component Extraction (When to Use @apply)

```css
/* Only for frequently repeated patterns */
@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-blue-600 text-white rounded-lg
           hover:bg-blue-700 transition-colors;
  }
}
```

---

## 8. Common Utilities Cheat Sheet

### Layout
- `container`, `mx-auto`
- `flex`, `grid`, `block`, `inline-block`, `hidden`
- `items-center`, `justify-between`, `gap-4`
- `w-full`, `h-screen`, `max-w-md`

### Spacing
- `p-4`, `m-4`, `px-4`, `py-2`, `space-y-4`

### Typography
- `text-sm`, `text-lg`, `font-bold`, `text-center`
- `text-gray-600`, `text-blue-500`

### Borders
- `border`, `border-2`, `rounded-lg`, `rounded-full`
- `border-gray-300`, `border-red-500`

### Effects
- `shadow-md`, `shadow-lg`
- `opacity-50`, `opacity-0`, `opacity-100`
- `transition`, `duration-200`, `ease-in-out`

### Interactivity
- `cursor-pointer`, `hover:bg-blue-600`
- `focus:ring-2`, `focus:outline-none`
- `disabled:opacity-50`

---

> **Remember:** Tailwind is about consistency. Stick to the design system and avoid arbitrary values when possible.
