/** Design tokens for the Emergency Services Directory */
export const theme = {
  colors: {
    // Primary palette — vibrant cyan/turquoise
    primary: {
      50: '#ecf9ff',
      100: '#cff1ff',
      200: '#a6e7ff',
      300: '#6fdaff',
      400: '#33cdff',
      500: '#00bfff',
      600: '#00a8e8',
      700: '#0091d9',
      800: '#0074b1',
      900: '#005a8a',
    },
    // Accent — vibrant coral
    accent: {
      50: '#fff5f1',
      100: '#ffe7db',
      200: '#ffd4bb',
      300: '#ffc29b',
      400: '#ff9d66',
      500: '#ff7a3d',
      600: '#ff6b1f',
      700: '#ff5500',
      800: '#e63900',
      900: '#cc2200',
    },
    // Semantic — ambulance vibrant red
    ambulance: {
      bg: '#fff5f5',
      text: '#ff0000',
      border: '#ff6b6b',
      badge: '#ff3333',
    },
    // Semantic — doctor vibrant green
    doctor: {
      bg: '#f0fdf4',
      text: '#00cc44',
      border: '#66ff99',
      badge: '#00ee55',
    },
    // Neutrals
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712',
    },
    // Status
    success: '#00ee55',
    error: '#ff3333',
    warning: '#ff7a3d',
    info: '#33cdff',
    // Background
    background: '#f8fafc',
    surface: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  radii: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '350ms ease',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;

export type Theme = typeof theme;
