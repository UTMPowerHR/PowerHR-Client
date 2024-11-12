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
        PROFILE: '/company/profile',
        MANAGE: {
            INDEX: '/company/manage',
            EMPLOYEES: '/company/manage/employees',
            DEPARTMENTS: '/company/manage/departments',
        },

        FIREEMPLOYEE: '/company/fireemployee',
        REHIRE: '/company/rehire',
        DOCUMENTLIST: '/company/transferknowledge/:employeeId',
        TERMINATE: '/company/terminate',

    },
    DASHBOARD: {
        INDEX: '/dashboard',
    },
    USER: {
        INDEX: '/user',
        PROFILE: '/user/profile',
        SETTING: '/user/setting',
    },
    EMPLOYEE: {
        INDEX: '/employee',
        ADD: '/employee/add',
        EDIT: {
            PATH: '/employee/:id/edit',
            URL: function (id) {
                return `/employee/${id}/edit`;
            },
        },
        PROFILE: '/employee/profile',
    },
    FORM: {
        INDEX: '/form',
        EDIT: {
            PATH: '/form/:id',
            URL: function (id) {
                return `/form/${id}`;
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
        PUBLISH: '/form/publish',
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
                return `/job/${id}/posting`;
            },
        },
        LIST: '/job/list',
        FILTER: '/job/filter',
        EXAMPLE: '/job/example',
        TRANSFER_DOCUMENT: '/job/transferdocument',
    },
    APPLICATION: {
        MANAGE: {
            PATH: '/application/:id',
            URL: function (id) {
                return `/application/${id}`;
            },
        },
        HISTORY: '/application/history',
    },
    MONITOR: {
        INDEX: '/monitor',
    },
    ANALYTIC: {
        TURNOVER: '/analytic/turnover',
    },
};

export default PATHS;
