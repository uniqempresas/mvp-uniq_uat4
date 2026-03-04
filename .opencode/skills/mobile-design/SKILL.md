---
name: mobile-design
description: Mobile UI/UX patterns, responsive design, touch interactions, and mobile-first development.
---

# Mobile Design

> Designing for mobile: touch, performance, and constraints.

---

## 1. Mobile-First Approach

### Why Mobile-First?
- Mobile traffic dominates
- Forces focus on essentials
- Performance-conscious
- Touch-optimized

### Implementation
```css
/* Base: Mobile */
.container {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}
```

---

## 2. Touch Targets

### Minimum Sizes
- **Touch target**: 48x48dp (Android) / 44x44pt (iOS)
- **Visual size**: Can be smaller if touch target is larger

```css
.button {
  min-height: 48px;
  min-width: 48px;
  padding: 12px 24px;
}
```

---

## 3. Navigation Patterns

### Bottom Navigation
- Easy thumb reach
- 3-5 items maximum
- Current state highlighted

### Hamburger Menu
- Use sparingly
- Consider bottom sheet on mobile
- Keep frequently used items visible

### Gestures
- Swipe for actions
- Pull to refresh
- Pinch to zoom

---

## 4. Typography

### Mobile Sizes
- Base: 16px (minimum)
- Headings: 24-32px
- Body: 16-18px
- Small: 14px

### Readability
- Line height: 1.5-1.6
- Line length: 45-75 characters
- Adequate contrast

---

## 5. Performance

### Images
- Use responsive images
- Lazy loading
- WebP format
- Appropriate sizing

### Interactions
- 60fps animations
- Fast response to touch
- Progress indicators
- Skeleton screens

---

## 6. Best Practices

- ✅ Thumb-friendly zones
- ✅ Clear visual hierarchy
- ✅ Fast loading
- ✅ Offline support (where applicable)
- ✅ Test on real devices

---

> **Remember:** Mobile users are often on-the-go. Design for speed and clarity.
