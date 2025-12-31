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
                "primary-hover": "#059669", // Renamed from primary-dark to match HTML request if needed, but keeping primary-dark as alias or just adding primary-hover
                "primary-dark": "#059669", // Keeping existing
                "secondary": "#244E5F",
                "background-light": "#F3F4F6",
                "background-dark": "#0f2313", // Updated to match HTML
                "surface-light": "#FFFFFF",
                "surface-dark": "#1F2937",
                "sidebar-dark": "#1F2937",
                "mint-soft": "#D1FAE5",
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
                "card": "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
                "soft": "0 4px 20px -2px rgba(0, 0, 0, 0.05)"
            }
        },
    },
    plugins: [],
}
