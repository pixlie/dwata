import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import useGlobal from "stores/global";

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_HOST_PROTOCOL}${process.env.REACT_APP_API_HOST}\:${process.env.REACT_APP_API_PORT}${process.env.REACT_APP_API_ROOT}`,
});

// Timeout in 3 seconds by default
apiClient.defaults.timeout = 3000;

async function preRequest(config: AxiosRequestConfig) {
  const accessToken = window.localStorage.getItem("accessToken");
  Object.assign(config.headers, {
    Authorization: `Bearer ${accessToken}`,
  });
  return config;
}

function handle2xxResponse(response: AxiosResponse<any>): AxiosResponse<any> {
  return response;
}
function handleErrorResponse(error: any) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 403) {
      // User is not authenticated
      useGlobal.setState((state) => ({
        ...state,
        isAuthenticated: true,
      }));
      console.log("User is not authenticated");
    }
  }
  return Promise.reject(error);
}

apiClient.interceptors.request.use(preRequest, (error: AxiosError) =>
  Promise.reject(error)
);
apiClient.interceptors.response.use(handle2xxResponse, handleErrorResponse);

export default apiClient;
