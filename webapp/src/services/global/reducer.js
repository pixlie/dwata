import {
  TOGGLE_SIDEBAR, TOGGLE_COLUMN_HEAD_SPECIFICATION, SHOW_NOTES_FOR,
  TOGGLE_ACTIONS, TOGGLE_PINNED_RECORDS, CLOSE_ALL_MODALS,
  TOGGLE_COLUMN_SELECTOR_UI, TOGGLE_FILTER_EDITOR, TOGGLE_SORT_EDITOR,
} from './actionTypes';


const initialState = {
  isSidebarVisible: false,  // Is Sidebar modal On
  isActionsVisible: false,  // Is Actions modal On
  isFEVisible: false,  // Is FilterEditor modal On
  isCSVisible: false,  // Is ColumnSeletor modal On
  isOEVisible: false,  // Is OrderEditor modal On
  activeColumnHeadSpecification: null,  // Which Table Column is selected to show ordering/filter options
  showNotesFor: null,  // Any path or identifier to tell the UI how to query notes from API; null means Notes modal is Off
  showPinnedRecords: false,
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


export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        isSidebarVisible: !state.isSidebarVisible,
      }

    case TOGGLE_COLUMN_HEAD_SPECIFICATION:
      return {
        ...state,
        ...allModalsClosedState,
        activeColumnHeadSpecification:
          (state.activeColumnHeadSpecification === null || state.activeColumnHeadSpecification !== action.columnName)
            ? action.columnName : null,
      };

    case TOGGLE_ACTIONS:
      return {
        ...state,
        ...allModalsClosedState,
        isActionsVisible: !state.isActionsVisible,
      };

    case SHOW_NOTES_FOR:
      return {
        ...state,
        ...allModalsClosedState,
        showNotesFor: state.showNotesFor === null ? action.identifier : null,
      };
  
    case TOGGLE_FILTER_EDITOR:
      return {
        ...state,
        ...allModalsClosedState,
        isFEVisible: !state.isFEVisible,
      };

    case TOGGLE_COLUMN_SELECTOR_UI:
      return {
        ...state,
        ...allModalsClosedState,
        isCSVisible: !state.isCSVisible,
      };

    case TOGGLE_SORT_EDITOR:
      return {
        ...state,
        ...allModalsClosedState,
        isOEVisible: !state.isOEVisible,
      };
  
    case TOGGLE_PINNED_RECORDS:
      console.log(state.showPinnedRecords);
      return {
        ...state,
        showPinnedRecords: !state.showPinnedRecords,
      };

      case CLOSE_ALL_MODALS:
      return {
        ...state,
        ...allModalsClosedState,
      };

    default:
      return state;
  }
}