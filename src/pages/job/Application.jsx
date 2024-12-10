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
import { useRegisterEmployeeMutation } from '../../features/company/companyApiSlice';

export default function Application() {
    const { id } = useParams();

    const { data, isLoading } = useGetApplicationsByPostingQuery(id);
    const [open, setOpen] = useState('');
    const [updateApplication] = useUpdateApplicationMutation();
    const [registerEmployee] = useRegisterEmployeeMutation();

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

                if (values.status === 'Accepted') {
                    const application = data[0].applications.find(
                        (application) => application._id === open
                    );
                
                    console.log('Applications Data:', data[0]);
                    console.log('Application Data:', application);
                
                    // Defensive checks to ensure required fields are present
                    if (!application) {
                        console.error('Missing applicant!');
                        return;
                    } 
                    if (!data[0].posting) {
                        console.error('Missing posting!');
                        return;
                    } 
                    if (!data[0].posting.job) {
                        console.error('Missing posting job!');
                        return;
                    }
                
                    // Create a new employee email
                    const companyName = data[0].posting.job.company.name.replace(/\s+/g, '').toLowerCase(); // Remove spaces and convert to lowercase
                    const employeeEmail = `${application.applicant.firstName.toLowerCase()}.${application.applicant.lastName.toLowerCase()}@${companyName}.com`;

                    // Extract necessary fields from the application
                    const employeeData = {
                        company: data[0].posting.job.company._id, // Company ID from top-level posting
                        firstName: application.applicant.firstName, // Applicant's first name
                        lastName: application.applicant.lastName, // Applicant's last name
                        email: employeeEmail, // Applicant's email
                        personalEmail: application.applicant.email, // Personal email
                        password: '123456', // Default password
                        gender: application.applicant.gender || 'Prefer not to say', // Default gender if not available
                        jobTitle: data[0].posting.job.title || 'Unassigned', // Job title from top-level posting
                        salary: data[0].posting.salaryRange.min || 0, // Minimum salary from top-level posting
                    };
                
                    console.log('Registering Employee Data:', employeeData);
                
                    // Call the registerEmployee mutation
                    const response = await registerEmployee(employeeData).unwrap();
                
                    console.log('Employee Registration Response:', response);
                }
                                
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
