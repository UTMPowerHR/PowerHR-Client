import { Card, Typography, Grid, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Question from './question';

const QuestionCard = (props) => {
    const { id, index, ...other } = props;

    const question = useSelector((state) => state.form.form.questions.find((question) => question._id === id));

    return (
        <>
            <Card elevation={8} sx={{ p: 3 }} {...other}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1">
                                <Stack direction="row">
                                    {question.questionText}
                                    {question.required ? (
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
                        <Question id={id} type={question.questionType} index={index} />
                    </Grid>
                </Grid>
            </Card>
        </>
    );
};

QuestionCard.propTypes = {
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
};
QuestionCard.displayName = 'QuestionCard';

export default QuestionCard;
