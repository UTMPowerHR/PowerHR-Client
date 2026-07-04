import { useGetApplicationByApplicantQuery } from '@features/job/jobApiSlice';
import { useSelector } from 'react-redux';
import {
    Grid,
    Typography,
    Card,
    Stack,
    Divider,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
} from '@mui/material';
import { Scrollbar } from '@components/scrollbar';
import dayjs from 'dayjs';
import { useUpdateApplicationMutation } from '../../features/job/jobApiSlice';
import { useUpdateUserMutation } from '../../features/user/userApiSlice';
import { useState } from 'react';

export default function History() {
    const userId = useSelector((state) => state.auth.user._id);
    const { data, isLoading, refetch } = useGetApplicationByApplicantQuery(userId); // Add refetch
    const [updateApplication] = useUpdateApplicationMutation();
    const [updateUser] = useUpdateUserMutation();
    const [reportDutyDate, setReportDutyDate] = useState(null);

    const handleAccept = async (applicantId, acceptedApplicationId) => {
        try {
            // Update the status of the applicant to 'Accepted' and create an employee record
            await updateUser({
                role: 'applicant',
                id: applicantId,
                user: { statusType: 'Accepted' },
            });

            // Accept the specific job application and set report duty date
            await updateApplication({
                id: acceptedApplicationId,
                status: {
                    statusType: 'Accepted',
                    reason: '',
                    description: '',
                    reportDutyDate: reportDutyDate,
                },
            });

            // Reject all other applications for this applicant
            const otherApplications = data.filter(
                (application) => application._id !== acceptedApplicationId
            );

            console.log(otherApplications);

            // Reject the other applications
            for (let application of otherApplications) {
                await updateApplication({
                    id: application._id,
                    status: {
                        statusType: 'Rejected',
                        reason: 'Applicant accepted another job offer.',
                        description: '',
                    },
                });
            }

            // Reset the report duty date after acceptance
            setReportDutyDate(null);

            // Trigger a data refresh after successful mutation
            refetch();

        } catch (error) {
            console.error('Error accepting application:', error);
        }
    };

    const handleReject = async (applicationId) => {
        try {
            await updateApplication({
                id: applicationId,
                status: {
                    statusType: 'Rejected',
                    reason: 'Applicant rejected the offer.',
                    description: '',
                },
            });

            // Trigger a data refresh after rejection
            refetch();

        } catch (error) {
            console.error('Error rejecting application:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

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
                    <Typography variant="h4">Job Application History</Typography>
                </Grid>

                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <Card>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Typography variant="h6">Application History</Typography>
                                </Stack>
                            </Stack>
                            <Divider />
                            <Scrollbar>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Job Title</TableCell>
                                            <TableCell align="right">Status</TableCell>
                                            <TableCell align="right">Last Updated</TableCell>
                                            <TableCell align="right">Report Duty Date</TableCell>
                                            <TableCell align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data?.map((application) => (
                                            <TableRow key={application._id}>
                                                <TableCell>
                                                    <Stack>
                                                        <Typography variant="subtitle1">
                                                            {application.posting.job.title}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {application.posting.job.company.name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="right">{application.status.statusType}</TableCell>
                                                <TableCell align="right">
                                                    {dayjs(application.status.statusDate).format('DD MMM YYYY')}
                                                </TableCell>

                                                {/* Display Report Duty Date if status is Pending */}
                                                <TableCell align="right">
                                                    {application.status.statusType === 'Pending' && application.reportDutyDate
                                                        ? dayjs(application.reportDutyDate).format('DD MMM YYYY')
                                                        : '-'}
                                                </TableCell>

                                                <TableCell align="right">
                                                    {application.status.statusType === 'Pending' ? (
                                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                onClick={() => handleReject(application._id)}
                                                            >
                                                                Reject
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() =>
                                                                    handleAccept(userId, application._id)
                                                                }
                                                            >
                                                                Accept
                                                            </Button>
                                                        </Stack>
                                                    ) : (
                                                        ''
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Scrollbar>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
