import { lazy } from 'react';

const Login = lazy(() => import('./Login'));
const ForgotPassword = lazy(() => import('./Forgot'));
const ResetPassword = lazy(() => import('./Reset'));
const Register = lazy(() => import('./Register'));

export { Login, ForgotPassword, ResetPassword, Register };
