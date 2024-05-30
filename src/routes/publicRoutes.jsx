import { Route } from 'react-router-dom';
import Layout from '../layouts/public';
import CheckLogin from '../utils/checkLogin';
import * as Authentcation from '../pages/authentication';
import PATHS from '../constants/routes/paths';

const publicRoutes = (
    <>
        <Route element={<Layout />}>
            <Route path="" element={<div>Home</div>} />
            <Route path={PATHS.AUTH.FORGOT_PASSWORD} element={<Authentcation.ForgotPassword />} />
            <Route path={PATHS.AUTH.RESET_PASSWORD} element={<Authentcation.ResetPassword />} />
            <Route path={PATHS.AUTH.REGISTER} element={<Authentcation.Register />} />

            <Route element={<CheckLogin />}>
                <Route path={PATHS.AUTH.LOGIN} element={<Authentcation.Login />} />
            </Route>
        </Route>
    </>
);

export default publicRoutes;
