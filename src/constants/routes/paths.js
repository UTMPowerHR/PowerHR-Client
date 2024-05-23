const PATHS = {
    HOME: '/',
    AUTH: {
        LOGIN: '/login',
        REGISTER: '/register',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password',
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
            EDIT: function (id) {
                return `/admin/employee/${id}/edit`;
            },
        },
    },
    FORM: {
        INDEX: '/form',
        EDIT: function (id) {
            return `/form/${id}/edit`;
        },
        LIST: '/form/list',
        ANSWER: function (id) {
            return `/form/${id}/answer`;
        },
        PREVIEW: function (id) {
            return `/form/${id}/preview`;
        },
        FEEDBACK: function (id) {
            return `/form/${id}/feedback`;
        },
    },
    JOB: {
        INDEX: '/job',
        CREATE: '/job/create',
        EDIT: function (id) {
            return `/job/${id}/edit`;
        },
        POSTING: function (id) {
            return `/job/${id}`;
        },
        LIST: '/job/list',
        FILTER: '/job/filter',
    },
};

export default PATHS;
