import create from "zustand";

import * as constants from "./constants";

const initialState = {
  mainApp: constants.APP_NAME_HOME,
  isSidebarVisible: false, // Is Sidebar modal On
  isActionsVisible: false, // Is Actions modal On
  isFEVisible: false, // Is FilterEditor modal On
  isCSVisible: false, // Is ColumnSeletor modal On
  isOEVisible: false, // Is OrderEditor modal On
  activeColumnHeadSpecification: null, // Which Table Column is selected to show ordering/filter options
  showNotesFor: null, // Any path or identifier to tell the UI how to query notes from API; null means Notes modal is Off
  showPinnedRecords: false,
  isUnifiedQuerySpecification: true, // A view like Kanban may have multiple query specs, one per column, so no buttons on top nav
};

const allModalsClosedState = {
  isSidebarVisible: false,
  isActionsVisible: false,
  isFEVisible: false,
  isCSVisible: false,
  isOEVisible: false,
  activeColumnHeadSpecification: null,
  showNotesFor: null,
};

const toggleSidebar = (inner) => ({
  ...inner,
  isSidebarVisible: !inner.isSidebarVisible,
});

const toggleColumnHeadSpecification = (inner, columnName) => ({
  ...inner,
  ...allModalsClosedState,
  activeColumnHeadSpecification:
    inner.activeColumnHeadSpecification === null ||
    inner.activeColumnHeadSpecification !== columnName
      ? columnName
      : null,
});

const toggleActions = (inner) => ({
  ...inner,
  ...allModalsClosedState,
  isActionsVisible: !inner.isActionsVisible,
});

const showNotesFor = (inner, identifier) => ({
  ...inner,
  ...allModalsClosedState,
  showNotesFor: inner.showNotesFor === null ? identifier : null,
});

const toggleFilterEditor = (inner) => ({
  ...inner,
  ...allModalsClosedState,
  isFEVisible: !inner.isFEVisible,
});

const toggleColumnSelector = (inner) => ({
  ...inner,
  ...allModalsClosedState,
  isCSVisible: !inner.isCSVisible,
});

const toggleOrderEditor = (inner) => ({
  ...inner,
  ...allModalsClosedState,
  isOEVisible: !inner.isOEVisible,
});

// case TOGGLE_PINNED_RECORDS:
//   return {
//     ...inner,
//     showPinnedRecords: !inner.showPinnedRecords,
//   };

// case CLOSE_ALL_MODALS:
//   return {
//     ...inner,
//     ...allModalsClosedState,
//   };

const [useStore] = create((set) => ({
  inner: {
    ...initialState,
  },

  setMainApp: (appName) =>
    set((state) => ({
      inner: {
        ...state.inner,
        mainApp: appName,
      },
    })),

  toggleSidebar: () =>
    set((state) => ({
      inner: toggleSidebar(state.inner),
    })),

  toggleFilterEditor: () =>
    set((state) => ({
      inner: toggleFilterEditor(state.inner),
    })),

  toggleColumnSelector: () =>
    set((state) => ({
      inner: toggleColumnSelector(state.inner),
    })),

  toggleOrderEditor: () =>
    set((state) => ({
      inner: toggleOrderEditor(state.inner),
    })),
}));

export default useStore;
