import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import publicRoutes from './publicRoutes';
import privateRoutes from './privateRoutes';
import { LoadingPage } from '../components/loading';
import ErrorPage from '../pages/error';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<LoadingPage />} errorElement={<ErrorPage />}>
            {publicRoutes}
            {privateRoutes}
            <Route path="*" element={<>404</>} />
        </Route>,
    ),
);

export default router;
