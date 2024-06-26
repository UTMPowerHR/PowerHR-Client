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
} from '@mui/material';
import { Scrollbar } from '@components/scrollbar';
import dayjs from 'dayjs';

export default function History() {
    const userId = useSelector((state) => state.auth.user._id);
    const { data, isLoading } = useGetApplicationByApplicantQuery(userId);

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
