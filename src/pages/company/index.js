import { lazy } from 'react';

const Registration = lazy(() => import('./Registration'));
const Employees = lazy(() => import('./Employees'));
const Departments = lazy(() => import('./Departments'));
const ManageCompany = lazy(() => import('./ManageCompany'));
const ProfileCompany = lazy(() => import('./ProfileCompany'));

export { Registration, Employees, Departments, ManageCompany, ProfileCompany };
