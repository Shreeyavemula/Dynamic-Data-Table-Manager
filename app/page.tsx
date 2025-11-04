'use client';

import React, { useEffect, useState, useContext } from 'react';
import dynamic from 'next/dynamic';
import { ThemeContext } from '../src/theme/EmotionThemeProvider';

const DataTable = dynamic(() => import('../src/components/DataTable'), {
  ssr: false,
});

export default function Page() {
  const { mode } = useContext(ThemeContext);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <main
      style={{
        padding: 24,
        backgroundColor: mode === 'light' ? '#f9fafb' : '#0f172a',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease',
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '1rem',
          color: mode === 'light' ? '#111827' : '#f1f5f9',
          transition: 'color 0.3s ease',
        }}
      >
        Dynamic Data Table Manager
      </h1>

      <DataTable />
    </main>
  );
}
