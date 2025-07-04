import { createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';

const getDefaultTemplate = () => ({
    name: 'modern',
    column: 2,
    settings: {
        contentColor: '#34495e',
        titleColor: '#2c3e50',
        backgroundColor1: '#ffffff',
        backgroundColor2: '#f8f9fa',
        backgroundColor3: '#e9ecef',
    },
    pages: [
        {
            columns: [
                {
                    list: [
                        { name: 'summary', typeCard: 'string' },
                        { name: 'experience', typeCard: 'timeline' },
                        { name: 'education', typeCard: 'timeline' },
                    ],
                },
                {
                    list: [
                        { name: 'technicalSkills', typeCard: 'score' },
                        { name: 'softSkills', typeCard: 'list' },
                        { name: 'languages', typeCard: 'score' },
                    ],
                },
            ],
        },
    ],
});

const initialState = {
    resume: {
        _id: null,
        basicDetail: {
            name: '',
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
            name: 'Summary',
            value: [''],
        },

        objective: {
            name: 'Objective',
            value: [''],
        },

        experience: {
            name: 'Experience',
            value: [],
        },

        education: {
            name: 'Education',
            value: [],
        },

        awards: {
            name: 'Awards',
            value: [],
        },

        languages: {
            name: 'Languages',
            value: [],
        },

        technicalSkills: {
            name: 'Technical Skills',
            value: [],
        },

        voluntering: {
            name: 'Voluntering',
            value: [],
        },

        softSkills: {
            name: 'Soft Skills',
            value: [],
        },

        references: {
            name: 'References',
            value: [],
        },

        template: getDefaultTemplate(),
    },
};

export const applicantSlice = createSlice({
    name: 'applicant',
    initialState,
    reducers: {
        setBasicDetail: (state, action) => {
            state.resume.basicDetail = action.payload;
        },
        setSummary: (state, action) => {
            state.resume.summary.value = action.payload;
        },
        setObjective: (state, action) => {
            state.resume.objective.value = action.payload;
        },
        setExperience: (state, action) => {
            state.resume.experience.value = action.payload;
        },
        setEducation: (state, action) => {
            state.resume.education.value = action.payload;
        },
        setAwards: (state, action) => {
            state.resume.awards.value = action.payload;
        },
        setLanguages: (state, action) => {
            state.resume.languages.value = action.payload;
        },
        setTechnicalSkills: (state, action) => {
            state.resume.technicalSkills.value = action.payload;
        },
        setVoluntering: (state, action) => {
            state.resume.voluntering.value = action.payload;
        },
        setSoftSkills: (state, action) => {
            state.resume.softSkills.value = action.payload;
        },
        setReferences: (state, action) => {
            state.resume.references.value = action.payload;
        },
        setTemplate: (state, action) => {
            state.resume.template = action.payload;
        },
        setSetting: (state, action) => {
            const { name, value } = action.payload;

            // Ensure that 'settings' exists before setting the value
            if (!state.resume.template.settings) {
                state.resume.template.settings = {};
            }

            state.resume.template.settings[name] = value;
        },
        changeTemplate: (state, action) => {
            const { name, column } = action.payload;

            state.resume.template.name = name;

            const currentColumns = state.resume.template.pages[0]?.columns || [];
            const length = currentColumns.length;

            // Initialize pages if not exists
            if (!state.resume.template.pages[0]) {
                state.resume.template.pages = [{ columns: [] }];
            }

            // Move the last column in resume to the last column in the new template
            if (length > column) {
                const newColumns = cloneDeep(currentColumns);
                newColumns.splice(column, length - column);

                for (let i = length - 1; i >= column; i--) {
                    if (newColumns[column - 1] && currentColumns[i]) {
                        newColumns[column - 1].list.push(...currentColumns[i].list);
                    }
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
        resetApplicant: (state) => {
            // Keep the _id when resetting
            const currentId = state.resume._id;
            state.resume = cloneDeep(initialState.resume);
            state.resume._id = currentId;
        },
        setResume: (state, action) => {
            const incomingResume = action.payload;

            // Ensure proper template structure
            let templateData = getDefaultTemplate();
            if (incomingResume.template) {
                templateData = {
                    ...templateData,
                    ...incomingResume.template,
                    settings: {
                        ...templateData.settings,
                        ...incomingResume.template.settings,
                    },
                };

                // Ensure pages structure exists
                if (!incomingResume.template.pages || !Array.isArray(incomingResume.template.pages)) {
                    templateData.pages = getDefaultTemplate().pages;
                } else {
                    templateData.pages = incomingResume.template.pages.map((page) => ({
                        ...page,
                        columns: Array.isArray(page.columns) ? page.columns : [],
                    }));
                }
            }

            // Set the complete resume data
            state.resume = {
                _id: incomingResume._id || null,
                user: incomingResume.user || null,
                basicDetail: {
                    name: '',
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
                    ...incomingResume.basicDetail,
                },
                summary: {
                    name: 'Summary',
                    value: Array.isArray(incomingResume.summary?.value)
                        ? incomingResume.summary.value
                        : incomingResume.summary?.value
                          ? [incomingResume.summary.value]
                          : [''],
                    ...incomingResume.summary,
                },
                objective: {
                    name: 'Objective',
                    value: Array.isArray(incomingResume.objective?.value)
                        ? incomingResume.objective.value
                        : incomingResume.objective?.value
                          ? [incomingResume.objective.value]
                          : [''],
                    ...incomingResume.objective,
                },
                experience: {
                    name: 'Experience',
                    value: [],
                    ...incomingResume.experience,
                },
                education: {
                    name: 'Education',
                    value: [],
                    ...incomingResume.education,
                },
                awards: {
                    name: 'Awards',
                    value: [],
                    ...incomingResume.awards,
                },
                languages: {
                    name: 'Languages',
                    value: [],
                    ...incomingResume.languages,
                },
                technicalSkills: {
                    name: 'Technical Skills',
                    value: [],
                    ...incomingResume.technicalSkills,
                },
                voluntering: {
                    name: 'Voluntering',
                    value: [],
                    ...incomingResume.voluntering,
                },
                softSkills: {
                    name: 'Soft Skills',
                    value: [],
                    ...incomingResume.softSkills,
                },
                references: {
                    name: 'References',
                    value: [],
                    ...incomingResume.references,
                },
                template: templateData,
            };
        },
    },
});

export const {
    setResume,
    setBasicDetail,
    setSummary,
    setObjective,
    setExperience,
    setEducation,
    setAwards,
    setLanguages,
    setTechnicalSkills,
    setVoluntering,
    setSoftSkills,
    setReferences,
    setTemplate,
    setSetting,
    changeTemplate,
    resetApplicant,
} = applicantSlice.actions;

export default applicantSlice.reducer;
