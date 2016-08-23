export const DOMAIN =       process.env.API.domain      || '127.0.0.1:8000';
export const BASE_URL =     process.env.API.baseUrl     || 'http://' + DOMAIN;
export const API_ENDPOINT = process.env.API.apiEndpoint || BASE_URL + '/api/';
