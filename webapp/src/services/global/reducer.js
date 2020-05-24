import {
  TOGGLE_SIDEBAR, TOGGLE_FILTER_EDITOR, TOGGLE_COLUMN_HEAD_SPECIFICATION, SHOW_NOTES_FOR,
} from './actionTypes';


const initialState = {
  isSidebarOn: false,
  isQueryEditorOpen: false,
  activeColumnHeadSpecification: null,
  showNotesFor: null,  // any path or identifier to tell the UI how to query notes from API
};


export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        isSidebarOn: !state.isSidebarOn,
      }

    case TOGGLE_FILTER_EDITOR:
      return {
        ...state,
        isQueryEditorOpen: !state.isQueryEditorOpen,
      }

    case TOGGLE_COLUMN_HEAD_SPECIFICATION:
      if (state.activeColumnHeadSpecification === action.columnName) {
        return {
          ...state,
          activeColumnHeadSpecification: null,
        };
      }
      return {
        ...state,
        activeColumnHeadSpecification: action.columnName,
      };

    case SHOW_NOTES_FOR:
      return {
        ...state,
        showNotesFor: action.identifier,
      };

    default:
      return state;
  }
}