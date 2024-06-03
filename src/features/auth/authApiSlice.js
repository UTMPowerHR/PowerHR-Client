import { apiSlice } from '../../store/api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials },
            }),
        }),
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: { email },
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ token, password, confirmPassword }) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: { token, password, confirmPassword },
            }),
        }),
        verifyToken: builder.query({
            query: (token) => ({
                url: `/auth/verify-token?token=${token}`,
                method: 'GET',
            }),
        }),
        activateAccount: builder.mutation({
            query: ({ token, password, confirmPassword }) => ({
                url: `/auth/activate-account?token=${token}`,
                method: 'POST',
                body: { password, confirmPassword },
            }),
        }),
        registerApplicant: builder.mutation({
            query: (data) => ({
                url: '/auth/register/applicant',
                method: 'POST',
                body: { ...data },
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
    useRegisterApplicantMutation,
} = authApiSlice;
