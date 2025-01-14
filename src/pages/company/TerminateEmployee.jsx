import { Grid, Typography } from '@mui/material';
import EmployeesTable from './components/tableTerminateEmployee';
import RankEmployeesTable from './components/rankEmployee';

function TerminateEmployee() {
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
                    <Typography variant="h4">Terminate Employees</Typography>
                </Grid>
                <Grid item xs={12}>
                    <EmployeesTable />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h4" style={{ marginTop: '60px' }}>Run TOPSIS Analysis</Typography>
                </Grid>
                <Grid item xs={12}>
                    <RankEmployeesTable />
                </Grid>
            </Grid>
        </>
    );
}

export default TerminateEmployee;