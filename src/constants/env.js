const API = import.meta.env.VITE_API_URL;
const APPS_API = import.meta.env.VITE_APPS_API_URL || 'http://127.0.0.1:8000';

export const API_BASE_URL = API;
export const APPS_API_BASE_URL = APPS_API;

export { API, APPS_API };
