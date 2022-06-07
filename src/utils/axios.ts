import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import https from 'https';

import { CHECK } from '../models/check.model';
import { RESPONSE_REPORT } from '../models/report.model';

const axiosInstance: AxiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig): AxiosRequestConfig => {
        config.headers = {
            'request-startTime': Date.now(),
        };
        return config;
    }
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        if (response.config.headers === undefined) {
            return response;
        }
        const start: number = response.config.headers[
            'request-startTime'
        ] as number;
        const end: number = Date.now();
        response.headers['request-duration'] = String((end - start) / 1000);
        return response;
    }
);

const getResponse = async (check: CHECK): Promise<RESPONSE_REPORT> => {
    const url = `${check.url}${check.path}`;
    let config: AxiosRequestConfig = {
        validateStatus: function (status) {
            return status >= 100 && status < 600; // default
        },
        timeout: (check.timeout ?? 5) * 1000,
        headers: {
            ...check.httpHeaders,
        },
        httpsAgent: new https.Agent({
            rejectUnauthorized: check.ignoreSSL,
        }),
    };
    if (check.authentication?.useAuthentication === true) {
        const { username, password } = check.authentication;
        if (username && password) {
            config = {
                ...config,
                auth: {
                    username: username,
                    password: password,
                },
            };
        }
    }
    const res: AxiosResponse = await axiosInstance.get(url, config);
    const status: number = res.status;
    const requestDuration = Number(res.headers['request-duration']);
    return {
        status: status,
        responseTime: requestDuration,
    };
};

export { getResponse };
