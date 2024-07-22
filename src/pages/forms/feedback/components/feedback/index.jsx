import PropTypes from 'prop-types';
import CheckBox from './checkbox';
import DropDown from './dropdown';
import LinearScale from './linearScale';
import MultipleChoice from './multipleChoice';
import Paragraph from './paragraph';
import ShortAnswer from './shortAnswer';

function Feedback(props) {
    const { type, indexFeedback, indexResponse } = props;

    switch (type) {
        case 'Multiple Choice':
            return <MultipleChoice indexFeedback={indexFeedback} indexResponse={indexResponse} />;
        case 'Short Answer':
            return <ShortAnswer indexFeedback={indexFeedback} indexResponse={indexResponse} />;
        case 'Paragraph':
            return <Paragraph indexFeedback={indexFeedback} indexResponse={indexResponse} />;
        case 'Checkboxes':
            return <CheckBox indexFeedback={indexFeedback} indexResponse={indexResponse} />;
        case 'Drop-down':
            return <DropDown indexFeedback={indexFeedback} indexResponse={indexResponse} />;
        case 'Linear Scale':
            return <LinearScale indexFeedback={indexFeedback} indexResponse={indexResponse} />;
        default:
            return null;
    }
}

Feedback.propTypes = {
    type: PropTypes.string.isRequired,
    indexFeedback: PropTypes.number.isRequired,
    indexResponse: PropTypes.number.isRequired,
};

Feedback.displayName = 'Feedback';

export default Feedback;
