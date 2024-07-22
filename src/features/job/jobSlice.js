import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    create: {
        title: '',
        category: 'full-time',
        tags: [],
        description: '',
        qualification: 'SPM',
        experience: [0, 0],
        salaryRange: [0, 0],
        skills: [],
        languages: [],
        softSkills: [],
        technicalSkills: [],
        gender: 'All',
        environment: 'On-site',
        industry: 'professional',
        quota: 1,
    },
    companies: [],
    postings: [],
};

const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {
        setAllCreate: (state, action) => {
            state.create = action.payload;
        },
        setCreate: (state, action) => {
            state.create[action.payload.name] = action.payload.value;
        },
        setCompanies: (state, action) => {
            state.companies = action.payload;
        },
        setPostings: (state, action) => {
            state.postings = action.payload;
        },
    },
});

export const { setAllCreate, setCreate, setCompanies, setPostings } = jobSlice.actions;

export default jobSlice.reducer;
