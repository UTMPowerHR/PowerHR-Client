import { Grid, Typography } from '@mui/material';
import TablePublishForm from './components/listPublish';

function ListPublishForm() {
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
                    <Typography variant="h4">Survey</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TablePublishForm />
                </Grid>
            </Grid>
        </>
    );
}

export default ListPublishForm;
