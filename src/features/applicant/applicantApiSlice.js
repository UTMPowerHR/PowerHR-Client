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
            query: (userId) => `/resume/resume/user/${userId}`,
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
        generateResumeFile: builder.mutation({
            query: (resumeId) => ({
                url: `/resume/resume/generate/${resumeId}`,
                method: 'POST',
            }),
        }),
        extractResume: builder.mutation({
            query: ({ formData, userId }) => ({
                url: `/resume/extract?userId=${userId}`,
                method: 'POST',
                body: formData,

                prepareHeaders: (headers) => {
                    headers.delete('content-type');
                    return headers;
                },
            }),
            transformResponse: (response) => {
                console.log('RTK Query response:', response);
                return response;
            },
            transformErrorResponse: (response) => {
                console.log('RTK Query error:', response);
                return response;
            },
        }),
        saveExtractedResume: builder.mutation({
            query: ({ userId, resumeData, originalFileName }) => ({
                url: '/resume/save-extracted',
                method: 'POST',
                body: { userId, resumeData, originalFileName },
            }),
        }),
    }),
});

export const {
    useRegisterApplicantMutation,
    useGetResumeQuery,
    useSaveResumeMutation,
    useUpdateResumeMutation,
    useGenerateResumeFileMutation,
    useExtractResumeMutation,
    useSaveExtractedResumeMutation,
} = applicantApiSlice;
