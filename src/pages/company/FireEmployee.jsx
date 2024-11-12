import { Grid, Typography } from '@mui/material';
import EmployeesTable from './components/testTableFireEmployees';

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
            </Grid>
        </>
    );
}

export default FireEmployee;