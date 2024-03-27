import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { createAppTheme } from './createAppTheme';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const ThemeAppProvider = (props) => {
    const { children } = props;

    const darkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(() => {
        return createAppTheme({
            colorPreset: 'blue',
            contrast: 'high',
            paletteMode: darkMode ? 'dark' : 'light',
            responsiveFontSizes: true,
        });
    }, [darkMode]);

    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <meta name="color-scheme" content={darkMode ? 'dark' : 'light'} />
                <meta name="theme-color" content={theme.palette.primary.main} />
            </Helmet>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

ThemeAppProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ThemeAppProvider;
