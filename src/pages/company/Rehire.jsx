import { Grid, Typography } from '@mui/material';
import RehireTable from './components/tableRehireEmployees';

function Rehire() {
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
                    <Typography variant="h4">Rehire Employees</Typography>
                </Grid>
                <Grid item xs={12}>
                    <RehireTable />
                </Grid>
            </Grid>
        </>
    );
}

export default Rehire;
