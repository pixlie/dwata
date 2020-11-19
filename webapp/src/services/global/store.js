import create from "zustand";
import axios from "axios";

import { settingsRootURL } from "services/urls";
import { transformData } from "utils";

const initialState = {
  isSidebarVisible: false, // Is Sidebar modal On
  isNotesVisible: false,
  navigationButtonMeta: {},
  showProductGuideFor: null,
  currentUser: {
    isAuthenticated: false,
  },
  access: {
    isAuthenticationNeeded: false,
  },
  isOnline: true,
};

export default create((set) => ({
  ...initialState,

  toggleSidebar: () =>
    set((state) => ({
      isSidebarVisible: !state.isSidebarVisible,
    })),

  showNotes: () =>
    set((state) => ({
      isNotesVisible: !state.isNotesVisible,
    })),

  setNavigationButtonMeta: (name, meta) =>
    set((state) => ({
      navigationButtonMeta: {
        ...state.navigationButtonMeta,
        [name]: meta,
      },
    })),

  setActiveProductGuideFor: (guideFor) =>
    set({
      showProductGuideFor: guideFor,
    }),

  refreshCoreSettings: async () => {
    const response = await axios.get(`${settingsRootURL}/core`);
    const _data = response.data.rows.map((row) =>
      transformData(response.data.columns, row)
    );
    const toSet = {};
    for (const row of _data) {
      switch (row["label"]) {
        case "core/is_online": {
          toSet["isOnline"] = row["value"];
        }
      }
    }

    set((state) => ({
      ...state,
      ...toSet,
    }));
  },
}));
