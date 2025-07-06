'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Divider,
} from '@mui/material';
import { CirclePicker } from 'react-color';
import { setSetting } from '../../../../features/applicant/applicantSlice';
import { HexColorPicker } from 'react-colorful';
import PaletteIcon from '@mui/icons-material/Palette';

const ColorButton = () => {
    const [open, setOpen] = useState(false);
    const titleColor = useSelector((state) => state.applicant.resume.template?.settings?.titleColor || '#2c3e50');
    const contentColor = useSelector((state) => state.applicant.resume.template?.settings?.contentColor || '#34495e');
    const [showTitleHexPicker, setShowTitleHexPicker] = useState(false);
    const [showContentHexPicker, setShowContentHexPicker] = useState(false);
    const [titleHexInput, setTitleHexInput] = useState(titleColor);
    const [contentHexInput, setContentHexInput] = useState(contentColor);

    const dispatch = useDispatch();

    // Predefined color palette
    const colorPalette = [
        '#2c3e50',
        '#34495e',
        '#1abc9c',
        '#16a085',
        '#3498db',
        '#2980b9',
        '#9b59b6',
        '#8e44ad',
        '#e74c3c',
        '#c0392b',
        '#f39c12',
        '#e67e22',
        '#27ae60',
        '#229954',
        '#17202a',
        '#5d6d7e',
        '#af7ac5',
        '#f1948a',
    ];

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setShowTitleHexPicker(false);
        setShowContentHexPicker(false);
        // Reset hex inputs to current colors
        setTitleHexInput(titleColor);
        setContentHexInput(contentColor);
    };

    const handleTitleColorChange = (color) => {
        const newColor = typeof color === 'string' ? color : color.hex;
        dispatch(setSetting({ name: 'titleColor', value: newColor }));
        setTitleHexInput(newColor);
    };

    const handleContentColorChange = (color) => {
        const newColor = typeof color === 'string' ? color : color.hex;
        dispatch(setSetting({ name: 'contentColor', value: newColor }));
        setContentHexInput(newColor);
    };

    const handleTitleHexInputChange = (event) => {
        const value = event.target.value;
        setTitleHexInput(value);
        // Apply color if it's a valid hex color
        if (/^#[0-9A-F]{6}$/i.test(value)) {
            dispatch(setSetting({ name: 'titleColor', value: value }));
        }
    };

    const handleContentHexInputChange = (event) => {
        const value = event.target.value;
        setContentHexInput(value);
        // Apply color if it's a valid hex color
        if (/^#[0-9A-F]{6}$/i.test(value)) {
            dispatch(setSetting({ name: 'contentColor', value: value }));
        }
    };

    return (
        <Box>
            <Tooltip title="Customize Colors" placement="top">
                <IconButton onClick={handleOpen} sx={{ position: 'relative' }}>
                    <PaletteIcon />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Customize Resume Colors</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        {/* Title Color Section */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Title Color
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        backgroundColor: titleColor,
                                        border: '2px solid #ddd',
                                        borderRadius: 1,
                                    }}
                                />
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    {titleColor}
                                </Typography>
                            </Stack>

                            <CirclePicker
                                color={titleColor}
                                onChangeComplete={handleTitleColorChange}
                                colors={colorPalette}
                                width="100%"
                            />

                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                                <TextField
                                    label="Hex Code"
                                    variant="outlined"
                                    size="small"
                                    value={titleHexInput}
                                    onChange={handleTitleHexInputChange}
                                    placeholder="#000000"
                                    sx={{ flexGrow: 1 }}
                                />
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setShowTitleHexPicker(!showTitleHexPicker)}
                                >
                                    {showTitleHexPicker ? 'Hide' : 'Picker'}
                                </Button>
                            </Stack>

                            {showTitleHexPicker && (
                                <Box sx={{ mt: 2 }}>
                                    <HexColorPicker
                                        color={titleColor}
                                        onChange={handleTitleColorChange}
                                        style={{ width: '100%' }}
                                    />
                                </Box>
                            )}
                        </Box>

                        <Divider />

                        {/* Content Color Section */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Content Color
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        backgroundColor: contentColor,
                                        border: '2px solid #ddd',
                                        borderRadius: 1,
                                    }}
                                />
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    {contentColor}
                                </Typography>
                            </Stack>

                            <CirclePicker
                                color={contentColor}
                                onChangeComplete={handleContentColorChange}
                                colors={colorPalette}
                                width="100%"
                            />

                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                                <TextField
                                    label="Hex Code"
                                    variant="outlined"
                                    size="small"
                                    value={contentHexInput}
                                    onChange={handleContentHexInputChange}
                                    placeholder="#000000"
                                    sx={{ flexGrow: 1 }}
                                />
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setShowContentHexPicker(!showContentHexPicker)}
                                >
                                    {showContentHexPicker ? 'Hide' : 'Picker'}
                                </Button>
                            </Stack>

                            {showContentHexPicker && (
                                <Box sx={{ mt: 2 }}>
                                    <HexColorPicker
                                        color={contentColor}
                                        onChange={handleContentColorChange}
                                        style={{ width: '100%' }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ColorButton;
