/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Cores inspiradas no Plane.so
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#3f76ff", // Azul característico do Plane
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#f4f5f7",
                    foreground: "#1f2937",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "#f4f5f7",
                    foreground: "#6b7280",
                },
                accent: {
                    DEFAULT: "#f4f5f7",
                    foreground: "#111827",
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Fonte padrão
            }
        },
    },
    plugins: [],
}
