// Use this env var to point to the backend API for postbuild
const host = process.env.REACT_APP_API_HOST || 'http://127.0.0.1:12121';

export const apiRoot = `${host}/api`;

export const sourceURL = `${apiRoot}/source`;
export const schemanURL = `${apiRoot}/schema`;
export const dataURL = `${apiRoot}/data`;