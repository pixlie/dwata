import axios, { AxiosResponse } from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_ROOT || "/api",
});

// Timeout in 3 seconds by default
apiClient.defaults.timeout = 3000;

function handle2xxResponse(response: AxiosResponse<any>): AxiosResponse<any> {
  return response;
}

apiClient.interceptors.response.use(handle2xxResponse);

export default apiClient;
