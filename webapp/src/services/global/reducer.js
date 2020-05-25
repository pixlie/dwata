import {
  TOGGLE_SIDEBAR, TOGGLE_FILTER_EDITOR, TOGGLE_COLUMN_HEAD_SPECIFICATION, SHOW_NOTES_FOR,
  COMPLETE_FETCH_CAPABILITY
} from './actionTypes';
import { transformData } from "utils";


const initialState = {
  isSidebarOn: false,
  isQueryEditorOpen: false,
  activeColumnHeadSpecification: null,
  hasNotesCapability: false,
  notesCapability: {},
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

    case COMPLETE_FETCH_CAPABILITY:
      for (const capability of action.payload.rows.map(row => transformData(action.payload.columns, row))) {
        if (capability.label === "notes") {
          return {
            ...state,
            hasNotesCapability: true,
            notesCapability: capability.properties,
          };
        }
        return {
          ...state,
        };
      }

    default:
      return state;
  }
}