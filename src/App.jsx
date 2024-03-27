import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CookiesProvider } from 'react-cookie';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import router from './routes';
import ThemeAppProvider from './theme';
import { CssBaseline } from '@mui/material';

function App() {
    return (
        <HelmetProvider>
            <ThemeAppProvider>
                <CssBaseline />
                <CookiesProvider>
                    <RouterProvider router={router} />
                </CookiesProvider>
            </ThemeAppProvider>
        </HelmetProvider>
    );
}

export default App;
