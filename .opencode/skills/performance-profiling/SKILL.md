---
name: performance-profiling
description: Performance profiling, bottleneck identification, Web Vitals, and optimization techniques.
---

# Performance Profiling

> Identifying and fixing performance bottlenecks.

---

## 1. Core Web Vitals

### Metrics
- **LCP**: Largest Contentful Paint (< 2.5s good)
- **FID**: First Input Delay (< 100ms good)
- **CLS**: Cumulative Layout Shift (< 0.1 good)
- **INP**: Interaction to Next Paint (< 200ms good)

### Measurement
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

---

## 2. Profiling Tools

### Browser DevTools
- Performance tab
- Memory tab
- Network tab
- Lighthouse

### React DevTools Profiler
- Component render times
- Re-render tracking
- Flame graphs

### Node.js Profiler
```bash
node --prof app.js
node --prof-process isolate-0x*.log > profile.txt
```

---

## 3. Common Bottlenecks

### Frontend
- Large bundles
- Unoptimized images
- Excessive re-renders
- Blocking JavaScript

### Backend
- N+1 queries
- Missing indexes
- Synchronous operations
- Memory leaks

---

## 4. Optimization Strategies

### Code Splitting
```typescript
const Dashboard = lazy(() => import('./Dashboard'));
```

### Memoization
```typescript
const memoizedValue = useMemo(() => computeExpensive(a, b), [a, b]);
```

### Debouncing
```typescript
const debouncedSearch = debounce(handleSearch, 300);
```

---

## 5. Best Practices

- ✅ Profile before optimizing
- ✅ Measure impact
- ✅ Focus on user-visible metrics
- ✅ Test on real devices
- ✅ Monitor continuously

---

> **Remember:** Premature optimization is the root of all evil. Measure first.
