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
      primary: '#2e37a4', // Indigo-like primary from Figma
      secondary: '#0891b2',
      accent: '#f59e0b',
      background: '#f5f6f8', // Figma background
      surface: '#ffffff',
      text: '#0a1b39', // Figma text primary
      textSecondary: '#6c7688', // Figma text secondary
      border: '#e7e8eb', // Figma border
      muted: '#f1f5f9',
      link: '#2e37a4',
      linkHover: '#1e2572',
      emphasis: '#0a1b39',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0ea5e9',
    },
    dark: {
      primary: '#6366f1', // Indigo-500
      secondary: '#22d3ee',
      accent: '#fbbf24',
      background: '#0f172a', // Slate-900 (Softer than pitch black)
      surface: '#1e293b', // Slate-800 (Distinct elevation)
      text: '#f1f5f9', // Slate-100 (Clean but not piercing)
      textSecondary: '#94a3b8', // Slate-400
      border: '#334155', // Slate-700
      muted: '#1e293b',
      link: '#818cf8', // Indigo-400
      linkHover: '#a5b4fc',
      emphasis: '#0f172a',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#38bdf8',
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
