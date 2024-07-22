import { Card, Typography, Grid, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Feedback from './feedback';

const FeedbackCard = (props) => {
    const { indexFeedback, indexResponse, ...other } = props;

    const response = useSelector((state) => state.form.feedbacks?.feedbacks[indexFeedback]?.responses[indexResponse]);

    return (
        <>
            <Card elevation={8} sx={{ p: 3 }} {...other}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1">
                                <Stack direction="row">
                                    {response.question.questionText}
                                    {response.question.required ? (
                                        <Typography color="error" ml={1}>
                                            *
                                        </Typography>
                                    ) : (
                                        ''
                                    )}
                                </Stack>
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Feedback
                            type={response.question.questionType}
                            indexFeedback={indexFeedback}
                            indexResponse={indexResponse}
                        />
                    </Grid>
                </Grid>
            </Card>
        </>
    );
};

FeedbackCard.propTypes = {
    indexFeedback: PropTypes.number.isRequired,
    indexResponse: PropTypes.number.isRequired,
};
FeedbackCard.displayName = 'FeedbackCard';

export default FeedbackCard;
