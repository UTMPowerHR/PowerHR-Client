import { apiSlice } from '../../store/api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/authentication/login',
                method: 'POST',
                body: { ...credentials },
            }),
        }),
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: '/authentication/forgot-password',
                method: 'POST',
                body: { email },
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ token, password, confirmPassword }) => ({
                url: '/authentication/reset-password',
                method: 'POST',
                body: { token, password, confirmPassword },
            }),
        }),
        verifyToken: builder.query({
            query: (token) => ({
                url: `/authentication/verify-token?token=${token}`,
                method: 'GET',
            }),
        }),
        activateAccount: builder.mutation({
            query: (token) => ({
                url: `/authentication/activate-account?token=${token}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useVerifyTokenQuery,
    useActivateAccountMutation,
} = authApiSlice;
