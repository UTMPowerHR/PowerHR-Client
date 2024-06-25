import PropTypes from 'prop-types';
import MultipleChoice from './multipleChoice';
import DropDown from './dropdown';
import CheckBox from './checkbox';
import ShortAnswer from './shortAnswer';
import Paragraph from './paragraph';
import LinearScale from './linearScale';

function Question(props) {
    const { id, type, index } = props;

    switch (type) {
        case 'Multiple Choice':
            return <MultipleChoice id={id} index={index} />;
        case 'Short Answer':
            return <ShortAnswer index={index} />;
        case 'Paragraph':
            return <Paragraph index={index} />;
        case 'Checkboxes':
            return <CheckBox id={id} index={index} />;
        case 'Drop-down':
            return <DropDown id={id} index={index} />;
        case 'Linear Scale':
            return <LinearScale id={id} index={index} />;
        default:
            return null;
    }
}

Question.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
};

Question.displayName = 'Question';

export default Question;
