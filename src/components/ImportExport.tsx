'use client';

import Papa, { ParseResult } from 'papaparse';
import { saveAs } from 'file-saver';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRows } from '../slices/tableSlice';
import { RootState } from '../store';
import { Button, Snackbar, Alert } from '@mui/material';

// 🧩 Local CSV row type to avoid collision with Redux Row
type CSVRow = Record<string, string | number | boolean | null | undefined>;

export default function ImportExport() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const { rows, columns } = useSelector((s: RootState) => s.table);
  const [error, setError] = useState<string | null>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<CSVRow>) => {
        if (!Array.isArray(results.data)) {
          setError('Invalid CSV format.');
          return;
        }

        try {
          const parsedRows: CSVRow[] = results.data.map((row: CSVRow) => ({
            id: crypto.randomUUID(),
            ...row,
          }));

          dispatch(setRows(parsedRows));
          setError(null);
        } catch {
          setError('Error parsing CSV data.');
        }
      },
      error: () => setError('Error reading CSV file.'),
    });
  };

  const handleExport = () => {
    const visibleCols = columns.filter((c) => c.visible);
    const csvRows = rows.map((r: CSVRow) => {
      const filtered: CSVRow = {};
      visibleCols.forEach((c) => {
        filtered[c.label] = r[c.key] ?? '';
      });
      return filtered;
    });

    const csv = Papa.unparse(csvRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'table_export.csv');
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImport}
      />

      <Button variant="outlined" color="primary" onClick={() => fileInputRef.current?.click()}>
        Import CSV
      </Button>

      <Button variant="contained" color="secondary" onClick={handleExport} sx={{ ml: 1 }}>
        Export CSV
      </Button>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
