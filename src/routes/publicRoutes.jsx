import { Route } from 'react-router-dom';
import Layout from '../layouts/public';
import CheckLogin from '../utils/checkLogin';
import * as Auth from '../pages/auth';
import PATHS from '../constants/routes/paths';

const publicRoutes = (
    <>
        <Route element={<Layout />}>
            <Route path="" element={<div>Home</div>} />
            <Route path={PATHS.AUTH.FORGOT_PASSWORD} element={<Auth.ForgotPassword />} />
            <Route path={PATHS.AUTH.RESET_PASSWORD} element={<Auth.ResetPassword />} />
            <Route path={PATHS.AUTH.REGISTER} element={<Auth.Register />} />
            <Route path={PATHS.AUTH.ACTIVATE} element={<Auth.Activate />} />

            <Route element={<CheckLogin />}>
                <Route path={PATHS.AUTH.LOGIN} element={<Auth.Login />} />
            </Route>
        </Route>
    </>
);

export default publicRoutes;
