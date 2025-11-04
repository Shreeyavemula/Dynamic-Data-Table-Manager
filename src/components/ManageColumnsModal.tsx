'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setColumns } from '../slices/tableSlice';
import {
    Modal,
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    TextField,
    Button,
} from '@mui/material';

export default function ManageColumnsModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const dispatch = useDispatch();
    const columns = useSelector((s: RootState) => s.table.columns);
    const [newField, setNewField] = useState('');

    const handleToggle = (key: string) => {
        const updated = columns.map((col) =>
            col.key === key ? { ...col, visible: !col.visible } : col
        );
        dispatch(setColumns(updated));
    };

    const handleAddColumn = () => {
        const trimmed = newField.trim();
        if (!trimmed) return;

        const key = trimmed.toLowerCase().replace(/\s+/g, '_');
        const newCol = { key, label: trimmed, visible: true };

        dispatch(setColumns([...columns, newCol]));
        setNewField('');
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    maxWidth: 400,
                    mx: 'auto',
                    mt: 10,
                    boxShadow: 6,
                }}
            >
                <Typography variant="h6" mb={2}>
                    Manage Columns
                </Typography>

                <FormGroup>
                    {columns.map((col) => (
                        <FormControlLabel
                            key={col.key}
                            control={
                                <Checkbox
                                    checked={col.visible}
                                    onChange={() => handleToggle(col.key)}
                                />
                            }
                            label={col.label}
                        />
                    ))}
                </FormGroup>

                <Box mt={3} display="flex" gap={1}>
                    <TextField
                        label="New Column"
                        size="small"
                        value={newField}
                        onChange={(e) => setNewField(e.target.value)}
                        fullWidth
                    />
                    <Button variant="contained" onClick={handleAddColumn}>
                        Add
                    </Button>
                </Box>

                <Button
                    sx={{ mt: 3 }}
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={onClose}
                >
                    Close
                </Button>
            </Box>
        </Modal>
    );
}
