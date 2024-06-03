const PATHS = {
    HOME: '/',
    AUTH: {
        LOGIN: '/login',
        REGISTER: '/register',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password',
        ACTIVATE: '/activate',
    },
    COMPANY: {
        REGISTER: '/company/registration',
    },
    DASHBOARD: {
        INDEX: '/dashboard',
    },
    USER: {
        INDEX: '/user',
        PROFILE: '/user/profile',
        SETTING: '/user/setting',
    },
    ADMIN: {
        EMPLOYEE: {
            INDEX: '/admin/employee',
            ADD: '/admin/employee/add',
            EDIT: {
                PATH: '/admin/employee/:id/edit',
                URL: function (id) {
                    return `/admin/employee/${id}/edit`;
                },
            },
        },
    },
    FORM: {
        INDEX: '/form',
        EDIT: {
            PATH: '/form/:id/edit',
            URL: function (id) {
                return `/form/${id}/edit`;
            },
        },
        LIST: '/form/list',
        ANSWER: {
            PATH: '/form/:id/answer',
            URL: function (id) {
                return `/form/${id}/answer`;
            },
        },
        PREVIEW: {
            PATH: '/form/:id/preview',
            URL: function (id) {
                return `/form/${id}/preview`;
            },
        },
        FEEDBACK: {
            PATH: '/form/:id/feedback',
            URL: function (id) {
                return `/form/${id}/feedback`;
            },
        },
    },
    JOB: {
        INDEX: '/job',
        CREATE: '/job/create',
        EDIT: {
            PATH: '/job/:id/edit',
            URL: function (id) {
                return `/job/${id}/edit`;
            },
        },
        POSTING: {
            PATH: '/job/:id/posting',
            URL: function (id) {
                return `/job/${id}`;
            },
        },
        LIST: '/job/list',
        FILTER: '/job/filter',
    },
};

export default PATHS;
