import PropTypes from 'prop-types';
import { Layout } from './layout';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { adminSection, applicantSection, employeeSection, hrSection, systemAdminSection } from '../../constants/routes/sidebar';

const getSections = (role) => {
    if (role === 'Applicant') {
        return applicantSection;
    } else if (role === 'Admin') {
        return adminSection;
    } else if (role === 'SysAdmin') {
        return systemAdminSection;
    } else if (role === 'HR') {
        return hrSection;
    } else {
        return employeeSection;
    }
};

export const PrivateLayout = (props) => {
    const { user } = useSelector((state) => state.auth);
    const sections = useMemo(() => getSections(user.role), [user]);
    return <Layout sections={sections} navColor="evident" {...props} />;
};

Layout.propTypes = {
    children: PropTypes.node,
};
