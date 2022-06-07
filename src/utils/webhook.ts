import axios, { AxiosRequestConfig } from 'axios';

const sendNotification = (
    webhookUrl: string,
    webhookConfig: object | undefined,
    messageField: string | undefined,
    webhookMessage: string | undefined
): void => {
    const config: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const payload = {
        ...webhookConfig,
        ...(messageField && { [messageField]: webhookMessage }),
    };
    axios.post(webhookUrl, payload, config);
};

export { sendNotification };
