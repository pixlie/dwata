import create from "zustand";

const initialState = {
  mainApp: "home",
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

const toggleSidebar = (state) => ({
  ...state,
  isSidebarVisible: !state.isSidebarVisible,
});

const toggleColumnHeadSpecification = (state, columnName) => ({
  ...state,
  ...allModalsClosedState,
  activeColumnHeadSpecification:
    state.activeColumnHeadSpecification === null ||
    state.activeColumnHeadSpecification !== columnName
      ? columnName
      : null,
});

const toggleActions = (state) => ({
  ...state,
  ...allModalsClosedState,
  isActionsVisible: !state.isActionsVisible,
});

const showNotesFor = (state, identifier) => ({
  ...state,
  ...allModalsClosedState,
  showNotesFor: state.showNotesFor === null ? identifier : null,
});

const toggleFilterEditor = (state) => ({
  ...state,
  ...allModalsClosedState,
  isFEVisible: !state.isFEVisible,
});

const toggleColumnSelectorUI = (state) => ({
  ...state,
  ...allModalsClosedState,
  isCSVisible: !state.isCSVisible,
});

const toggleSortEditor = (state) => ({
  ...state,
  ...allModalsClosedState,
  isOEVisible: !state.isOEVisible,
});

// case TOGGLE_PINNED_RECORDS:
//   return {
//     ...state,
//     showPinnedRecords: !state.showPinnedRecords,
//   };

// case CLOSE_ALL_MODALS:
//   return {
//     ...state,
//     ...allModalsClosedState,
//   };

const [useStore] = create((set) => ({
  inner: {
    ...initialState,
  },

  toggleSidebar: () =>
    set((state) => ({
      inner: toggleSidebar(state.inner),
    })),
}));

export default useStore;
