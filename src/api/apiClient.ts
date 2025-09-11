import { message as Message } from 'antd';
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

import { t } from '@/locales/i18n';
import userStore from '@/store/userStore';

import { Result } from '#/api';
import { ResultEnum } from '#/enum';

const pendingRequests = new Map();


const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_APP_BASE_API,
  baseURL: '/api',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
  // withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    // @ts-ignore
    const token = JSON.parse(localStorage.getItem('token'));
    
    if (token)
      config.headers.Authorization = `Bearer ${token}`;
    if (config?.data?.cancelToken) {
      const links = config.url?.split("?") ?? [""]
      const requestKey = `${config.method}-${links[0]}`;
      if (pendingRequests.has(requestKey)) {
        const cancel = pendingRequests.get(requestKey);
        cancel();
      }

      config.cancelToken = new axios.CancelToken((cancel) => {
        pendingRequests.set(requestKey, cancel);
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

var isRefreshToken = false;
// const handleRefreshToken = async () => {
//   if (isRefreshToken) return await waitRefreshToken();
//   isRefreshToken = true;
//   // var res = await axios.post(import.meta.env.VITE_APP_BASE_API + '/auth/refresh-token', { refreshToken: JSON.parse(localStorage['token'])?.refreshToken });
//   // localStorage.setItem('token', JSON.stringify(res?.data?.data));
//   isRefreshToken = false;
// }

const waitRefreshToken = async () => {
  if (!isRefreshToken) return
  await delay(500);
  return await waitRefreshToken();
}
function removePendingRequest(config: any) {
  const requestKey = `${config.method}-${config.url}`;
  if (pendingRequests.has(requestKey)) {
    pendingRequests.delete(requestKey);
  }
}

// axiosInstance.interceptors.response.use(
//   (res: AxiosResponse<Result>) => {
//     removePendingRequest(res.config);
//     if (!res.data) throw new Error(t('sys.api.apiRequestFailed'));

//     const { status, data } = res.data;
//     const hasSuccess = data && Reflect.has(res.data, 'status') && status === ResultEnum.SUCCESS;
//     if (hasSuccess) {
//       return data;
//     }

//     // throw new Error(message || t('sys.api.apiRequestFailed'));
//   },
//   async (error: AxiosError<Result>) => {
//     const { response, message } = error || {};

//     const errMsg = response?.data?.message || message || t('sys.api.errorMessage');
//     console.log(errMsg);
//     const status = response?.status;
//     if (status === 401) {
//       userStore.getState().actions.clearUserInfoAndToken();
//     }
//     if (status === 403) {
//       // await handleRefreshToken();
//       // const config = error.config;
//       // // @ts-ignore
//       // config.headers.Authorization = `Bearer ${JSON.parse(localStorage['token'])?.accessToken}`;
//       // @ts-ignore
//       // return await axiosInstance.request(config);
//     }
//     if (errMsg != "canceled" && !error?.config?.params?.ignoreError) {
//       Message.error(errMsg);
//     }
//     return Promise.reject(errMsg);
//   },
// );

axiosInstance.interceptors.response.use(
  (res: AxiosResponse<Result>) => {
    console.log(res);
    
    removePendingRequest(res.config);
    if (!res.data) throw new Error(t('sys.api.apiRequestFailed'));
    const { data, success } = res.data;
    const hasSuccess = data && success && Reflect.has(res, 'status') && res.status === ResultEnum.SUCCESS;
    if (hasSuccess) {
      return data;
    }
    // throw new Error(message || t('sys.api.apiRequestFailed'));
  },
  async (error: AxiosError<Result>) => {
    const { response, message } = error || {};

    const errMsg = response?.data?.message || message || t('sys.api.errorMessage');
    console.log(errMsg);
    const status = response?.status;
    if (status === 401) {
      userStore.getState().actions.clearUserInfoAndToken();
    }
    if (status === 403) {
      // await handleRefreshToken();
      // const config = error.config;
      // // @ts-ignore
      // config.headers.Authorization = `Bearer ${JSON.parse(localStorage['token'])?.accessToken}`;
      // @ts-ignore
      // return await axiosInstance.request(config);
    }
    if (errMsg != "canceled" && !error?.config?.params?.ignoreError) {
      Message.error(errMsg);
    }
    return Promise.reject(errMsg);
  },
);


class APIClient {
  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PUT' });
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      axiosInstance
        .request<any, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          reject(e);
        });
    });
  }
}

export default new APIClient();
