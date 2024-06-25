import { Dialog, DialogContent, Box, Button, IconButton, TextField, Stack, SvgIcon, Typography } from '@mui/material';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useCreateFormMutation } from '@features/form/formApiSlice';
import PATHS from '@constants/routes/paths';
import { useDispatch } from 'react-redux';
import { addForm } from '@features/form/formSlice';

function AddForm(props) {
    const { onClose, open = false, ...other } = props;
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        createdBy: user._id,
        company: user.company,
        name: '',
        description: '',
    });

    const handleChange = (event) => {
        setForm((prevForm) => ({
            ...prevForm,
            [event.target.name]: event.target.value,
        }));
    };

    const [createForm] = useCreateFormMutation();

    const handleAdd = async () => {
        try {
            const response = await createForm(form);
            dispatch(addForm(response.data.form));
            setForm({
                createdBy: user._id,
                company: user.company,
                name: '',
                description: '',
            });

            onClose();
            window.open(`${PATHS.FORM.INDEX}/${response.data.form._id}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open} {...other}>
            <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                spacing={3}
                sx={{
                    px: 3,
                    py: 2,
                }}
            >
                <Typography variant="h5">Add Form</Typography>
                <IconButton color="inherit" onClick={onClose}>
                    <SvgIcon>
                        <XIcon />
                    </SvgIcon>
                </IconButton>
            </Stack>
            <DialogContent>
                <Stack spacing={3} sx={{ mb: 3 }}>
                    <TextField fullWidth label="Name" name="name" value={form.name} required onChange={handleChange} />
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />
                </Stack>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        pb: 3,
                    }}
                >
                    <Button color="inherit" sx={{ mr: 2 }} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                        }}
                        variant="contained"
                        onClick={handleAdd}
                    >
                        Add
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

AddForm.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
};

export default AddForm;
