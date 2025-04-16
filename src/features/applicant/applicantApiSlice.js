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
        getResume: builder.query({
            query: (userId) => `/resume/resume/user/${userId}`, // ✅ Correct path
            providesTags: ['Resume'],
        }),
        saveResume: builder.mutation({
            query: (resumeData) => ({
                url: '/resume/resume',
                method: 'POST',
                body: resumeData,
                invalidatesTags: ['Resume'],
            }),
        }),
        updateResume: builder.mutation({
            query: ({ id, ...resumeData }) => ({
                url: `/resume/resume/${id}`,
                method: 'PUT',
                body: resumeData,
                invalidatesTags: ['Resume'],
            }),
        }),
    }),
});

export const { useRegisterApplicantMutation, useGetResumeQuery, useSaveResumeMutation, useUpdateResumeMutation } =
    applicantApiSlice;
