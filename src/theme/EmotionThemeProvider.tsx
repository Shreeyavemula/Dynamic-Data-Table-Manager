'use client';

import React, { createContext, useMemo, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from './emotionCache';

const clientSideEmotionCache = createEmotionCache();

export const ThemeContext = createContext({
  mode: 'light',
  toggleTheme: () => {},
});

export default function EmotionThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                background: {
                  default: '#f9fafb',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#1e293b',
                  secondary: '#475569',
                },
                primary: { main: '#00C9A7' },
                secondary: { main: '#8B5CF6' },
              }
            : {
                background: {
                  default: '#0f172a',
                  paper: '#1e293b',
                },
                text: {
                  primary: '#f8fafc',
                  secondary: '#cbd5e1',
                },
                primary: { main: '#00C9A7' },
                secondary: { main: '#E66FD2' },
              }),
        },
        typography: {
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontSize: '2rem', fontWeight: 600 },
          h2: { fontSize: '1.5rem', fontWeight: 600 },
          button: { textTransform: 'none', fontWeight: 500 },
        },
        shape: { borderRadius: 12 },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                padding: '8px 16px',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeContext.Provider value={{ mode, toggleTheme }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ThemeContext.Provider>
    </CacheProvider>
  );
}
