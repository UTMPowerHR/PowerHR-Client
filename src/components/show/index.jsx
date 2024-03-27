import PropTypes from 'prop-types';

const Show = (props) => {
    const { children, when } = props;

    return when ? children : null;
};

Show.propTypes = {
    children: PropTypes.node.isRequired,
    when: PropTypes.bool.isRequired,
};

export default Show;
