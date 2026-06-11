import { Grid, Typography } from '@mui/material';
import { useState, useCallback } from 'react';
import dayjs from 'dayjs';
import EmployeesTable from './components/tableTerminateEmployee';
import RankEmployeesTable from './components/rankEmployee';
import RetrieveTerminationData from './components/RetrieveTerminationData';

function TerminateEmployee() {
    const currentMonth = dayjs().format('MMM YYYY');
    const [completedByMonth, setCompletedByMonth] = useState({});
    const [targetMonth, setTargetMonth] = useState(currentMonth);
    const [requiredCount, setRequiredCount] = useState(0);

    const completedCount = completedByMonth[targetMonth] || 0;

    const handleMonthLoaded = useCallback((month, required) => {
        setTargetMonth(month);
        setRequiredCount(required);
    }, []);

    // Terminate button only active when viewing current month and there are pending terminations
    const canTerminate = targetMonth === currentMonth && requiredCount > 0;

    const handleTerminateSuccess = () =>
        setCompletedByMonth((prev) => ({ ...prev, [targetMonth]: (prev[targetMonth] || 0) + 1 }));

    return (
        <>
            <Grid container spacing={{ xs: 3, lg: 4 }}>
                <Grid item xs={12}>
                    <Typography variant="h4">Terminate Employees</Typography>
                </Grid>
                <Grid item xs={12}>
                    <RetrieveTerminationData
                        completedCount={completedCount}
                        onMonthLoaded={handleMonthLoaded}
                    />
                </Grid>
                <Grid item xs={12}>
                    <EmployeesTable
                        onTerminateSuccess={handleTerminateSuccess}
                        targetMonth={targetMonth}
                        canTerminate={canTerminate}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h4" style={{ marginTop: '60px' }}>Run TOPSIS Analysis</Typography>
                </Grid>
                <Grid item xs={12}>
                    <RankEmployeesTable canTerminate={canTerminate} onTerminateSuccess={handleTerminateSuccess} />
                </Grid>
            </Grid>
        </>
    );
}

export default TerminateEmployee;
