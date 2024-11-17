import PropTypes from 'prop-types';
import { Layout } from './layout';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { adminSection, applicantSection, employeeSection, hrSection, systemAdminSection } from '@layouts/sidebar';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrAfter);

//Checks whether the employee is terminated
//If the employee is in termination process, it will display the transfer document side bar.
const filterEmployeeSection = (sections, user) => {
    if (user.terminationDate && dayjs(user.terminationDate).isBefore(dayjs())) {
        return sections.map((section) => {
            // Check and remove the "Transfer Document" menu
            const updatedItems = section.items.filter(
                (item) => item.title !== 'Transfer Document'
            );
            return { ...section, items: updatedItems };
        });
    }
    return sections;
};

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
    const sections = useMemo(() => {
        const baseSections = getSections(user.role);
        if (user.role === 'Employee') {
            return filterEmployeeSection(baseSections, user);
        }
        return baseSections;
    }, [user]);    
    return <Layout sections={sections} navColor="evident" {...props} />;
};

Layout.propTypes = {
    children: PropTypes.node,
};
