import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { Trash02 } from '@untitled-ui/icons-react';
import {
    Card,
    Checkbox,
    Divider,
    IconButton,
    InputAdornment,
    Link,
    OutlinedInput,
    Stack,
    SvgIcon,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Tabs,
    TextField,
    Typography,
    Avatar,
    Button,
    Dialog,
    Paper,
    Box,
} from '@mui/material';
import { Scrollbar } from '@components/scrollbar';
import { useGetAllFormsByUserQuery, useDeleteFormMutation } from '../../../../features/form/formApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setForms, deleteForm } from '@features/form/formSlice';
import { useNavigate } from 'react-router-dom';
import PATHS from '@constants/routes/paths';
import AlertTriangleIcon from '@untitled-ui/icons-react/build/esm/AlertTriangle';
import { Eye, File02 as File } from '@untitled-ui/icons-react';

function TableForm() {
    const user = useSelector((state) => state.auth.user);
    const forms = useSelector((state) => state.form.forms);
    const [open, setOpen] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data, isSuccess } = useGetAllFormsByUserQuery(user._id);
    const [deleteFormMutation] = useDeleteFormMutation();

    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (isSuccess) {
            dispatch(setForms(data.forms));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isSuccess]);

    const tabs = [
        {
            label: 'All',
            value: 'all',
        },
    ];

    const sortOptions = [
        {
            label: 'Last update (newest)',
            value: 'updatedAt|desc',
        },
        {
            label: 'Last update (oldest)',
            value: 'updatedAt|asc',
        },
        {
            label: 'Total orders (highest)',
            value: 'orders|desc',
        },
        {
            label: 'Total orders (lowest)',
            value: 'orders|asc',
        },
    ];

    const handleConfirmDelete = (index) => {
        setDeleteIndex(index);
        setOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteFormMutation(id);
            setOpen(false);
            setDeleteIndex(null);
            dispatch(deleteForm(id));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Card>
                <Tabs
                    indicatorColor="primary"
                    scrollButtons="auto"
                    textColor="primary"
                    value="all"
                    sx={{ px: 3 }}
                    variant="scrollable"
                >
                    {tabs.map((tab) => (
                        <Tab key={tab.value} label={tab.label} value={tab.value} />
                    ))}
                </Tabs>
                <Divider />
                <Stack alignItems="center" direction="row" flexWrap="wrap" gap={2} sx={{ p: 3 }}>
                    <OutlinedInput
                        placeholder="Search Form"
                        startAdornment={
                            <InputAdornment position="start">
                                <SvgIcon>
                                    <SearchMdIcon />
                                </SvgIcon>
                            </InputAdornment>
                        }
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField label="Sort By" name="sort" select SelectProps={{ native: true }}>
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                </Stack>
                <Scrollbar>
                    <Table sx={{ minWidth: 700 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox />
                                </TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {forms?.map((form, index) => {
                                return (
                                    <TableRow hover key={form._id}>
                                        <TableCell padding="checkbox">
                                            <Checkbox />
                                        </TableCell>
                                        <TableCell>
                                            <Stack alignItems="center" direction="row" spacing={1}>
                                                <div>
                                                    <Link color="inherit" variant="subtitle2">
                                                        {form.name}
                                                    </Link>
                                                    <Typography color="text.secondary" variant="body2">
                                                        {form.description}
                                                    </Typography>
                                                </div>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>{form.setting.published ? 'Publish' : 'Draft'}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={() =>
                                                    navigate(PATHS.FORM.INDEX + '/' + form._id + '/feedback')
                                                }
                                            >
                                                <SvgIcon>
                                                    <File />
                                                </SvgIcon>
                                            </IconButton>
                                            <IconButton
                                                onClick={() => navigate(PATHS.FORM.INDEX + '/' + form._id + '/preview')}
                                            >
                                                <SvgIcon>
                                                    <Eye />
                                                </SvgIcon>
                                            </IconButton>
                                            <IconButton onClick={() => navigate(PATHS.FORM.INDEX + '/' + form._id)}>
                                                <SvgIcon>
                                                    <Edit02Icon />
                                                </SvgIcon>
                                            </IconButton>
                                            {form.collab ? null : (
                                                <IconButton onClick={() => handleConfirmDelete(index)}>
                                                    <SvgIcon>
                                                        <Trash02 />
                                                    </SvgIcon>
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Scrollbar>
                <TablePagination
                    component="div"
                    count={forms ? forms.length : 0}
                    onPageChange={() => {}}
                    onRowsPerPageChange={() => {}}
                    page={0}
                    rowsPerPage={5}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Card>
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
                        <div>
                            <Typography variant="h5">Delete {forms[deleteIndex]?.name}</Typography>
                            <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                                Are you sure you want to delete this form?
                            </Typography>
                        </div>
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
                            onClick={() => handleDelete(forms[deleteIndex]?._id)}
                        >
                            Delete
                        </Button>
                    </Box>
                </Paper>
            </Dialog>
        </>
    );
}

export default TableForm;
