import { Backdrop, CircularProgress } from '@mui/material';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

const LoadingPage = () => {
    return (
        <Suspense
            fallback={
                <Backdrop open>
                    <CircularProgress color="inherit" />
                </Backdrop>
            }
        >
            <Outlet />
        </Suspense>
    );
};

export default LoadingPage;
