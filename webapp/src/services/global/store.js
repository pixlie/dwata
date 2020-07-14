import create from "zustand";

const initialState = {
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

/*
case TOGGLE_PINNED_RECORDS:
  return {
    showPinnedRecords: !state.showPinnedRecords,
  };

case CLOSE_ALL_MODALS:
  return {
    ...allModalsClosedState,
  };
*/

const [useStore] = create((set) => ({
  ...initialState,

  toggleSidebar: () =>
    set((state) => ({
      isSidebarVisible: !state.isSidebarVisible,
    })),

  toggleFilterEditor: () =>
    set((state) => ({
      ...allModalsClosedState,
      isFEVisible: !state.isFEVisible,
    })),

  toggleColumnSelector: () =>
    set((state) => ({
      ...allModalsClosedState,
      isCSVisible: !state.isCSVisible,
    })),

  toggleOrderEditor: () =>
    set((state) => ({
      ...allModalsClosedState,
      isOEVisible: !state.isOEVisible,
    })),

  toggleActions: () =>
    set((state) => ({
      ...allModalsClosedState,
      isActionsVisible: !state.isActionsVisible,
    })),

  showNotesFor: (identifier) =>
    set((state) => ({
      ...allModalsClosedState,
      showNotesFor: state.showNotesFor === null ? identifier : null,
    })),
}));

export default useStore;
