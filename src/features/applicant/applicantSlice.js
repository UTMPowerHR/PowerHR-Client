import { createSlice } from '@reduxjs/toolkit';
import cloneDeep from 'lodash/cloneDeep';

const initialState = {
    resume: {
        _id: '123',
        basicDetail: {
            name: 'karthik',
            title: '',
            imageURL: '',
            email: '',
            phone: '',
            location: '',
            websiteUrl: {
                linkedin: '',
                github: '',
                portfolio: '',
            },
        },

        summary: {
            name: '',
            value: [],
        },

        objective: {
            name: '',
            value: [],
        },

        experience: {
            name: '',
            value: [],
        },

        education: {
            name: '',
            value: [],
        },

        awards: {
            name: '',
            value: [],
        },

        languages: {
            name: '',
            value: [],
        },

        technicalSkills: {
            name: '',
            value: [],
        },

        voluntering: {
            name: '',
            value: [],
        },

        softSkills: {
            name: '',
            value: [],
        },

        references: {
            name: '',
            value: [],
        },

        template: {
            name: 'modern',

            settings: {
                contentColor: '#000000',
                titleColor: '#000000',
                backgroundColor1: '',
                backgroundColor2: '',
                backgroundColor3: '',
            },

            pages: [
                {
                    columns: [],
                },
            ],
        },
    },
};

const applicantSlice = createSlice({
    name: 'applicant',
    initialState,
    reducers: {
        setResume: (state, action) => {
            state.resume = action.payload;
        },
        setSetting: (state, action) => {
            const { name, value } = action.payload;

            // Ensure that 'setting' and the specific property exist before setting the value
            if (!state.resume.template.settings) {
                state.resume.template.settings = {};
            }

            state.resume.template.settings[name] = value;
        },
        changeTemplate: (state, action) => {
            const { name, column } = action.payload;

            state.resume.template.name = name;

            const length = state.resume.template.pages[0].columns.length;

            // Move the last column in resume to the last column in the new template
            if (length > column) {
                const newColumns = cloneDeep(state.resume.template.pages[0].columns);
                // for (let i = column; i < length; i++) {
                //     delete newColumns[i];
                // }

                newColumns.splice(column, length - column);

                for (let i = length - 1; i >= column; i--) {
                    newColumns[column - 1].list.push(...state.resume.template.pages[0].columns[i].list);
                }

                state.resume.template.pages[0].columns = newColumns;
            } else {
                // Add new columns to the end of the resume
                const newColumns = [];
                for (let i = length; i < column; i++) {
                    newColumns.push({
                        list: [],
                    });
                }
                state.resume.template.pages[0].columns.push(...newColumns);
            }
        },
    },
});

export const { setResume, setSetting, changeTemplate } = applicantSlice.actions;

export default applicantSlice.reducer;
