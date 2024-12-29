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
        getCompany: builder.query({
            query: (id) => ({
                url: '/company/' + id,
                method: 'GET',
            }),
            providesTags: ['Company'],
        }),
        getCompanyProfile: builder.query({
            query: (id) => ({
                url: '/company/' + id + '/profile',
                method: 'GET',
            }),
            providesTags: ['Company'],
        }),
        updateCompany: builder.mutation({
            query: (data) => ({
                url: '/company/' + data._id,
                method: 'PUT',
                body: { ...data },
            }),
            invalidatesTags: ['Company'],
        }),
        checkCompany: builder.mutation({
            query: (data) => ({
                url: '/company/check',
                method: 'POST',
                body: { ...data },
            }),
        }),
        getEmployees: builder.query({
            query: (id) => ({
                url: '/company/' + id + '/employees',
                method: 'GET',
            }),
            providesTags: ['Company'],
        }),
        updateEmployee: builder.mutation({
            query: (data) => ({
                url: '/company/' + data.company + '/employees/' + data._id,
                method: 'PUT',
                body: { ...data },
            }),
            invalidatesTags: ['Company'],
        }),
        registerEmployee: builder.mutation({
            query: (data) => ({
                url: '/company/' + data.company + '/employees',
                method: 'POST',
                body: { ...data },
            }),
            invalidatesTags: ['Company'],
        }),
        getDepartments: builder.query({
            query: (id) => ({
                url: '/company/' + id + '/departments',
                method: 'GET',
            }),
            providesTags: ['Company'],
        }),
        createDepartment: builder.mutation({
            query: (data) => ({
                url: '/company/' + data.company + '/departments',
                method: 'POST',
                body: { ...data },
            }),
            invalidatesTags: ['Company'],
        }),
        updateDepartment: builder.mutation({
            query: (data) => ({
                url: '/company/' + data.company + '/departments/' + data._id,
                method: 'PUT',
                body: { ...data },
            }),
            invalidatesTags: ['Company'],
        }),
        getAnalyticTurnOver: builder.mutation({
            query: ({ id, from, to }) => ({
                url: '/company/' + id + '/analytic/turnover?from=' + from + '&to=' + to,
                method: 'GET',
            }),
        }),
        convertApplicantToEmployee: builder.mutation({
            query: (data) => ({
                url: '/company/' + data.company + '/employees/' + data._id + '/convert',
                method: 'PUT',
                body: { ...data },
            }),
            invalidatesTags: ['Company'],
        }),
    }),
});

export const {
    useRegisterCompanyMutation,
    useCheckCompanyMutation,
    useGetCompanyQuery,
    useGetCompanyProfileQuery,
    useUpdateCompanyMutation,
    useGetEmployeesQuery,
    useUpdateEmployeeMutation,
    useRegisterEmployeeMutation,
    useGetDepartmentsQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
    useGetAnalyticTurnOverMutation,
    useConvertApplicantToEmployeeMutation,
} = companyApiSlice;
