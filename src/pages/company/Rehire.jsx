import { Grid, Typography } from '@mui/material';
import RehireTable from './components/tableRehireEmployees';
import RankedEmployeesTable from './components/rankFormerEmployee';

function Rehire() {
    return (
        <Grid
            container
            spacing={{
                xs: 3,
                lg: 4,
            }}
        >
            <Grid item xs={12}>
                <Typography variant="h4">Rehire Employees</Typography>
            </Grid>
            <Grid item xs={12}>
                <RehireTable />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Run TOPSIS Analysis</Typography>
                <RankedEmployeesTable />
            </Grid>
        </Grid>
    );
}

export default Rehire;