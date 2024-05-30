import { apiSlice } from '../../store/api/apiSlice';

export const applicantApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        registerApplicant: builder.mutation({
            query: (data) => ({
                url: '/users/applicants/register',
                method: 'POST',
                body: { ...data },
            }),
        }),
    }),
});

export const { useRegisterApplicantMutation } = applicantApiSlice;
