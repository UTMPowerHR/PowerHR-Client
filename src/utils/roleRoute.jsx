import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

const RoleRoute = (props) => {
    const { roles } = props;

    const location = useLocation();
    const user = useSelector((state) => state.auth.user);

    const hasRole = roles.includes(user.role);

    return hasRole ? <Outlet /> : <Navigate to="/unauthorized" state={{ from: location }} replace />;
};

RoleRoute.propTypes = {
    roles: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default RoleRoute;
