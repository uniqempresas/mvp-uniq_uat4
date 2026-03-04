---
name: nextjs-best-practices
description: Next.js 14+ App Router best practices, Server Components, Client Components, Server Actions, and performance optimization.
---

# Next.js Best Practices

> Building modern, performant applications with Next.js App Router.

---

## 1. App Router Architecture

### Server Components (Default)

```tsx
// Server Component by default (no 'use client')
// Runs on server, sends zero JavaScript to client
export default async function Page() {
  const data = await fetchData(); // Server-side data fetching
  
  return (
    <main>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </main>
  );
}
```

**Benefits:**
- Zero client-side JavaScript
- Direct backend access
- Automatic caching
- Better SEO

### Client Components

```tsx
'use client';

// Only use when you need:
// - useState/useEffect
// - Browser APIs
// - Event handlers
// - Custom hooks

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

**When to use 'use client':**
- Interactivity required
- useState, useEffect, useContext
- Browser-only APIs (window, document, localStorage)
- Custom hooks that use client features

---

## 2. Data Fetching

### Server Components (Recommended)

```tsx
// Fetch directly in Server Component
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

### Client Components

```tsx
'use client';

import useSWR from 'swr';

export default function ClientData() {
  const { data, error, isLoading } = useSWR(
    '/api/data',
    fetcher
  );
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data.title}</div>;
}
```

---

## 3. Server Actions

```tsx
// app/actions.ts
'use server';

export async function createUser(formData: FormData) {
  'use server';
  
  const name = formData.get('name');
  const email = formData.get('email');
  
  // Validation
  if (!name || !email) {
    throw new Error('Name and email are required');
  }
  
  // Database operation
  await db.insert(users).values({ name, email });
  
  // Revalidate cache
  revalidatePath('/users');
}
```

### Using in Components

```tsx
// Server Component
import { createUser } from './actions';

export default function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" placeholder="Name" />
      <input name="email" type="email" placeholder="Email" />
      <button type="submit">Create User</button>
    </form>
  );
}
```

---

## 4. Routing

### Dynamic Routes

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ 
  params 
}: { 
  params: { slug: string } 
}) {
  return <h1>Post: {params.slug}</h1>;
}

// Generate static params at build time
export async function generateStaticParams() {
  const posts = await fetchPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

### Catch-all Segments

```tsx
// app/shop/[...slug]/page.tsx
// Matches: /shop/clothes/t-shirts
export default function Shop({ 
  params 
}: { 
  params: { slug: string[] } 
}) {
  // params.slug = ['clothes', 't-shirts']
  return <div>Category: {params.slug.join('/')}</div>;
}
```

### Route Groups

```tsx
// (marketing)/page.tsx      → /
// (marketing)/about/page.tsx → /about
// (shop)/products/page.tsx   → /products
```

---

## 5. Caching Strategies

### Fetch Options

```tsx
// Default: Cache forever
fetch('https://api.example.com/data');

// Revalidate every hour
fetch('https://api.example.com/data', {
  next: { revalidate: 3600 }
});

// No cache
fetch('https://api.example.com/data', {
  cache: 'no-store'
});

// Dynamic data
fetch('https://api.example.com/data', {
  next: { tags: ['collection'] }
});

// Revalidate by tag
revalidateTag('collection');
```

### Route Segment Config

```tsx
// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Force static generation
export const dynamic = 'force-static';

// Revalidate time (seconds)
export const revalidate = 60;
```

---

## 6. Error Handling

### Error Boundaries

```tsx
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Global Error

```tsx
// app/global-error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

---

## 7. Loading States

```tsx
// app/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
    </div>
  );
}
```

### Streaming with Suspense

```tsx
import { Suspense } from 'react';
import PostFeed from './PostFeed';
import Weather from './Weather';

export default function Page() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
    </section>
  );
}
```

---

## 8. Metadata

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Page',
  description: 'Description of my page',
  keywords: ['nextjs', 'react', 'web'],
  
  openGraph: {
    title: 'My Page',
    description: 'Description',
    images: ['/og-image.jpg'],
  },
  
  robots: {
    index: true,
    follow: true,
  },
  
  alternates: {
    canonical: 'https://example.com/page',
  },
};
```

### Dynamic Metadata

```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id);
  
  return {
    title: product.name,
    description: product.description,
  };
}
```

---

## 9. Image Optimization

```tsx
import Image from 'next/image';

export default function Page() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority // Above the fold
      quality={75}
    />
  );
}
```

### Remote Images

```tsx
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
    ],
  },
};
```

---

## 10. Middleware

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check auth token
  const token = request.cookies.get('token');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
};
```

---

## 11. API Routes

```tsx
// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await db.select().from(usersTable);
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // Validation
  if (!body.name || !body.email) {
    return NextResponse.json(
      { error: 'Name and email required' },
      { status: 400 }
    );
  }
  
  const user = await db.insert(usersTable).values(body).returning();
  return NextResponse.json(user[0], { status: 201 });
}
```

---

## 12. Performance Checklist

- [ ] Use Server Components by default
- [ ] Minimize Client Components
- [ ] Optimize images with next/image
- [ ] Use proper caching strategies
- [ ] Implement streaming with Suspense
- [ ] Lazy load below-the-fold content
- [ ] Use dynamic imports for heavy components
- [ ] Implement proper loading states
- [ ] Monitor Core Web Vitals

---

> **Remember:** Server Components are the default in App Router. Only use Client Components when necessary.
