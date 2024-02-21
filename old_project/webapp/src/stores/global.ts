import create from "zustand";

import apiClient from "utils/apiClient";
import { settingsRootURL } from "services/urls";
import axios from "axios";

/**
 * The Global store has information regarding the overall functioning of dwata, like what are the authentication
 * mechanisms available (set in the backend), databases or sources available (set in the backend).
 */
interface IGlobalStore {
  hasSettingsError: boolean;
  dwataRootSettings?: object;

  isFetching: boolean;

  initiate: () => void;
}

const useGlobal = create<IGlobalStore>((set, get) => ({
  hasSettingsError: false,
  isFetching: false,

  initiate: async function () {
    if (get().isFetching) {
      return;
    }

    set((state) => ({
      ...state,
      isFetching: true,
    }));

    try {
      const response = await apiClient.get(`${settingsRootURL}/dwata`);
      set((state) => ({
        ...state,
        isFetching: false,
        hasSettingsError: false,
        dwataRootSettings: response.data,
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 400 || error.response.status === 500) {
            set((state) => ({
              isFetching: false,
              hasSettingsError: true,
            }));
          }
        }
      }
    }
  },
}));

export default useGlobal;
