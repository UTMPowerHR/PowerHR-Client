import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Menu01Icon from '@untitled-ui/icons-react/build/esm/Menu01';
import { Box, Button, Container, IconButton, Stack, SvgIcon, useMediaQuery } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Logo } from './logo';
import { useWindowScroll } from '../../../hooks/use-window-scroll';
import { TopNavItem } from './top-nav-item';
import PATHS from '../../../constants/routes/paths';

const items = [
    {
        title: 'Company Registration',
        path: PATHS.COMPANY.REGISTER,
    },
];

const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
    const { onMobileNavOpen } = props;
    const pathname = useLocation().pathname;
    const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
    const [elevate, setElevate] = useState(false);
    const offset = 64;
    const delay = 100;

    const handleWindowScroll = useCallback(() => {
        if (window.scrollY > offset) {
            setElevate(true);
        } else {
            setElevate(false);
        }
    }, []);

    useWindowScroll({
        handler: handleWindowScroll,
        delay,
    });

    return (
        <Box
            component="header"
            sx={{
                left: 0,
                position: 'fixed',
                right: 0,
                top: 0,
                pt: 2,
                zIndex: (theme) => theme.zIndex.appBar,
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    backdropFilter: 'blur(6px)',
                    backgroundColor: 'transparent',
                    borderRadius: 2.5,
                    boxShadow: 'none',
                    transition: (theme) =>
                        theme.transitions.create('box-shadow, background-color', {
                            easing: theme.transitions.easing.easeInOut,
                            duration: 200,
                        }),
                    ...(elevate && {
                        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
                        boxShadow: 8,
                    }),
                }}
            >
                <Stack direction="row" spacing={2} sx={{ height: TOP_NAV_HEIGHT }}>
                    <Stack alignItems="center" direction="row" justifyContent="flex-start" spacing={2}>
                        {!mdUp && (
                            <IconButton onClick={onMobileNavOpen}>
                                <SvgIcon fontSize="small">
                                    <Menu01Icon />
                                </SvgIcon>
                            </IconButton>
                        )}
                    </Stack>
                    <Stack alignItems="center" direction="row" spacing={1} sx={{ flexGrow: 1 }}>
                        <Stack
                            alignItems="center"
                            component="a"
                            direction="row"
                            display="inline-flex"
                            href={PATHS.INDEX}
                            spacing={1}
                            sx={{ textDecoration: 'none' }}
                        >
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    height: 24,
                                    width: 24,
                                }}
                            >
                                <Logo />
                            </Box>
                            {mdUp && (
                                <Box
                                    sx={{
                                        color: 'text.primary',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontSize: 14,
                                        fontWeight: 800,
                                        letterSpacing: '0.3px',
                                        lineHeight: 2.5,
                                        '& span': {
                                            color: 'primary.main',
                                        },
                                    }}
                                >
                                    PowerHR
                                </Box>
                            )}
                        </Stack>
                    </Stack>
                    {mdUp && (
                        <Stack alignItems="center" direction="row" spacing={2}>
                            <Box component="nav" sx={{ height: '100%' }}>
                                <Stack
                                    component="ul"
                                    alignItems="center"
                                    justifyContent="center"
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        height: '100%',
                                        listStyle: 'none',
                                        m: 0,
                                        p: 0,
                                    }}
                                >
                                    <>
                                        {items.map((item) => {
                                            const checkPath = !!(item.path && pathname);
                                            const partialMatch = checkPath ? pathname.includes(item.path) : false;
                                            const exactMatch = checkPath ? pathname === item.path : false;
                                            const active = item.children ? partialMatch : exactMatch;

                                            return (
                                                <TopNavItem
                                                    active={active}
                                                    key={item.title}
                                                    path={item.path}
                                                    title={item.title}
                                                >
                                                    {item.children}
                                                </TopNavItem>
                                            );
                                        })}
                                    </>
                                </Stack>
                            </Box>
                        </Stack>
                    )}
                    <Stack
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                        sx={{ flexGrow: 1 }}
                    >
                        <Button
                            component="a"
                            size={mdUp ? 'medium' : 'small'}
                            href={PATHS.AUTH.LOGIN}
                            variant="contained"
                        >
                            Login
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

TopNav.propTypes = {
    onMobileNavOpen: PropTypes.func,
};
