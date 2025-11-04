import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'rose-blush': 'hsl(var(--rose-blush))',
        'cream': 'hsl(var(--cream))',
        'rose-gold': 'hsl(var(--rose-gold))',
        'warm-white': 'hsl(var(--warm-white))',
        'soft-pink': 'hsl(var(--soft-pink))',
        'blush-pink': 'hsl(350, 100%, 90%)',
        'deep-rose': 'hsl(340, 70%, 60%)',
        'champagne': 'hsl(30, 80%, 92%)',
        'pearl': 'hsl(30, 20%, 96%)',
        'golden': 'hsl(45, 100%, 80%)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'dancing': ['Dancing Script', 'cursive'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-romantic': 'var(--gradient-romantic)',
        'gradient-shimmer': 'var(--gradient-shimmer)',
        'gradient-warm': 'linear-gradient(135deg, hsl(350, 100%, 90%), hsl(30, 80%, 92%), hsl(350, 100%, 88%))',
        'gradient-pearl': 'linear-gradient(135deg, hsl(30, 20%, 96%), hsl(350, 100%, 97%), hsl(30, 20%, 96%))',
        'gradient-gold': 'linear-gradient(135deg, hsl(45, 100%, 80%), hsl(30, 80%, 92%), hsl(45, 100%, 85%))',
        'gradient-blush': 'linear-gradient(135deg, hsl(350, 100%, 90%), hsl(340, 70%, 60%), hsl(350, 100%, 85%))',
        'gradient-glow': 'radial-gradient(circle at center, var(--rose-blush), transparent 70%)',
        'sparkle-overlay': 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 50%)',
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'romantic': 'var(--shadow-romantic)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-15px) rotate(-2deg)" },
          "66%": { transform: "translateY(-8px) rotate(2deg)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)", filter: "blur(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)", filter: "blur(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)", filter: "blur(8px)" },
          "60%": { opacity: "0.8", transform: "scale(1.03)", filter: "blur(4px)" },
          "100%": { opacity: "1", transform: "scale(1)", filter: "blur(0)" },
        },
        "heart-beat": {
          "0%, 100%": { transform: "scale(1) rotate(0deg)" },
          "25%": { transform: "scale(1.15) rotate(-3deg)" },
          "50%": { transform: "scale(0.95) rotate(0deg)" },
          "75%": { transform: "scale(1.1) rotate(3deg)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% center", opacity: "0.5" },
          "50%": { opacity: "1" },
          "100%": { backgroundPosition: "200% center", opacity: "0.5" },
        },
        "confetti": {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "25%": { transform: "translateY(25vh) rotate(180deg)", opacity: "0.8" },
          "50%": { transform: "translateY(50vh) rotate(360deg)", opacity: "0.6" },
          "75%": { transform: "translateY(75vh) rotate(540deg)", opacity: "0.4" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
        "sparkle": {
          "0%": { opacity: "0", transform: "scale(0) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1) rotate(180deg)" },
          "100%": { opacity: "0", transform: "scale(0) rotate(360deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            opacity: "0.6", 
            transform: "scale(1)",
            boxShadow: "0 0 20px var(--rose-blush), 0 0 40px var(--rose-gold)"
          },
          "50%": { 
            opacity: "1", 
            transform: "scale(1.05)",
            boxShadow: "0 0 40px var(--rose-blush), 0 0 80px var(--rose-gold)"
          },
        },
        "magical-reveal": {
          "0%": { 
            opacity: "0", 
            transform: "scale(0.8) translateY(20px)",
            filter: "blur(15px)"
          },
          "60%": {
            opacity: "0.8",
            transform: "scale(1.1) translateY(-5px)",
            filter: "blur(5px)"
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
            filter: "blur(0)"
          }
        },
        "twinkle": {
          "0%, 100%": { 
            opacity: "0",
            transform: "scale(0) rotate(0deg)",
            filter: "blur(2px)"
          },
          "50%": {
            opacity: "1",
            transform: "scale(1) rotate(180deg)",
            filter: "blur(0)"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "fade-in": "fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-in-up": "fade-in-up 1s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scale-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "heart-beat": "heart-beat 2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "shimmer": "shimmer 4s linear infinite",
        "confetti": "confetti 4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "sparkle": "sparkle 2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "magical-reveal": "magical-reveal 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "twinkle": "twinkle 2s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 0.2s infinite",
        "sparkle-delayed": "sparkle 2s ease-in-out 0.3s infinite",
        "pulse-slow": "pulse-glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
