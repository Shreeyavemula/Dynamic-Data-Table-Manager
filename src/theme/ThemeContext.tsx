'use client';
import React, { createContext, useMemo, useState, useEffect, ReactNode } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

type ThemeContextType = {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
});

export default function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setMode('dark');
  }, []);

  // Toggle theme mode
  const toggleTheme = () => {
    setMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newMode);
      return newMode;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === 'light' ? '#1976d2' : '#90caf9' },
          background: {
            default: mode === 'light' ? '#f7f7f7' : '#121212',
            paper: mode === 'light' ? '#fff' : '#1e1e1e',
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
