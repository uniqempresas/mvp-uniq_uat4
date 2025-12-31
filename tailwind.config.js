/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#10B981",
                "primary-dark": "#059669",
                "background-light": "#F3F4F6",
                "background-dark": "#111827",
                "surface-light": "#FFFFFF",
                "surface-dark": "#1F2937",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "0.75rem",
                "xl": "1rem",
                "2xl": "1.5rem",
                "full": "9999px"
            },
            boxShadow: {
                "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                "card": "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
            }
        },
    },
    plugins: [],
}
