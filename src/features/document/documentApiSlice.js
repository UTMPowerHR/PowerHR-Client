import { apiSlice } from '../../store/api/apiSlice';

export const documentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        uploadDocument: builder.mutation({
            query: (documentData) => {
                const formData = new FormData();
                formData.append('file', documentData.file);
                formData.append('uploader', documentData.uploader);
                formData.append('department', documentData.department);
                formData.append('notes', documentData.notes);

                return {
                    url: '/document/upload',
                    method: 'POST',
                    body: formData,
                };
            },
        }),
        getAllDocument: builder.query({
            query: () => ({
                url: '/document/',
                method: 'GET',
            }),
            providesTags: ['Documents'],
        }),
        downloadDocument: builder.mutation({
            query: (id) => ({
                url: `/document/download/` + id,
                method: 'GET',
                responseHandler: (response) => response.blob(), // Expect binary data
            }),
        }),        
    }),
});

export const { 
    useUploadDocumentMutation,
    useGetAllDocumentQuery,
    useDownloadDocumentMutation,
} = documentApiSlice;