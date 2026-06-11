import { Grid, Typography } from '@mui/material';
import { useState, useCallback } from 'react';
import dayjs from 'dayjs';
import RehireTable from './components/tableRehireEmployees';
import RankedEmployeesTable from './components/rankFormerEmployee';
import RetrieveRehireData from './components/RetrieveRehireData';

function Rehire() {
    const currentMonth = dayjs().format('MMM YYYY');
    const [completedByMonth, setCompletedByMonth] = useState({});
    const [targetMonth, setTargetMonth] = useState(currentMonth);
    const [requiredCount, setRequiredCount] = useState(0);

    const completedCount = completedByMonth[targetMonth] || 0;

    const handleMonthLoaded = useCallback((month, required) => {
        setTargetMonth(month);
        setRequiredCount(required);
    }, []);

    // Rehire button only active when viewing current month and there are pending rehirings
    const canRehire = targetMonth === currentMonth && requiredCount > 0;

    const handleRehireSuccess = () =>
        setCompletedByMonth((prev) => ({ ...prev, [targetMonth]: (prev[targetMonth] || 0) + 1 }));

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
                <RankedEmployeesTable canRehire={canRehire} onRehireSuccess={handleRehireSuccess} />
            </Grid>
        </Grid>
    );
}

export default Rehire;
