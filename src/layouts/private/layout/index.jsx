import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MobileNav } from '../mobile-nav';
import { SideNav } from './side-nav';
import { TopNav } from './top-nav';
import { useLocation, Outlet } from 'react-router-dom';
import { Container } from '@mui/material';

const SIDE_NAV_WIDTH = 280;

const useMobileNav = () => {
    const pathname = useLocation().pathname;
    const [isOpen, setIsOpen] = useState(false);

    const handlePathnameChange = useCallback(() => {
        if (isOpen) {
            setIsOpen(false);
        }
    }, [isOpen]);

    useEffect(
        () => {
            handlePathnameChange();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pathname],
    );

    const handleOpen = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    return {
        isOpen,
        handleOpen,
        handleClose,
    };
};

const VerticalLayoutRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    [theme.breakpoints.up('lg')]: {
        paddingLeft: SIDE_NAV_WIDTH,
    },
}));

const VerticalLayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%',
});

export const Layout = (props) => {
    const { sections, navColor } = props;
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const mobileNav = useMobileNav();

    return (
        <>
            <TopNav onMobileNavOpen={mobileNav.handleOpen} />
            {lgUp && <SideNav color={navColor} sections={sections} />}
            {!lgUp && (
                <MobileNav
                    color={navColor}
                    onClose={mobileNav.handleClose}
                    open={mobileNav.isOpen}
                    sections={sections}
                />
            )}
            <VerticalLayoutRoot>
                <VerticalLayoutContainer>
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            py: 8,
                        }}
                    >
                        <Container maxWidth={'xl'}>
                            <Outlet />
                        </Container>
                    </Box>
                </VerticalLayoutContainer>
            </VerticalLayoutRoot>
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.node,
    sections: PropTypes.array,
    navColor: PropTypes.string,
};
