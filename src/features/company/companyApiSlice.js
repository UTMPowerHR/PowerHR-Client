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
        }),
        getCompanyProfile: builder.query({
            query: (id) => ({
                url: '/company/' + id + '/profile',
                method: 'GET',
            }),
        }),
        updateCompany: builder.mutation({
            query: (data) => ({
                url: '/company/' + data._id,
                method: 'PUT',
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
        getEmployees: builder.query({
            query: (id) => ({
                url: '/company/' + id + '/employees',
                method: 'GET',
            }),
        }),
        updateEmployee: builder.mutation({
            query: (data) => ({
                url: '/company/' + data.company + '/employees/' + data._id,
                method: 'PUT',
                body: { ...data },
            }),
        }),
        registerEmployee: builder.mutation({
            query: (data) => ({
                url: '/company/' + data.company + '/employees',
                method: 'POST',
                body: { ...data },
            }),
        }),
        getDepartments: builder.query({
            query: (id) => ({
                url: '/company/' + id + '/departments',
                method: 'GET',
            }),
        }),
        createDepartment: builder.mutation({
            query: (data) => ({
                url: '/company/' + data.company + '/departments',
                method: 'POST',
                body: { ...data },
            }),
        }),
        updateDepartment: builder.mutation({
            query: (data) => ({
                url: '/company/' + data.company + '/departments/' + data._id,
                method: 'PUT',
                body: { ...data },
            }),
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
} = companyApiSlice;
