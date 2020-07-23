import create from "zustand";

import * as globalConstants from "services/global/constants";

const [useQueryContext] = create((set) => ({
  main: {
    appType: globalConstants.APP_NAME_HOME,
  },

  setContext: (appName, context) =>
    set(() => ({
      [appName]: {
        ...context,
        key: appName,
      },
    })),

  toggleQueryUI: (appName) =>
    set((state) => ({
      [appName]: {
        ...state[appName],
        isQueryUIOpen: !state[appName].isQueryUIOpen,
      },
    })),
}));

export default useQueryContext;
