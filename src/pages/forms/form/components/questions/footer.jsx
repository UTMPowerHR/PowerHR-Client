import { Grid, IconButton, Stack, Switch, FormControlLabel } from '@mui/material';
import { Trash02 } from '@untitled-ui/icons-react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { deleteQuestion, setQuestionSetting } from '../../../../../features/form/formSlice';

function FooterQuestion(props) {
    const { id } = props;

    const question = useSelector((state) => state.form.form.questions.find((question) => question._id === id));
    const lengthQuestion = useSelector((state) => state.form.form.questions.length);

    const dispatch = useDispatch();

    const handleDeleteQuestion = () => {
        dispatch(deleteQuestion(id));
    };

    const handleOnChange = (e) => {
        const newQuestion = { ...question };
        newQuestion.required = e.target.checked;

        dispatch(setQuestionSetting(newQuestion));
    };

    return (
        <Grid container spacing={2} mb={1}>
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center">
                    <FormControlLabel
                        control={<Switch checked={question.required} onChange={handleOnChange} />}
                        label="Required"
                        labelPlacement="start"
                    />
                    <IconButton
                        onClick={handleDeleteQuestion}
                        sx={{ color: 'error.main' }}
                        disabled={lengthQuestion <= 1}
                    >
                        <Trash02 />
                    </IconButton>
                </Stack>
            </Grid>
        </Grid>
    );
}

FooterQuestion.propTypes = {
    id: PropTypes.string,
};

export default FooterQuestion;
