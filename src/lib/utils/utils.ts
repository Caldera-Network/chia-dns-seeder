import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { v6 } from 'is-ip';
export function getCloudflareType(ip: string) {
    if (v6(ip)) return 'AAAA';
    return 'A';
}

/** Axios Request Handler */
export async function axiosRequest(
    config: AxiosRequestConfig
): Promise<AxiosResponse<any>> {
    const axiosResponse = await axios
        .request(config)
        .catch((error: AxiosError) => {
            // TODO: Handle record size limit exceeded error
            // Data: {"result":null,"success":false,"errors":[{"code":83011,"message":"Total record size limit exceeded."}],"messages":[]}
                console.error(
                    `${error.message}\nData: ${JSON.stringify(
                        error.response?.data
                    )}\n\nAxiosConfig:${JSON.stringify(
                        error.config,
                        undefined,
                        2
                    )}`
                );
        });
    return axiosResponse as AxiosResponse;
}
