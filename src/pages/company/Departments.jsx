import { Grid, Typography } from '@mui/material';
import TableDepartments from './components/tableDepartments';

function Departments() {
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
                    <Typography variant="h4">Manage Department</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TableDepartments />
                </Grid>
            </Grid>
        </>
    );
}

export default Departments;
