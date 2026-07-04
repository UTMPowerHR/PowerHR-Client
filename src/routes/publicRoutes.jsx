import { Route } from 'react-router-dom';
import Layout from '@layouts/public';
import CheckLogin from '@utils/checkLogin';
import * as Auth from '@pages/auth';
import PATHS from '@constants/routes/paths';
import { Registration } from '@pages/company';
import ResumeTest from '@features/resume/ResumeTest';

const publicRoutes = (
    <>
        <Route element={<Layout />}>
            <Route>
                <Route path="" element={<div>Home</div>} />
            </Route>

            <Route>
                <Route path={PATHS.AUTH.FORGOT_PASSWORD} element={<Auth.ForgotPassword />} />
                <Route path={PATHS.AUTH.RESET_PASSWORD} element={<Auth.ResetPassword />} />
                <Route path={PATHS.AUTH.REGISTER} element={<Auth.Register />} />
                <Route path={PATHS.AUTH.ACTIVATE} element={<Auth.Activate />} />

                <Route element={<CheckLogin />}>
                    <Route path={PATHS.AUTH.LOGIN} element={<Auth.Login />} />
                </Route>
            </Route>

            <Route>
                <Route path={PATHS.COMPANY.REGISTER} element={<Registration />} />
            </Route>
            <Route element={<Layout />}>
                <Route path="/resume-test" element={<ResumeTest />} />
            </Route>
        </Route>
    </>
);

export default publicRoutes;
