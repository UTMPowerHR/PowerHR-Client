import { Grid, Typography, Pagination, Stack, Box, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetFeedbacksByFormIdQuery } from '@features/form/formApiSlice';
import { setFormAndFeedback } from '@features/form/formSlice';
import FeedbackCard from './components/feedbackCard';

function FeedbackList() {
    const { id } = useParams();
    const form = useSelector((state) => state.form.feedbacks);
    const dispatch = useDispatch();
    const { data, isSuccess, isLoading } = useGetFeedbacksByFormIdQuery(id, { refetchOnMountOrArgChange: true });
    const [indexFeedback, setIndexFeedback] = useState(0);

    useEffect(() => {
        if (isSuccess) {
            dispatch(setFormAndFeedback({ feedbacks: data?.feedbacks }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isSuccess]);

    const handlePaginationChange = (event, value) => {
        setIndexFeedback(value - 1);
    };

    if (isLoading || form.name === undefined) {
        return <div>Loading...</div>;
    }

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
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4">{form.name} (Feedback)</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">{form.description}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Stack justifyContent={'center'} alignItems={'center'} spacing={2} direction={'column'}>
                        <Card elevation={8} sx={{ p: 2 }}>
                            <Pagination
                                count={form.feedbacks?.length}
                                showFirstButton
                                showLastButton
                                onChange={handlePaginationChange}
                            />
                        </Card>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Box>
                        {form?.feedbacks[indexFeedback]?.responses.map((response, indexResponse) => (
                            <Box key={response._id} sx={{ outline: 'none', py: 1.5 }}>
                                <FeedbackCard
                                    key={response._id}
                                    indexFeedback={indexFeedback}
                                    indexResponse={indexResponse}
                                />
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}

export default FeedbackList;
