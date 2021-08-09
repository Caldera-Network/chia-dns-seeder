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
            if (error.response?.status !== 409) {
                throw new Error(
                    `${error.message}\nData: ${JSON.stringify(
                        error.response?.data
                    )}\n\nAxiosConfig:${JSON.stringify(
                        error.config,
                        undefined,
                        2
                    )}`
                );
            }
        });
    return axiosResponse as AxiosResponse;
}
