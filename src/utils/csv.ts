import Papa from 'papaparse';

export function parseCsvToRows(csvText: string, requiredKeys: string[]) {
  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  const errors: string[] = [];
  const rows: any[] = [];

  if (parsed.errors && parsed.errors.length) {
    parsed.errors.forEach((e) => errors.push(e.message));
    return { rows, errors };
  }

  const data = parsed.data as any[];
  data.forEach((r, i) => {
    const missing = requiredKeys.filter((k) => !(k in r));
    if (missing.length) {
      errors.push(`Row ${i + 1} missing columns: ${missing.join(', ')}`);
      return;
    }
    rows.push({
      id: String(Math.random()).slice(2),
      ...r,
    });
  });

  return { rows, errors };
}
