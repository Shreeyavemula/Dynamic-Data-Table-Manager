'use client';

import dynamic from 'next/dynamic';
import React, { useContext } from 'react';
import { ThemeContext } from '../src/theme/EmotionThemeProvider';

const DataTable = dynamic(() => import('../src/components/DataTable'), {
  ssr: false,
});

export default function Page() {
  const { mode } = useContext(ThemeContext);

  return (
    <main
      style={{
        padding: 24,
        backgroundColor: mode === 'light' ? '#f9fafb' : '#0f172a',
        minHeight: '100vh',
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '1rem',
          color: mode === 'light' ? '#111827' : '#f1f5f9', // dynamic heading color
          transition: 'color 0.3s ease',
        }}
      >
        Dynamic Data Table Manager
      </h1>

      <DataTable />
    </main>
  );
}
