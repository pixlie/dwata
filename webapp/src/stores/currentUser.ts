import create from "zustand";

import apiClient from "utils/apiClient";

interface ICurrentUserStore {
  isAuthenticatied: boolean;
  isFetching: boolean;
  fetchError?: object;
  user?: object;

  fetchCurrentUser: () => void;
}

const useCurrentUser = create<ICurrentUserStore>((set) => ({
  isAuthenticatied: false,
  isFetching: false,

  fetchCurrentUser: async function () {
    try {
      const response = await apiClient.get("/api/auth/me");
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useCurrentUser;
