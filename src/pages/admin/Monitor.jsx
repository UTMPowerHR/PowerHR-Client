import { Grid, Typography, Card, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useGetLogsQuery } from '@features/log/logSlice';
import { useSelector } from 'react-redux';
import { Scrollbar } from '@components/scrollbar';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const Monitor = () => {
    const user = useSelector((state) => state.auth.user);

    const { data: logs } = useGetLogsQuery(user.company);

    return (
        <>
            <Grid container spacing={{ xs: 3, lg: 4 }}>
                <Grid item xs={12}>
                    <Typography variant="h4">Log Monitor</Typography>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <Scrollbar>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Time</TableCell>
                                        <TableCell>User</TableCell>
                                        <TableCell>Event</TableCell>
                                        <TableCell>Details</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {logs?.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                {dayjs.utc(log.createdAt).local().format('DD/MM/YYYY hh:mm:ss A')}
                                            </TableCell>
                                            <TableCell>
                                                {log.user.firstName} {log.user.lastName}
                                            </TableCell>
                                            <TableCell>{log.action}</TableCell>
                                            <TableCell>{log.description}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default Monitor;
