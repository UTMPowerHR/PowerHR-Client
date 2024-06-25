import { Avatar, Box, Button, Dialog, Grid, Paper, Stack, SvgIcon, Typography } from '@mui/material';
import AlertTriangleIcon from '@untitled-ui/icons-react/build/esm/AlertTriangle';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetPublishFormByIdQuery, useSubmitFormMutation } from '@features/form/formApiSlice';
import { setForm, initializeFeedback } from '@features/form/formSlice';
import Show from '@components/show';
import QuestionCard from './components/questionCard';
import PropTypes from 'prop-types';

function AnswerForm(props) {
    const { disabled } = props;
    const form = useSelector((state) => state.form.form);
    const user = useSelector((state) => state.auth.user);
    const feedback = useSelector((state) => state.form.feedback);
    const [open, setOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data, isSuccess, isLoading } = useGetPublishFormByIdQuery(id, { refetchOnMountOrArgChange: true });
    const [submitForm, { isLoading: isSubmitLoading, isSuccess: isSubmitSuccess }] = useSubmitFormMutation();

    useEffect(() => {
        if (isSuccess) {
            dispatch(setForm(data.form));
            if (data.form.employeeDone.includes(user._id) && data.form.setting.once) {
                setSubmitted(true);
            } else {
                dispatch(initializeFeedback(data.form));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isSuccess]);

    const handleClear = () => {
        dispatch(initializeFeedback(form));
    };

    const handleSubmit = async () => {
        // Check if all required questions are answered
        const requiredQuestions = form.questions.filter((question) => question.required);
        const answeredQuestions = feedback.responses.filter(
            (response) =>
                response.answers.length > 0 && requiredQuestions.some((question) => question._id === response.question),
        );

        if (requiredQuestions.length !== answeredQuestions.length) {
            setOpen(true);
            return;
        }

        await submitForm({
            id: form._id,
            userId: user._id,
            responses: feedback.responses,
        });
    };

    const onClose = () => {
        setOpen(false);
    };

    // useEffect(() => {
    //     if (isSubmitSuccess) {
    //         navigate(`/form/list`);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isSubmitSuccess]);

    if (isLoading) return <div>Loading...</div>;

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
                            <Typography variant="h4">{disabled ? form.name + ' (Preview)' : form.name}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">{form.description}</Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Show when={submitted || isSubmitSuccess}>
                    <Grid item xs={12}>
                        <Typography variant="h7">You have already submitted this form</Typography>
                        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                            <Show when={!data.form.setting.once}>
                                <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
                                    Submit another response
                                </Button>
                            </Show>
                            <Button variant="contained" color="primary" onClick={() => navigate('/form/publish')}>
                                Back
                            </Button>
                        </Stack>
                    </Grid>
                </Show>

                <Show when={!submitted && !isSubmitSuccess}>
                    <Grid item xs={12}>
                        <Box>
                            {form.questions?.map((question, index) => (
                                <Box key={question._id} sx={{ outline: 'none', py: 1.5 }}>
                                    <QuestionCard id={question._id} index={index} />
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={isSubmitLoading || disabled}
                            >
                                Submit
                            </Button>
                            <Button variant="text" color="primary" onClick={handleClear}>
                                Clear
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid>
                        <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
                            <Paper elevation={12}>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{
                                        display: 'flex',
                                        p: 3,
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            backgroundColor: 'error.lightest',
                                            color: 'error.main',
                                        }}
                                    >
                                        <SvgIcon>
                                            <AlertTriangleIcon />
                                        </SvgIcon>
                                    </Avatar>
                                    <div>
                                        <Typography variant="h5">Please complete all required questions</Typography>
                                        <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                                            You have not answered all required questions. Please complete all required
                                        </Typography>
                                    </div>
                                </Stack>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        pb: 3,
                                        px: 3,
                                    }}
                                >
                                    <Button
                                        sx={{
                                            backgroundColor: 'error.main',
                                            '&:hover': {
                                                backgroundColor: 'error.dark',
                                            },
                                        }}
                                        variant="contained"
                                        onClick={onClose}
                                    >
                                        Ok
                                    </Button>
                                </Box>
                            </Paper>
                        </Dialog>
                    </Grid>
                </Show>
            </Grid>
        </>
    );
}

AnswerForm.propTypes = {
    disabled: PropTypes.bool,
};

export default AnswerForm;
