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
    Collapse,
    TextField,
    Tooltip,
} from '@mui/material';
import { CirclePicker } from 'react-color';
import { setSetting } from '../../../../features/applicant/applicantSlice';
import { HexColorPicker } from 'react-colorful';
import AddIcon from '@mui/icons-material/Add';

const ColorButton = () => {
    const [open, setOpen] = useState(false);
    const titleColor = useSelector((state) => state.applicant.resume.template?.setting?.titleColor || '#000000');
    const contentColor = useSelector((state) => state.applicant.resume.template?.setting?.contentColor || '#000000');
    const [showTitleHexPicker, setShowTitleHexPicker] = useState(false);
    const [showContentHexPicker, setShowContentHexPicker] = useState(false);
    const [titleHexCode, setTitleHexCode] = useState('');
    const [contentHexCode, setContentHexCode] = useState('');
    const [fixedColors, setFixedColors] = useState(['#1f77b4', '#cca504', '#f2e4d4', '#294023', '#000000', '#111111']);

    const dispatch = useDispatch();

    const handleOpen = () => setOpen(!open);
    const handleClose = () => {
        setOpen(false);
        setShowTitleHexPicker(false);
        setShowContentHexPicker(false);
    };

    const handleTitleColorChange = (color) => {
        const newColor = color.hex;
        dispatch(setSetting({ name: 'titleColor', value: newColor }));
        setTitleHexCode(newColor);
    };

    const handleContentColorChange = (color) => {
        const newColor = color.hex;
        dispatch(setSetting({ name: 'contentColor', value: newColor }));
        setContentHexCode(newColor);
    };

    const handleToggleTitleHexPicker = () => {
        setShowTitleHexPicker(!showTitleHexPicker);
    };

    const handleToggleContentHexPicker = () => {
        setShowContentHexPicker(!showContentHexPicker);
    };

    const handleHexColorSelection = (color) => {
        const newColor = color;
        if (showTitleHexPicker) {
            setTitleHexCode(newColor);
        } else if (showContentHexPicker) {
            setContentHexCode(newColor);
        }
    };

    const handleColorSelection = () => {
        if (showTitleHexPicker) {
            setFixedColors((prevColors) => [...prevColors, titleHexCode]);
            setShowTitleHexPicker(false);
        } else if (showContentHexPicker) {
            setFixedColors((prevColors) => [...prevColors, contentHexCode]);
            setShowContentHexPicker(false);
        }
    };

    return (
        <Box>
            <Stack spacing={2} sx={{ p: 2 }} direction="row" justifyContent="space-between" alignItems="center">
                <Stack spacing={1} direction="row" alignItems="center">
                    <IconButton onClick={handleOpen} sx={{ position: 'relative' }}>
                        <Stack width={30} height={30}>
                            <Typography>A</Typography>
                            <Box pt={0.65} sx={{ backgroundColor: contentColor, flexGrow: 1 }} />
                            <Box pt={0.65} sx={{ backgroundColor: titleColor, flexGrow: 1 }} />
                        </Stack>
                    </IconButton>
                </Stack>
            </Stack>
            <Collapse in={open} sx={{ position: 'absolute', right: 100 }}>
                <Dialog open={open} onClose={handleClose} sx={{ width: '380px', maxHeight: '200vh', margin: 'auto' }}>
                    <DialogTitle>Title</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">Select a color:</Typography>
                        <Stack direction="row" alignItems="center">
                            <CirclePicker
                                color={titleColor}
                                onChangeComplete={(color) => handleTitleColorChange(color)}
                                colors={fixedColors}
                            />
                            <Tooltip title="Toggle Hex Picker" placement="bottom">
                                <IconButton onClick={handleToggleTitleHexPicker} color="primary">
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </DialogContent>

                    {showTitleHexPicker && (
                        <DialogContent>
                            <HexColorPicker color={titleColor} onChange={(color) => handleHexColorSelection(color)} />
                            <TextField
                                label="Hex Code"
                                variant="outlined"
                                margin="normal"
                                value={titleHexCode}
                                onChange={(e) => setTitleHexCode(e.target.value)}
                                fullWidth
                            />
                            <DialogActions>
                                <Button onClick={handleColorSelection} color="primary">
                                    Apply
                                </Button>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
                                </Button>
                            </DialogActions>
                        </DialogContent>
                    )}

                    <DialogTitle>Content</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">Select a color:</Typography>
                        <Stack direction="row" alignItems="center">
                            <CirclePicker
                                color={contentColor}
                                onChangeComplete={(color) => handleContentColorChange(color)}
                                colors={fixedColors}
                            />
                            <Tooltip title="Toggle Hex Picker" placement="bottom">
                                <IconButton onClick={handleToggleContentHexPicker} color="primary">
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </DialogContent>

                    {showContentHexPicker && (
                        <DialogContent>
                            <HexColorPicker color={contentColor} onChange={(color) => handleHexColorSelection(color)} />
                            <TextField
                                label="Hex Code"
                                variant="outlined"
                                margin="normal"
                                value={contentHexCode}
                                onChange={(e) => setContentHexCode(e.target.value)}
                                fullWidth
                            />
                            <DialogActions>
                                <Button onClick={handleColorSelection} color="primary">
                                    Apply
                                </Button>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
                                </Button>
                            </DialogActions>
                        </DialogContent>
                    )}

                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Collapse>
        </Box>
    );
};

export default ColorButton;
