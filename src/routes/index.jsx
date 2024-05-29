import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import publicRoutes from './publicRoutes';
import privateRoutes from './privateRoutes';
import { LoadingPage } from '../components/loading';
import ErrorPage from '../pages/error';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<LoadingPage />}>
            {publicRoutes}
            {privateRoutes}
            <Route path="*" element={<ErrorPage />} />
        </Route>,
    ),
);

export default router;
