import { lazy } from 'react';

const Registration = lazy(() => import('./Registration'));
const Employees = lazy(() => import('./Employees'));
const Departments = lazy(() => import('./Departments'));

export { Registration, Employees, Departments };
