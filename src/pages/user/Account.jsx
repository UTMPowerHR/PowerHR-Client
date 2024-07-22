import { Divider, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { lazy } from 'react';

const Profile = lazy(() => import('./Profile'));
const Setting = lazy(() => import('./Setting'));

const tabs = [
    { label: 'Profile', value: 'profile' },
    { label: 'Setting', value: 'setting' },
];

export default function Account(props) {
    const { tabValue } = props;

    const navigate = useNavigate();

    const [currentTab, setCurrentTab] = useState(tabValue);

    const handleTabsChange = useCallback(
        (event, value) => {
            setCurrentTab(value);
            // change url

            navigate(`/user/${value}`, { replace: true });
        },
        [navigate],
    );

    return (
        <>
            <Stack spacing={3} sx={{ mb: 3 }}>
                <Typography variant="h4">Account</Typography>
                <div>
                    <Tabs
                        indicatorColor="primary"
                        onChange={handleTabsChange}
                        scrollButtons="auto"
                        textColor="primary"
                        value={currentTab}
                        variant="scrollable"
                    >
                        {tabs.map((tab) => (
                            <Tab key={tab.value} label={tab.label} value={tab.value} />
                        ))}
                    </Tabs>
                    <Divider />
                </div>
            </Stack>

            {currentTab === 'profile' && <Profile />}
            {currentTab === 'setting' && <Setting />}
        </>
    );
}

Account.propTypes = {
    tabValue: PropTypes.string,
};
