import create from "zustand";

import apiClient from "utils/apiClient";
import { settingsRootURL } from "services/urls";

interface IUser {
  emailAddress: string;
}

/**
 * The Global store has information regarding the overall functioning of dwata, like what are the authentication
 * mechanisms available (set in the backend), databases or sources available (set in the backend).
 */
interface IGlobalStore {
  setupIsIncompleteError: boolean;
  isAuthenticated: boolean;
  currentUser?: IUser;

  isFetching: boolean;
  isReady: boolean;

  initiate: () => void;
  fetchGlobalSettings: () => void;
  setAuthentication: (isAuthenticated: boolean, emailAddress: IUser) => void;
}

const useGlobal = create<IGlobalStore>((set, get) => ({
  setupIsIncompleteError: false,
  isAuthenticated: false,
  isFetching: false,
  isReady: false,

  initiate: function () {
    const accessToken = window.localStorage.getItem("accessToken");
    if (!!accessToken) {
      set((state) => ({
        ...state,
        isReady: true,
        isAuthenticated: true,
      }));
    }
  },

  fetchGlobalSettings: async function () {
    if (get().isFetching) {
      return;
    }

    set((state) => ({
      ...state,
      isFetching: true,
    }));

    try {
      const response = await apiClient.get(settingsRootURL);
      set((state) => ({
        ...state,
        isFetching: false,
      }));
    } catch (err) {
      console.log("Could not fetch sources. Try again later.");
    }
  },

  setAuthentication: function (isAuthenticated, user) {
    set((state) => ({
      ...state,
      isAuthenticated: isAuthenticated,
      currentUser: user,
    }));
  },
}));

export default useGlobal;
