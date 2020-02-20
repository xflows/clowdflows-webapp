export const DOMAIN =       typeof process.env.API.domain == 'undefined' ? '127.0.0.1:8000' : process.env.API.domain;
export const BASE_URL =     typeof process.env.API.baseUrl == 'undefined' ? 'http://' + DOMAIN : process.env.API.baseUrl;
export const API_ENDPOINT = typeof process.env.API.apiEndpoint == 'undefined' ? BASE_URL + '/api/' : process.env.API.apiEndpoint;
