import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Card } from '@mui/material';
import { useSelector } from 'react-redux';
import MultipleChoice from './questions/multipleChoice';
import CheckBox from './questions/checkbox';
import DropDown from './questions/dropdown';
import LinearScale from './questions/linearScale';
import Paragraph from './questions/paragraph';
import ShortAnswer from './questions/shortAnswer';
import { useEffect, useState } from 'react';
import QuestionHeader from './questions/header';
import FooterQuestion from './questions/footer';

const QuestionCard = forwardRef((props, ref) => {
    const { id, dragging, ...other } = props;
    const [expand, setExpand] = useState(false);
    const currentQuestion = useSelector((state) => state.form.currentQuestion);

    useEffect(() => {
        if (currentQuestion === id) {
            setExpand(true);
        } else {
            setExpand(false);
        }
    }, [currentQuestion, id]);
    const question = useSelector((state) => state.form.form.questions.find((question) => question._id === id));

    return (
        <>
            <Card
                elevation={dragging ? 8 : 1}
                ref={ref}
                sx={{
                    backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'background.paper'),
                    ...(dragging && {
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'dark' ? 'neutral.800' : 'background.paper',
                    }),
                    p: 3,
                    userSelect: 'none',
                    '&:hover': {
                        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.700' : 'neutral.50'),
                    },
                    '&.MuiPaper-elevation1': {
                        boxShadow: 1,
                    },
                }}
                {...other}
            >
                <QuestionHeader id={id} expand={expand} />
                {question?.questionType === 'Multiple Choice' ? (
                    <MultipleChoice key={id + 'MC'} id={id} expand={expand} />
                ) : null}
                {question?.questionType === 'Short Answer' ? <ShortAnswer key={id + 'SA'} expand={expand} /> : null}
                {question?.questionType === 'Paragraph' ? <Paragraph key={id + 'PG'} expand={expand} /> : null}
                {question?.questionType === 'Checkboxes' ? <CheckBox key={id + 'CB'} id={id} expand={expand} /> : null}
                {question?.questionType === 'Drop-down' ? <DropDown key={id + 'DD'} id={id} expand={expand} /> : null}
                {question?.questionType === 'Linear Scale' ? (
                    <LinearScale key={id + 'LS'} id={id} expand={expand} />
                ) : null}
                <FooterQuestion id={id} />
            </Card>
        </>
    );
});

QuestionCard.displayName = 'QuestionCard';

QuestionCard.propTypes = {
    id: PropTypes.string,
    dragging: PropTypes.bool,
};

QuestionCard.defaultProps = {
    dragging: false,
};

export default QuestionCard;
