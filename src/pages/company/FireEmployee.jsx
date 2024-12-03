import { Grid, Typography } from '@mui/material';
import EmployeesTable from './components/tableFireEmployee';
import RankEmployeesTable from './components/rankEmployee';

function FireEmployee() {
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
                    <Typography variant="h4">Run TOPSIS Analysis</Typography>
                </Grid>
                <Grid item xs={12}>
                    <RankEmployeesTable />
                </Grid>
            </Grid>
        </>
    );
}

export default FireEmployee;