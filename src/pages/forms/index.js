import { lazy } from 'react';

const ManageForm = lazy(() => import('./form/Manage'));
const EditForm = lazy(() => import('./form/Edit'));
const AnswerForm = lazy(() => import('./feedback/Answer'));
const Feedback = lazy(() => import('./feedback/Feedback'));
const PublishForm = lazy(() => import('./form/PublishForm'));

export { ManageForm, EditForm, AnswerForm, Feedback, PublishForm };
