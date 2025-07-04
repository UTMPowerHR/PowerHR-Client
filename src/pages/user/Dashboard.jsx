import { Paper, Stack, Typography, Button } from '@mui/material';
import { useSelector } from 'react-redux';

export default function Dashboard() {
    const user = useSelector((state) => state.auth.user);

    return (
        <>
            <Stack spacing={4}>
                <Paper>
                    <Stack spacing={2} sx={{ p: 4 }}>
                        <Typography variant="h4">PowerHR Management Tool</Typography>
                        <Typography variant="body1">
                            Welcome, {user?.firstName} {user?.lastName}
                        </Typography>
                    </Stack>
                </Paper>

                {user.role === 'Applicant' && (
                    <Paper>
                        <Stack spacing={2} sx={{ p: 4 }}>
                            <Typography variant="h4">Find a Job</Typography>
                            <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
                                <Typography variant="body1">Search for job postings and apply to them.</Typography>
                                <Button variant="contained" href="/job">
                                    Browse Jobs
                                </Button>
                            </Stack>
                        </Stack>
                    </Paper>
                )}
            </Stack>
        </>
    );
}
