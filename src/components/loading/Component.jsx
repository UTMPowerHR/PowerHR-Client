import { Backdrop, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

const LoadingComponent = (props) => {
    const { children, isloading } = props;

    if (isloading === true) {
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
    isloading: PropTypes.bool.isRequired,
};

export default LoadingComponent;
