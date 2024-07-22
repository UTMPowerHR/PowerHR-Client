import { useGetAnalyticTurnOverMutation } from '@features/company/companyApiSlice';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { Card, FormControl, Grid, IconButton, Stack, Typography } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { BarChart } from '@mui/x-charts';
import SendIcon from '@mui/icons-material/Send';
import './graph.css';

const TurnOver = () => {
    const user = useSelector((state) => state.auth.user);
    const [getAnalyticTurnOver, { data }] = useGetAnalyticTurnOverMutation();

    const [from, setFrom] = useState(dayjs().subtract(1, 'month').format('MM/DD/YYYY'));
    const [to, setTo] = useState(dayjs().format('MM/DD/YYYY'));

    useEffect(() => {
        getAnalyticTurnOver({
            id: user.company,
            from,
            to,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    <Typography variant="h4">Turnover Analytics</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <Stack direction="row" alignItems="center" justifyContent="center">
                            <Grid container spacing={3} p={1}>
                                <Grid item xs={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} required>
                                        <DemoContainer components={['DatePicker']}>
                                            <FormControl fullWidth>
                                                <DatePicker
                                                    width="100%"
                                                    label="From"
                                                    name="from"
                                                    value={dayjs(from)}
                                                    onChange={(date) => setFrom(date.format('MM/DD/YYYY'))}
                                                />
                                            </FormControl>
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} required>
                                        <DemoContainer components={['DatePicker']}>
                                            <FormControl fullWidth>
                                                <DatePicker
                                                    width="100%"
                                                    label="To"
                                                    name="to"
                                                    value={dayjs(to)}
                                                    onChange={(date) => setTo(date.format('MM/DD/YYYY'))}
                                                />
                                            </FormControl>
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>

                            <IconButton
                                color="primary"
                                variant="contained"
                                onClick={() => getAnalyticTurnOver({ id: user.company, from, to })}
                            >
                                <SendIcon />
                            </IconButton>
                        </Stack>
                    </Card>
                </Grid>

                <Grid item md={6} xs={12}>
                    <Stack spacing={3}>
                        <Card sx={{ p: 3 }}>
                            <Stack spacing={2} alignItems="center">
                                <Typography variant="h6">Turnover Rate</Typography>
                                <Gauge
                                    value={data?.turnover?.rate || 0}
                                    startAngle={-110}
                                    endAngle={110}
                                    width={400}
                                    height={200}
                                    sx={{
                                        [`& .${gaugeClasses.valueText}`]: {
                                            fontSize: 40,
                                            transform: 'translate(0px, 0px)',
                                        },
                                    }}
                                    text={({ value }) => `${value}%`}
                                />
                            </Stack>
                        </Card>

                        <Card sx={{ p: 3 }} height="100%">
                            <Stack alignItems="center" justifyContent="center" spacing={2}>
                                <Typography variant="h6">Total Employee Turnover</Typography>
                                <Typography variant="h4">{data?.turnover?.employeesLeft || 0}</Typography>
                            </Stack>
                        </Card>
                    </Stack>
                </Grid>

                <Grid item md={6} xs={12}>
                    <Card sx={{ p: 3 }} height="100%">
                        <Stack alignItems="center" justifyContent="center" spacing={2}>
                            <Typography variant="h6">List of Employees</Typography>
                            <BarChart
                                series={[
                                    {
                                        data: [
                                            data?.turnover?.totalEmployeesBeginning || 0,
                                            data?.turnover?.totalEmployeesEnd || 0,
                                        ],
                                    },
                                ]}
                                yAxis={[
                                    {
                                        scaleType: 'band',
                                        data: [from, to],
                                    },
                                ]}
                                width={350}
                                height={200}
                                layout="horizontal"
                            />
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default TurnOver;
