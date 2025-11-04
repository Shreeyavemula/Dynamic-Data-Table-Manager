'use client';

import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { ThemeContext } from '../theme/EmotionThemeProvider';

export default function ThemeToggle() {
  const { mode, toggleTheme } = useContext(ThemeContext);

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        color="inherit"
        onClick={toggleTheme}
        sx={{
          borderRadius: '50%',
          boxShadow: 1,
          bgcolor: mode === 'light' ? '#f1f5f9' : '#1e293b',
          '&:hover': {
            bgcolor: mode === 'light' ? '#e2e8f0' : '#334155',
          },
          transition: 'background-color 0.2s ease',
        }}
      >
        {mode === 'light' ? (
          <Brightness4 sx={{ color: '#111' }} />
        ) : (
          <Brightness7 sx={{ color: '#fff' }} />
        )}
      </IconButton>
    </Tooltip>
  );
}
