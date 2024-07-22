import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    employees: [],
    departments: [],
};

const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        setEmployees: (state, action) => {
            state.employees = action.payload;
        },
        setDepartments: (state, action) => {
            state.departments = action.payload;
        },
    },
});

export const { setEmployees, setDepartments } = companySlice.actions;

export default companySlice.reducer;
