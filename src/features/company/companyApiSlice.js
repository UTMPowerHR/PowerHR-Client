import { apiSlice } from '../../store/api/apiSlice';

export const companyApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        registerCompany: builder.mutation({
            query: (data) => ({
                url: '/company/register',
                method: 'POST',
                body: { ...data },
            }),
        }),
        checkCompany: builder.mutation({
            query: (data) => ({
                url: '/company/check',
                method: 'POST',
                body: { ...data },
            }),
        }),
    }),
});

export const { useRegisterCompanyMutation, useCheckCompanyMutation } = companyApiSlice;
