import { Grid, Stack, Typography } from '@mui/material';
import JobForm from './components/jobForm';
import { useParams } from 'react-router-dom';

function CreateJob() {
    const { id } = useParams('id');

    return (
        <Grid container sx={{ flexGrow: 1 }}>
            <Grid item xs={12}>
                <Stack maxWidth="sm" spacing={3}>
                    <Typography variant="h4">{id ? 'Edit Job Advertisement' : 'Create Job Advertisement'}</Typography>
                    <JobForm />
                </Stack>
            </Grid>
        </Grid>
    );
}

export default CreateJob;
