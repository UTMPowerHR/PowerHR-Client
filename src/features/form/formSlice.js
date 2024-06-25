import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    forms: [],
    form: {
        questions: [],
    },
    deleteQuestions: [],
    currentQuestion: null,
    saved: true,
    feedback: {
        responses: [],
    },
    feedbacks: [],
};

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setForms: (state, action) => {
            state.forms = action.payload;
        },
        addForm: (state, action) => {
            state.forms.push(action.payload);
        },
        deleteForm: (state, action) => {
            state.forms = state.forms.filter((form) => form._id !== action.payload);
        },
        setForm: (state, action) => {
            state.form = action.payload;
            state.deleteQuestions = [];
            state.saved = true;
        },
        setSetting: (state, action) => {
            state.form = action.payload;
            state.saved = false;
        },
        setQuestions: (state, action) => {
            state.form.questions = action.payload;
            state.saved = false;
        },
        setQuestion: (state, action) => {
            state.form.questions = state.form.questions.map((question) => {
                if (question._id === action.payload._id) {
                    action.payload.snapshot = { ...action.payload.snapshot, modify: true };
                    return action.payload;
                } else {
                    return question;
                }
            });
            state.saved = false;
        },
        setQuestionSetting: (state, action) => {
            state.form.questions = state.form.questions.map((question) => {
                if (question._id === action.payload._id) {
                    action.payload.snapshot = { ...action.payload.snapshot, setting: true };
                    return action.payload;
                } else {
                    return question;
                }
            });

            if (action.payload.required === false) {
                state.form.setting.requiredAll = false;
            }

            state.saved = false;
        },
        setCurrentQuestion: (state, action) => {
            state.currentQuestion = action.payload;
        },
        addQuestion: (state) => {
            const newQuestion = {
                _id: 'new' + crypto.randomUUID(),
                questionText: 'Untitled Question ' + (state.form.questions.length + 1),
                questionType: 'Multiple Choice',
                required: state.form.requiredAll,
                options: [
                    {
                        _id: 'new' + crypto.randomUUID(),
                        optionText: 'Option 1',
                    },
                ],
                snapshot: {
                    new: true,
                    modify: false,
                    setting: false,
                    delete: false,
                    feedback: false,
                },
            };

            state.form.questions.push(newQuestion);
            state.currentQuestion = newQuestion._id;
            state.saved = false;
        },
        deleteQuestion: (state, action) => {
            const question = state.form.questions.find((question) => question._id === action.payload);
            state.form.questions = state.form.questions.filter((question) => question._id !== action.payload);

            if (question.snapshot.new === false) {
                question.snapshot.delete = true;
                state.deleteQuestions.push(question);
            }
            state.saved = false;
        },
        addOption: (state, action) => {
            state.form.questions = state.form.questions.map((question) => {
                if (question._id === action.payload.questionId) {
                    question.options.push(action.payload.option);
                    question.snapshot.modify = true;
                    return question;
                } else {
                    return question;
                }
            });
            state.saved = false;
        },
        setOption: (state, action) => {
            state.form.questions = state.form.questions.map((question) => {
                if (question._id === action.payload.questionId) {
                    question.options = question.options.map((option) => {
                        if (option._id === action.payload.option._id) {
                            return action.payload.option;
                        } else {
                            return option;
                        }
                    });
                    question.snapshot.modify = true;
                    return question;
                } else {
                    return question;
                }
            });
            state.saved = false;
        },
        deleteOption: (state, action) => {
            state.form.questions = state.form.questions.map((question) => {
                if (question._id === action.payload.questionId) {
                    question.options = question.options.filter((option) => option._id !== action.payload.optionId);
                    question.snapshot.modify = true;
                    return question;
                } else {
                    return question;
                }
            });
            state.saved = false;
        },
        initializeFeedback(state, action) {
            state.feedback.formID = action.payload.formID;
            state.feedback.responses = action.payload.questions.map((question) => ({
                question: question._id,
                answers: [],
            }));
        },
        setAnswer(state, action) {
            const { index, answers } = action.payload;

            state.feedback.responses[index].answers = answers;
        },
        setFormAndFeedback(state, action) {
            state.feedbacks = action.payload.feedbacks;
        },
    },
});

export const {
    setForms,
    addForm,
    deleteForm,
    setForm,
    setSetting,
    setQuestions,
    setCurrentQuestion,
    setQuestion,
    addQuestion,
    deleteQuestion,
    setOption,
    addOption,
    deleteOption,
    setQuestionSetting,
    initializeFeedback,
    setAnswer,
    setFormAndFeedback,
} = formSlice.actions;

export default formSlice.reducer;
