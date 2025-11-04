import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

interface Row {
  id: string;
  name?: string;
  email?: string;
  age?: number | string;
  role?: string;
  [key: string]: any;
}


interface Column {
  key: string;
  label: string;
  visible: boolean;
}

interface TableState {
  columns: Column[];
  rows: Row[];
}

const initialState: TableState = {
  columns: [
    { key: 'name', label: 'Name', visible: true },
    { key: 'email', label: 'Email', visible: true },
    { key: 'age', label: 'Age', visible: true },
    { key: 'role', label: 'Role', visible: true },
  ],
  rows: [
    { id: uuidv4(), name: 'Alice Johnson', email: 'alice.johnson@example.com', age: 29, role: 'Developer', department: 'Engineering', location: 'New York' },
    { id: uuidv4(), name: 'Bob Smith', email: 'bob.smith@example.com', age: 34, role: 'Designer', department: 'Product', location: 'London' },
    { id: uuidv4(), name: 'Charlie Williams', email: 'charlie.williams@example.com', age: 41, role: 'Manager', department: 'Operations', location: 'Berlin' },
    { id: uuidv4(), name: 'Diana Roberts', email: 'diana.roberts@example.com', age: 25, role: 'QA Engineer', department: 'Quality Assurance', location: 'Toronto' },
    { id: uuidv4(), name: 'Ethan Clark', email: 'ethan.clark@example.com', age: 37, role: 'Team Lead', department: 'Engineering', location: 'San Francisco' },
    { id: uuidv4(), name: 'Fiona Patel', email: 'fiona.patel@example.com', age: 28, role: 'Marketing Specialist', department: 'Marketing', location: 'Singapore' },
    { id: uuidv4(), name: 'George Lopez', email: 'george.lopez@example.com', age: 33, role: 'Support Analyst', department: 'Customer Success', location: 'Sydney' },
    { id: uuidv4(), name: 'Hannah Green', email: 'hannah.green@example.com', age: 30, role: 'HR Executive', department: 'Human Resources', location: 'Chicago' },
    { id: uuidv4(), name: 'Ian Wright', email: 'ian.wright@example.com', age: 39, role: 'Project Manager', department: 'Engineering', location: 'New York' },
    { id: uuidv4(), name: 'Julia Adams', email: 'julia.adams@example.com', age: 27, role: 'UI/UX Designer', department: 'Product', location: 'Paris' },
    { id: uuidv4(), name: 'Kevin Brown', email: 'kevin.brown@example.com', age: 31, role: 'Business Analyst', department: 'Finance', location: 'Dubai' },
    { id: uuidv4(), name: 'Laura Chen', email: 'laura.chen@example.com', age: 26, role: 'Data Scientist', department: 'Analytics', location: 'Bangalore' },
    { id: uuidv4(), name: 'Michael Evans', email: 'michael.evans@example.com', age: 42, role: 'Director', department: 'Management', location: 'San Francisco' },
    { id: uuidv4(), name: 'Nina Gupta', email: 'nina.gupta@example.com', age: 29, role: 'Researcher', department: 'R&D', location: 'Delhi' },
    { id: uuidv4(), name: 'Oliver White', email: 'oliver.white@example.com', age: 35, role: 'Sales Executive', department: 'Sales', location: 'London' },
    { id: uuidv4(), name: 'Samuel Parker', email: 'samuel.parker@example.com', age: 36, role: 'Data Engineer', department: 'Analytics', location: 'Berlin' },
    { id: uuidv4(), name: 'Tina Wilson', email: 'tina.wilson@example.com', age: 40, role: 'HR Manager', department: 'Human Resources', location: 'Chicago' },
  ],
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload;
    },
    setRows: (state, action: PayloadAction<any[]>) => {
      state.rows = action.payload;
    },
    updateRow: (state, action: PayloadAction<{ id: string; updates: Partial<Row> }>) => {
      const index = state.rows.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.rows[index] = { ...state.rows[index], ...action.payload.updates };
      }
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.rows = state.rows.filter((r) => r.id !== action.payload);
    },
  },
});

export const { setColumns, setRows, updateRow, deleteRow } = tableSlice.actions;
export default tableSlice.reducer;
