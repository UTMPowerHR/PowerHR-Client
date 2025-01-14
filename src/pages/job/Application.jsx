import { useParams } from 'react-router-dom';
import { useGetApplicationsByPostingQuery } from '@features/job/jobApiSlice';
import {
    Grid,
    Card,
    Checkbox,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    TextField,
    Dialog,
    DialogContent,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Paper,
} from '@mui/material';
import { Scrollbar } from '@components/scrollbar';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useUpdateApplicationMutation } from '../../features/job/jobApiSlice';
import { useUpdateUserMutation } from '../../features/user/userApiSlice';
import EditIcon from '@mui/icons-material/Edit';

export default function Application() {
    const { id } = useParams();
    const { data, isLoading, refetch } = useGetApplicationsByPostingQuery(id);
    const [open, setOpen] = useState('');
    const [updateApplication] = useUpdateApplicationMutation();
    const [updateUser] = useUpdateUserMutation();

    const formik = useFormik({
        initialValues: {
            status: '',
            reason: '',
            description: '',
            reportDutyDate: '', // Add reportDutyDate to formik values
        },
        validationSchema: Yup.object({
            status: Yup.string().required('Required'),
            reason: Yup.string(),
            description: Yup.string(),
            reportDutyDate: Yup.date().nullable(), // Validate reportDutyDate as a date (optional)
        }),
        onSubmit: async (values) => {
            try {
                // If status is 'Pending', pass the reportDutyDate along with the status and other fields
                await updateApplication({
                    id: open,
                    status: {
                        statusType: values.status,
                        reason: values.reason,
                        description: values.description,
                    },
                    reportDutyDate: values.status === 'Pending' ? values.reportDutyDate : null, // Add reportDutyDate if status is Pending
                });

                // Refetch data after the update to reflect changes
                refetch();

                setOpen(''); // Close dialog after submission
            } catch (error) {
                console.error(error);
            }
        },
    });

    useEffect(() => {
        if (open !== '' && data) {
            const application = data[0].applications.find((application) => application._id === open);

            formik.setValues({
                status: application.status.statusType,
                reason: application.status.reason || '',
                description: application.status.description || '',
                reportDutyDate: application.reportDutyDate || '', // Pre-populate reportDutyDate from current data
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, open]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                        {data[0]?.posting.job.title}
                    </Typography>

                    <Typography variant="h6" color="text.secondary" sx={{ marginBottom: 3 }}>
                        {data[0]?.applications.length} Applications
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Card sx={{ padding: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h5">Applicant List</Typography>
                        </Stack>

                        <Divider sx={{ marginBottom: 2 }} />
                        <Scrollbar>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox />
                                        </TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Resume</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.[0]?.applications.map((application) => (
                                        <TableRow key={application._id}>
                                            <TableCell padding="checkbox">
                                                <Checkbox />
                                            </TableCell>
                                            <TableCell>
                                                {application.applicant.firstName} {application.applicant.lastName}
                                            </TableCell>
                                            <TableCell>{application.applicant.email}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => window.open(application.applicant.resume, '_blank')}
                                                >
                                                    View Resume
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color:
                                                            application.status.statusType === 'Accepted'
                                                                ? 'green'
                                                                : application.status.statusType === 'Rejected'
                                                                ? 'red'
                                                                : 'orange', // Default color for Pending or other statuses
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {application.status.statusType === 'Accepted'
                                                        ? 'Accepted'
                                                        : application.status.statusType === 'Rejected'
                                                        ? 'Rejected'
                                                        : 'Pending'} {/* Display the correct status */}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <IconButton onClick={() => setOpen(application._id)} color="primary">
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </Card>
                </Grid>
            </Grid>

            {/* Manage Application Dialog */}
            <Dialog open={open !== ''} onClose={() => setOpen('')} fullWidth>
                <DialogContent>
                    <Paper sx={{ padding: 3 }}>
                        <Typography variant="h5" sx={{ marginBottom: 2 }}>
                            Manage Application
                        </Typography>
                        <form onSubmit={formik.handleSubmit}>
                            <FormControl fullWidth variant="filled" sx={{ marginBottom: 2 }}>
                                <InputLabel id="status">Status</InputLabel>
                                <Select
                                    labelId="status"
                                    value={formik.values.status}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    name="status"
                                    fullWidth
                                    sx={{
                                        '& .MuiSelect-select': {
                                            padding: '10px 14px',
                                        },
                                    }}
                                >
                                    <MenuItem value="Rejected">Reject</MenuItem>
                                    <MenuItem value="Pending">Accept</MenuItem>
                                </Select>
                            </FormControl>

                            {formik.values.status === 'Pending' && (
                                <TextField
                                    id="reportDutyDate"
                                    name="reportDutyDate"
                                    label="Report Duty Date"
                                    type="date"
                                    value={formik.values.reportDutyDate}
                                    onChange={formik.handleChange}
                                    fullWidth
                                    variant="filled"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ marginBottom: 2 }}
                                />
                            )}

                            {formik.values.status === 'Rejected' && (
                                <>
                                    <FormControl fullWidth variant="filled" sx={{ marginBottom: 2 }}>
                                        <InputLabel id="reason">Reason</InputLabel>
                                        <Select
                                            name="reason"
                                            value={formik.values.reason}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            fullWidth
                                        >
                                            <MenuItem value="Overqualified">Overqualified</MenuItem>
                                            <MenuItem value="Underqualified">Underqualified</MenuItem>
                                            <MenuItem value="Not a good fit">Not a good fit</MenuItem>
                                            <MenuItem value="Not interested">Not interested</MenuItem>
                                            <MenuItem value="Other">Other</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        id="description"
                                        name="description"
                                        label="Description"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        error={formik.touched.description && Boolean(formik.errors.description)}
                                        helperText={formik.touched.description && formik.errors.description}
                                        fullWidth
                                        variant="filled"
                                        sx={{ marginBottom: 2 }}
                                    />
                                </>
                            )}

                            <Button
                                variant="contained"
                                type="submit"
                                fullWidth
                                color="primary"
                                sx={{
                                    padding: 1.5,
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    },
                                }}
                            >
                                Update Application
                            </Button>
                        </form>
                    </Paper>
                </DialogContent>
            </Dialog>
        </>
    );
}
