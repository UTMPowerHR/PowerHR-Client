import TableForm from './components/list';
import AddButton from './components/addButton';
import { Grid, Stack, Typography } from '@mui/material';

function ManageForm() {
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
                    <Stack direction="row" justifyContent="space-between" spacing={4}>
                        <Stack spacing={1}>
                            <Typography variant="h4">Manage Form</Typography>
                        </Stack>
                        <Stack>
                            <AddButton />
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <TableForm />
                </Grid>
            </Grid>
        </>
    );
}

export default ManageForm;
