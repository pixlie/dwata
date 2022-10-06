import create from "zustand";

import apiClient from "utils/apiClient";
import { settingsRootURL } from "services/urls";

/**
 * The Global store has information regarding the overall functioning of dwata, like what are the authentication
 * mechanisms available (set in the backend), databases or sources available (set in the backend).
 */
interface IGlobalStore {
  isFetching: boolean;
  isReacy: boolean;

  fetchGlobalSettings: () => void;
}

const useGlobal = create<IGlobalStore>((set, get) => ({
  isFetching: false,
  isReacy: false,

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
}));

export default useGlobal;
