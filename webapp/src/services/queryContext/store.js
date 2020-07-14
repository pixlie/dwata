import create from "zustand";

import * as globalConstants from "services/global/constants";

const [useQueryContext] = create((set) => ({
  main: {
    appType: globalConstants.APP_NAME_HOME,
  },

  setContext: (appName, context) =>
    set((state) => ({
      ...state,
      [appName]: {
        ...context,
        key: appName,
      },
    })),

  mergeContext: (appName, context) =>
    set((state) => ({
      ...state,
      [appName]: {
        ...state[appName],
        ...context,
      },
    })),
}));

export default useQueryContext;
