import { Avatar, Box, Button, Dialog, Paper, Stack, SvgIcon, Typography } from '@mui/material';
import AlertTriangleIcon from '@untitled-ui/icons-react/build/esm/AlertTriangle';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PATHS from '@constants/routes/paths';
import { useDeleteFormMutation } from '@features/form/formApiSlice';
import { deleteForm } from '@features/form/formSlice';

function DeleteDialog(props) {
    const { onClose, open = false, id } = props;
    const form = useSelector((state) => state.form.form);

    const [deleteFormMutation] = useDeleteFormMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDelete = async (id) => {
        try {
            await deleteFormMutation(id);
            dispatch(deleteForm(id));
            navigate(PATHS.FORM.INDEX);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
            <Paper elevation={12}>
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        display: 'flex',
                        p: 3,
                    }}
                >
                    <Avatar
                        sx={{
                            backgroundColor: 'error.lightest',
                            color: 'error.main',
                        }}
                    >
                        <SvgIcon>
                            <AlertTriangleIcon />
                        </SvgIcon>
                    </Avatar>
                    <Box>
                        <Typography variant="h5">Delete {form.name}</Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                            Are you sure you want to delete this form?
                        </Typography>
                    </Box>
                </Stack>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        pb: 3,
                        px: 3,
                    }}
                >
                    <Button color="inherit" sx={{ mr: 2 }} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: 'error.main',
                            '&:hover': {
                                backgroundColor: 'error.dark',
                            },
                        }}
                        variant="contained"
                        onClick={() => handleDelete(id)}
                    >
                        Delete
                    </Button>
                </Box>
            </Paper>
        </Dialog>
    );
}

DeleteDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    id: PropTypes.string,
};

export default DeleteDialog;
