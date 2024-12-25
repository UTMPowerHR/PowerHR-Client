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
} from '@mui/material';
import { Scrollbar } from '@components/scrollbar';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useUpdateApplicationMutation } from '../../features/job/jobApiSlice';
import { useUpdateUserMutation } from '../../features/user/userApiSlice';

export default function Application() {
    const { id } = useParams();

    const { data, isLoading } = useGetApplicationsByPostingQuery(id);
    const [open, setOpen] = useState('');
    const [updateApplication] = useUpdateApplicationMutation();
    const [updateUser] = useUpdateUserMutation();

    const formik = useFormik({
        initialValues: {
            status: '',
            reason: '',
            description: '',
        },
        validationSchema: Yup.object({
            status: Yup.string().required('Required'),
            reason: Yup.string(),
            description: Yup.string(),
        }),
        onSubmit: async (values) => {
            try {
                await updateApplication({
                    id: open,
                    status: {
                        statusType: values.status,
                        reason: values.reason,
                        description: values.description,
                    },
                });

                const updatedApplications = data[0].applications.filter(
                    (application) => application._id !== open // Remove the accepted application
                );
        
                // Trigger the user update if status is Accepted
                if (values.status === 'Accepted') {
                    const application = data[0].applications.find((app) => app._id === open);
                    const applicantId = application.applicant._id;
        
                    console.log('Triggering updateUser API with:', applicantId);
                    await updateUser({
                        role: 'applicant',
                        id: applicantId,
                        user: { statusType: 'Accepted' },
                    });
        
                    console.log('User update API called successfully');
                }
        
                // Optimistically update the UI with the updated applications list
                data[0].applications = updatedApplications;
                                
                setOpen('');
            } catch (error) {
                console.error(error);
            }
        },
    });

    useEffect(() => {
        if (open !== '') {
            const application = data[0].applications.find((application) => application._id === open);

            formik.setValues({
                status: application.status.statusType,
                reason: application.status.reason || '',
                description: application.status.description || '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, open]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <Grid
                container
                spacing={{
                    xs: 3,
                    lg: 4,
                }}
            >
                <Grid item xs={12}>
                    <Typography variant="h4">{data[0]?.posting.job.title}</Typography>

                    <Typography variant="h6" color="text.secondary">
                        {data[0]?.applications.length} Applications
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="h5">Applicant</Typography>
                            </Stack>
                        </Stack>
                        <Divider />
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
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.[0]?.applications.map((application) => (
                                        <TableRow key={application._id}>
                                            <TableCell padding="checkbox">
                                                <Checkbox />
                                            </TableCell>
                                            <TableCell>
                                                {application.applicant.firstName + ' ' + application.applicant.lastName}
                                            </TableCell>
                                            <TableCell>{application.applicant.email}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => window.open(application.applicant.resume, '_blank')}
                                                >
                                                    View
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outlined" onClick={() => setOpen(application._id)}>
                                                    {application.status.statusType}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </Card>
                </Grid>
            </Grid>
            <Dialog open={open !== ''} onClose={() => setOpen('')} fullWidth>
                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant="h5">Manage Application</Typography>
                        <FormControl
                            fullWidth
                            variant="filled"
                            error={formik.touched.status && Boolean(formik.errors.status)}
                        >
                            <InputLabel id="status">Status</InputLabel>
                            <Select
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                name="status"
                            >
                                <MenuItem value="New">New</MenuItem>
                                <MenuItem value="Viewed">Viewed</MenuItem>
                                <MenuItem value="Interviewed">Interviewed</MenuItem>
                                <MenuItem value="Rejected">Rejected</MenuItem>
                                <MenuItem value="Accepted">Accepted</MenuItem>
                                <MenuItem value="Withdrawn">Withdrawn</MenuItem>
                            </Select>
                        </FormControl>

                        {formik.values.status === 'Rejected' && (
                            <>
                                <FormControl
                                    variant="filled"
                                    fullWidth
                                    error={formik.touched.reason && Boolean(formik.errors.reason)}
                                >
                                    <InputLabel id="reason">Reason</InputLabel>
                                    <Select
                                        name="reason"
                                        value={formik.values.reason}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
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
                                />
                            </>
                        )}

                        <Button variant="contained" fullWidth onClick={formik.handleSubmit}>
                            Update
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
}