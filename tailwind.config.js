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
                "primary": "#10b77f", // Updated from #10B981
                "primary-hover": "#0a8a5f",
                "secondary": "#244E5F",
                "background-light": "#f6f8f7", // Updated from #F3F4F6
                "background-dark": "#10221c", // Updated from #0f2313
                "surface-light": "#FFFFFF",
                "surface-dark": "#1F2937",
                "sidebar-dark": "#1F2937",
                "mint-soft": "#D1FAE5",
            },
            fontFamily: {
                "display": ["Plus Jakarta Sans", "Poppins", "sans-serif"],
                "sans": ["Plus Jakarta Sans", "Poppins", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "1rem", // Updated
                "lg": "2rem", // Updated
                "xl": "3rem", // Updated
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
