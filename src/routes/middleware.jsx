import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RoleMiddleware = (props) => {
    const user = useSelector((state) => state.user);
    const { roles, children } = props;

    if (roles.includes(user?.role)) {
        return children;
    }

    return <Navigate to="/unauthorized" />;
};

RoleMiddleware.propTypes = {
    roles: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
};

export default RoleMiddleware;
