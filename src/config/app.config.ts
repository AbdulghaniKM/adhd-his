import type { AppConfig } from './types';

export const appConfig: AppConfig = {
  app: {
    name: 'ADHDx',
    title: 'ADHDx - ADHD Decision Support System',
    description:
      'ADHDx is a decision support system for ADHD patients. It helps doctors make decisions about their patients ADHD treatment.',
    version: '1.0.0',
    author: 'Bitxero',
    url: 'https://adhdx.bitxero-iq.com',
    language: 'en',
  },

  theme: {
    defaultTheme: 'system',
    light: {
      primary: '#4f46e5', // indigo-600
      secondary: '#0ea5e9', // sky-500
      accent: '#f59e0b', // amber-500
      background: '#f8fafc', // slate-50
      surface: '#ffffff',
      text: '#0f172a', // slate-900
      textSecondary: '#64748b', // slate-500
      border: '#e2e8f0', // slate-200
      muted: '#f1f5f9', // slate-100
      link: '#4f46e5', // indigo-600
      linkHover: '#4338ca', // indigo-700
      emphasis: '#1e1b4b', // indigo-950
      success: '#10b981', // emerald-500
      warning: '#f59e0b', // amber-500
      error: '#ef4444', // red-500
      info: '#0ea5e9', // sky-500
    },
    dark: {
      primary: '#818cf8', // indigo-400
      secondary: '#38bdf8', // sky-400
      accent: '#fbbf24', // amber-400
      background: '#0f172a', // slate-900
      surface: '#1e293b', // slate-800
      text: '#f8fafc', // slate-50
      textSecondary: '#94a3b8', // slate-400
      border: '#334155', // slate-700
      muted: '#1e293b', // slate-800
      link: '#818cf8', // indigo-400
      linkHover: '#a5b4fc', // indigo-300
      emphasis: '#312e81', // indigo-900
      success: '#34d399', // emerald-400
      warning: '#fbbf24', // amber-400
      error: '#f87171', // red-400
      info: '#38bdf8', // sky-400
    },
  },

  typography: {
    fonts: [
      {
        name: 'IBM Plex Sans',
        src: '/font/IBMPlexSansArabic-Regular.ttf',
        weight: 400,
        style: 'normal',
        display: 'swap',
        preload: true,
      },
    ],
    primary: {
      family: 'IBM Plex Sans',
      fallbacks: [
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'sans-serif',
      ],
      cssVariable: 'font-primary',
    },
    secondary: {
      family: 'Georgia',
      fallbacks: ['Times New Roman', 'serif'],
      cssVariable: 'font-secondary',
    },
    mono: {
      family: 'Fira Code',
      fallbacks: ['Courier New', 'Courier', 'monospace'],
      cssVariable: 'font-mono',
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  icons: {
    favicon: '/vite.svg',
    sizes: ['192x192', '512x512'],
  },

  seo: {
    title: 'ADHDx - ADHD Decision Support System',
    description:
      'ADHDx is a decision support system for ADHD patients. It helps doctors make decisions about their patients ADHD treatment.',
    keywords: [
      'ADHD',
      'ADHDx',
      'ADHD Decision Support System',
      'ADHD Treatment',
      'ADHD Management',
      'ADHD Support',
    ],
    robots: 'index, follow',
    openGraph: {
      siteName: 'ADHDx',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
    },
  },

  layout: {
    containerMaxWidth: '1280px',
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
      '2xl': '4rem',
    },
  },
};
