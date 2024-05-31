import { Backdrop, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

const LoadingComponent = (props) => {
    const { children, isLoading } = props;

    if (isLoading === true) {
        return (
            <Backdrop open>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }
    return children;
};

LoadingComponent.propTypes = {
    children: PropTypes.node.isRequired,
    isLoading: PropTypes.bool.isRequired,
};

export default LoadingComponent;
