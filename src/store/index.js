import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import localStorage from 'redux-persist/lib/storage';
import authReducer from '@features/auth/authSlice';
import formReducer from '@features/form/formSlice';
import companyReducer from '@features/company/companySlice';
import jobReducer from '@features/job/jobSlice';

const persistConfig = {
    key: 'root',
    version: 1,
    storage: localStorage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: persistedReducer,
        form: formReducer,
        company: companyReducer,
        job: jobReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(apiSlice.middleware),
    devTools: true,
});
