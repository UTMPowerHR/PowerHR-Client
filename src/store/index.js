import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
// import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
// import storageSession from 'redux-persist/lib/storage/session';

// const persistConfig = {
//     key: 'root',
//     version: 1,
//     storage: storageSession,
// };

// const persistedReducer = persistReducer(persistConfig, authReducer);

// export const store = configureStore({
//     reducer: {
//         [apiSlice.reducerPath]: apiSlice.reducer,
//     },
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: {
//                 // Ignore these action types
//                 ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//             },
//         }).concat(apiSlice.middleware),
//     devTools: true,
// });

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});
