/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "surface": "#fcfdf8",
        "surface-dim": "#dcdeda",
        "surface-bright": "#fcfdf8",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f7f2",
        "surface-container": "#f0f1ec",
        "surface-container-high": "#eaebe6",
        "surface-container-highest": "#e4e6e0",
        "on-surface": "#1a1c19",
        "on-surface-variant": "#43483f",
        "inverse-surface": "#2e312d",
        "inverse-on-surface": "#eff1ed",
        "outline": "#73796f",
        "outline-variant": "#c3c8bc",
        "surface-tint": "#1a6c31",
        
        "primary": "#1a6c31",
        "on-primary": "#ffffff",
        "primary-container": "#a2f6aa",
        "on-primary-container": "#002107",
        "inverse-primary": "#87d990",
        
        "secondary": "#52634f",
        "on-secondary": "#ffffff",
        "secondary-container": "#d4e8ce",
        "on-secondary-container": "#101f10",
        
        "tertiary": "#38656a",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#bcebf0",
        "on-tertiary-container": "#002023",
        
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#410002",
        
        "primary-fixed": "#a2f6aa",
        "primary-fixed-dim": "#87d990",
        "on-primary-fixed": "#002107",
        "on-primary-fixed-variant": "#00531a",
        
        "secondary-fixed": "#d4e8ce",
        "secondary-fixed-dim": "#b8ccb3",
        "on-secondary-fixed": "#101f10",
        "on-secondary-fixed-variant": "#3a4b39",
        
        "tertiary-fixed": "#bcebf0",
        "tertiary-fixed-dim": "#a0cfd4",
        "on-tertiary-fixed": "#001f23",
        "on-tertiary-fixed-variant": "#1f4d52",
        
        "background": "#fcfdf8",
        "on-background": "#1a1c19",
        "surface-variant": "#e4e6e0"
      },
      borderRadius: {
        "sm": "0.25rem",
        "DEFAULT": "0.5rem",
        "md": "0.75rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "full": "9999px"
      },
      spacing: {
        "base": "8px",
        "container-max": "1280px",
        "gutter": "24px",
        "margin-mobile": "16px",
        "margin-desktop": "32px",
        "sidebar-width": "280px",
        "toolbar-height": "4rem",
        "margin-page": "2rem",
        "stack-gap": "1rem"
      },
      fontFamily: {
        "display-lg": ["Hanken Grotesk", "sans-serif"],
        "headline-lg": ["Hanken Grotesk", "sans-serif"],
        "headline-lg-mobile": ["Hanken Grotesk", "sans-serif"],
        "headline-md": ["Hanken Grotesk", "sans-serif"],
        "body-lg": ["Hanken Grotesk", "sans-serif"],
        "body-md": ["Hanken Grotesk", "sans-serif"],
        "label-md": ["JetBrains Mono", "monospace"],
        "label-sm": ["JetBrains Mono", "monospace"]
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.02em", fontWeight: "500" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }]
      }
    },
  },
  plugins: [],
  daisyui: {
    themes: [
      {
        "openpetal-light": {
          "primary": "#1a6c31",
          "primary-content": "#ffffff",
          "secondary": "#52634f",
          "secondary-content": "#ffffff",
          "accent": "#38656a", 
          "accent-content": "#ffffff",
          "neutral": "#2e312d",
          "neutral-content": "#eff1ed",
          "base-100": "#fcfdf8", // Background/Surface
          "base-200": "#f6f7f2", // Surface Container Low
          "base-300": "#f0f1ec", // Surface Container
          "base-content": "#1a1c19", // On-Surface
          "info": "#bcebf0", // Tertiary Fixed
          "success": "#d4e8ce", // Secondary Container
          "warning": "#e4e6e0", // Surface Variant
          "error": "#ba1a1a",
          "error-content": "#ffffff",
          
          // CRITICAL: Enforcing the "Sharp Edges Only" rule globally
          "--rounded-box": "0", 
          "--rounded-btn": "0", 
          "--rounded-badge": "0", 
          "--tab-radius": "0", 
        },
      },
    ],
    // It tells daisyUI to use your light theme even if the user's OS is in Dark Mode
    darkTheme: "openpetal-light",
  },
}