import { Grid, Typography } from '@mui/material';
import EmployeesTable from './components/tableEmployees';

function Employees() {
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
                    <Typography variant="h4">Manage Employees</Typography>
                </Grid>
                <Grid item xs={12}>
                    <EmployeesTable />
                </Grid>
            </Grid>
        </>
    );
}

export default Employees;
