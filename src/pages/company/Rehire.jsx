import { Grid, Typography } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import RehireTable from './components/tableRehireEmployees';
import RankedEmployeesTable from './components/rankFormerEmployee';
import RetrieveRehireData from './components/RetrieveRehireData';

function Rehire() {
    const currentMonth = dayjs().format('MMM YYYY');
    const [completedCount, setCompletedCount] = useState(0);
    const [targetMonth, setTargetMonth] = useState(currentMonth);
    const [requiredCount, setRequiredCount] = useState(0);

    // Reset session counter whenever HR switches to a different month
    useEffect(() => {
        setCompletedCount(0);
    }, [targetMonth]);

    const handleMonthLoaded = useCallback((month, required) => {
        setTargetMonth(month);
        setRequiredCount(required);
    }, []);

    // Rehire button only active when viewing current month and there are pending rehirings
    const canRehire = targetMonth === currentMonth && requiredCount > 0;

    const handleRehireSuccess = () => setCompletedCount((prev) => prev + 1);

    return (
        <Grid container spacing={{ xs: 3, lg: 4 }}>
            <Grid item xs={12}>
                <Typography variant="h4">Rehire Employees</Typography>
            </Grid>
            <Grid item xs={12}>
                <RetrieveRehireData
                    completedCount={completedCount}
                    onMonthLoaded={handleMonthLoaded}
                />
            </Grid>
            <Grid item xs={12}>
                <RehireTable
                    onRehireSuccess={handleRehireSuccess}
                    targetMonth={targetMonth}
                    canRehire={canRehire}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Run TOPSIS Analysis</Typography>
                <RankedEmployeesTable />
            </Grid>
        </Grid>
    );
}

export default Rehire;
