import { Box, Container, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Outlet, useLocation } from 'react-router-dom';
import { TopNav } from './component/top-nav';
import { useCallback, useEffect, useState } from 'react';
import Show from '../../components/show';
import { SideNav } from './component/side-nav';

const LayoutRoot = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top center',
    backgroundImage: 'url("/assets/gradient-bg.svg")',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    height: '100%',
}));

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

const Layout = () => {
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const mobileNav = useMobileNav();

    return (
        <>
            <TopNav onMobileNavOpen={mobileNav.handleOpen} />
            <Show when={!lgUp}>
                <SideNav onClose={mobileNav.handleClose} open={mobileNav.isOpen} />
            </Show>
            <LayoutRoot>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        flex: '1 1 auto',
                    }}
                >
                    <Container
                        maxWidth="sm"
                        sx={{
                            py: {
                                xs: '90px',
                                md: '120px',
                            },
                        }}
                    >
                        <Outlet />
                    </Container>
                </Box>
            </LayoutRoot>
        </>
    );
};

export default Layout;
