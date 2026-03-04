---
name: i18n-localization
description: Internationalization, localization, and multi-language support for applications.
---

# i18n Localization

> Building applications for global audiences.

---

## 1. i18n Basics

### Key Concepts
- **i18n**: Internationalization (18 letters between i and n)
- **l10n**: Localization
- **Locale**: Language + region (e.g., en-US, pt-BR)

### Common Libraries
- react-i18next (React)
- vue-i18n (Vue)
- FormatJS (universal)

---

## 2. React i18next Example

### Setup
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: 'Welcome',
          greeting: 'Hello, {{name}}!'
        }
      },
      pt: {
        translation: {
          welcome: 'Bem-vindo',
          greeting: 'Olá, {{name}}!'
        }
      }
    },
    lng: 'en',
    fallbackLng: 'en'
  });
```

### Usage
```tsx
import { useTranslation } from 'react-i18next';

function Welcome() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('greeting', { name: 'John' })}</p>
      <button onClick={() => i18n.changeLanguage('pt')}>
        Português
      </button>
    </div>
  );
}
```

---

## 3. Best Practices

- ✅ Extract all user-facing strings
- ✅ Use keys, not text
- ✅ Handle pluralization
- ✅ Consider RTL languages
- ✅ Test with real translations
- ✅ Use locale-appropriate formats

---

## 4. Date/Number Formatting

```typescript
// Dates
const date = new Date();
new Intl.DateTimeFormat('pt-BR').format(date);

// Numbers
new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
}).format(1234.56);
```

---

> **Remember:** i18n is more than translation. Consider cultural differences.
