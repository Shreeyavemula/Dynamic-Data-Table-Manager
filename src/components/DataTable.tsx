'use client';

import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { deleteRow, updateRow, setRows } from '../slices/tableSlice';
import ManageColumnsModal from './ManageColumnsModal';
import ImportExport from './ImportExport';
import ThemeToggle from './ThemeToggle';
import { useForm, Controller } from 'react-hook-form';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTheme } from '@mui/material/styles';

export default function DataTable() {
  // Redux state
  const columns = useSelector((s: RootState) =>
    s.table.columns.filter((c) => c.visible)
  );
  const allRows = useSelector((s: RootState) => s.table.rows);
  const dispatch = useDispatch();

  // Theme context
  const theme = useTheme();
  const mode = theme.palette.mode;

  // Local UI state
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [manageOpen, setManageOpen] = useState(false);
  const [editingIds, setEditingIds] = useState<string[]>([]);
  const rowsPerPage = 10;

  const { control, handleSubmit, reset } = useForm({ mode: 'onChange' });

  // 🔍 Filtering + Sorting logic
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let data = [...allRows];

    if (q) {
      data = data.filter((r) =>
        Object.values(r).some((v) => String(v).toLowerCase().includes(q))
      );
    }

    if (sortKey) {
      data.sort((a, b) => {
        const A = (a as Record<string, any>)[sortKey] ?? '';
        const B = (b as Record<string, any>)[sortKey] ?? '';
        if (A === B) return 0;
        return sortDir === 'asc' ? (A > B ? 1 : -1) : (A > B ? -1 : 1);
      });
    }

    return data;
  }, [allRows, search, sortKey, sortDir]);


  const pageRows = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Editing handlers
  const startEdit = (id: string) => {
    if (!editingIds.includes(id)) {
      const rowData = allRows.find((r) => r.id === id);
      if (rowData) {
        // Populate form with this row’s data
        reset({ [id]: rowData });
      }
      setEditingIds((prev) => [...prev, id]);
    }
  };
  

  const cancelAll = () => {
    setEditingIds([]);
    reset();
  };

  const onSave = (data: any) => {
    console.log('Form Data:', data); // 👀 check what is captured
    Object.entries(data).forEach(([id, values]: [string, any]) => {
      dispatch(updateRow({ id, updates: values }));
    });
    setEditingIds([]);
  };
  

  // DnD for row reordering
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = allRows.findIndex((r) => r.id === active.id);
    const newIndex = allRows.findIndex((r) => r.id === over.id);

    const updated = [...allRows];
    const [moved] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, moved);

    dispatch(setRows(updated));
  };

  return (
    <Paper sx={{ p: 2 }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ImportExport />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outlined" onClick={() => setManageOpen(true)}>
            Manage Columns
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSave)}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <TableContainer>
            <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: mode === 'light' ? '#f3f4f6' : '#1e293b', // header background
                }}
              >
                {columns.map((c) => (
                  <TableCell
                    key={c.key}
                    onClick={() => {
                      if (sortKey === c.key)
                        setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                      else {
                        setSortKey(c.key);
                        setSortDir('asc');
                      }
                    }}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: 600,
                      userSelect: 'none',
                      color: mode === 'light' ? '#111827' : '#e2e8f0', // dynamic color
                      whiteSpace: 'nowrap',
                      verticalAlign: 'middle',
                      transition: 'color 0.3s ease, background-color 0.3s ease',
                    }}
                  >
                    {c.label}
                    {sortKey === c.key && (
                      <span
                        style={{
                          fontSize: 14,
                          marginLeft: 6,
                          color: mode === 'light' ? '#111827' : '#94a3b8',
                        }}
                      >
                        {sortDir === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </TableCell>
                ))}
                <TableCell
                  sx={{
                    color: mode === 'light' ? '#111827' : '#e2e8f0',
                    fontWeight: 600,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>


              <SortableContext
                items={pageRows.map((r) => r.id)}
                strategy={verticalListSortingStrategy}
              >
                <TableBody>
                  {pageRows.map((row) => (
                    <SortableRow
                      key={row.id}
                      id={row.id}
                      row={row}
                      columns={columns}
                      editingIds={editingIds}
                      startEdit={startEdit}
                      control={control}
                      dispatch={dispatch}
                      deleteRow={deleteRow}
                      updateRow={updateRow}
                      cancelRowEdit={() =>
                        setEditingIds(editingIds.filter((id) => id !== row.id))
                      }
                    />
                  ))}
                </TableBody>
              </SortableContext>
            </Table>
          </TableContainer>
        </DndContext>

        {editingIds.length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <Button type="submit" variant="contained" color="success">
              Save All
            </Button>
            <Button onClick={cancelAll} variant="outlined" color="error">
              Cancel All
            </Button>
          </div>
        )}
      </form>

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
      />

      <ManageColumnsModal open={manageOpen} onClose={() => setManageOpen(false)} />
    </Paper>
  );
}

// 🧩 SortableRow for draggable rows
function SortableRow({
  id,
  row,
  columns,
  editingIds,
  startEdit,
  control,
  dispatch,
  deleteRow,
  updateRow,
  cancelRowEdit,
}: any) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
  ref={setNodeRef}
  style={style}
  hover
  {...attributes}
  {...listeners}
  onDoubleClick={() => startEdit(row.id)}
  sx={{
    cursor: editingIds.includes(row.id) ? 'text' : 'grab',
    backgroundColor: editingIds.includes(row.id) ? '#f9fafb' : 'inherit',
    '&:hover': {
      backgroundColor: '#f3f4f6',
    },
    '& .MuiInputBase-root': {
      pointerEvents: 'auto',
    },
  }}
>

      {columns.map((col: any) => (
        <TableCell key={col.key}>
          {editingIds.includes(row.id) ? (
            <Controller
            name={`${row.id}.${col.key}`}
            control={control}
            defaultValue={row[col.key] ?? ''}
            render={({ field }) => (
              <TextField
  {...field}
  fullWidth
  variant="outlined"
  size="small"
  value={field.value ?? ''}
  onChange={(e) => field.onChange(e.target.value)}
  inputProps={{
    style: {
      color: mode === 'dark' ? '#f5f5f5' : '#111',       // Text color based on theme
      background: mode === 'dark' ? '#1e293b' : '#fff',  // Background contrast
      padding: '6px 8px',
      zIndex: 10,                                        // Make sure input stays above row
      position: 'relative',
      borderRadius: '4px',
    },
  }}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: mode === 'dark' ? '#334155' : '#ccc',
        transition: 'all 0.15s ease-in-out',
      },
      '&:hover fieldset': {
        borderColor: mode === 'dark' ? '#64748b' : '#888',
      },
      '&.Mui-focused fieldset': {
        borderColor: mode === 'dark' ? '#90caf9' : '#1976d2',
        borderWidth: '2px',
        boxShadow: `0 0 0 1px ${mode === 'dark' ? '#90caf9' : '#1976d2'}`,
      },
    },
    '& input': {
      caretColor: mode === 'dark' ? '#90caf9' : '#1976d2', // Visible caret
    },
  }}
/>

            )}
          />
          
          
          ) : (
            String(row[col.key] ?? '')
          )}
        </TableCell>
      ))}
      <TableCell>
        <IconButton
          color="error"
          onClick={() => {
            if (
              confirm(`Are you sure you want to delete ${row.name || 'this row'}?`)
            ) {
              dispatch(deleteRow(row.id));
            }
          }}
        >
          🗑
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
