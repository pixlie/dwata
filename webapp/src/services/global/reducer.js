import {
  TOGGLE_SIDEBAR, TOGGLE_COLUMN_HEAD_SPECIFICATION, SHOW_NOTES_FOR,
  COMPLETE_FETCH_APP, TOGGLE_ACTIONS, CLOSE_ALL_MODALS,
  TOGGLE_COLUMN_SELECTOR_UI, TOGGLE_FILTER_EDITOR, TOGGLE_SORT_EDITOR,
} from './actionTypes';
import { transformData } from "utils";


const initialState = {
  isSidebarOn: false,  // Is Sidebar modal On
  isActionsOn: false,  // Is Actions modal On
  isFEVisible: false,  // Is FilterEditor modal On
  isCSVisible: false,  // Is ColumnSeletor modal On
  isOEVisible: false,  // Is OrderEditor modal On

  activeColumnHeadSpecification: null,  // Which Table Column is selected to show ordering/filter options
  isNoteAppEnabled: false,  // Is the notes app enabled - as in it's backend is setup
  noteAppConfig: {},
  showNotesFor: null,  // Any path or identifier to tell the UI how to query notes from API; null means Notes modal is Off
};


const allModalsClosedState = {
  isSidebarOn: false,
  isActionsOn: false,
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
        isSidebarOn: !state.isSidebarOn,
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
        isActionsOn: !state.isActionsOn,
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
  
    case CLOSE_ALL_MODALS:
      return {
        ...state,
        ...allModalsClosedState,
      };

    case COMPLETE_FETCH_APP:
      for (const app of action.payload.rows.map(row => transformData(action.payload.columns, row))) {
        if (app.label === "note") {
          return {
            ...state,
            isNoteAppEnabled: true,
            noteAppConfig: app.config,
          };
        }
        // Todo: refactor the return to be outside the for loop
        return {
          ...state,
        };
      }
      break;

    default:
      return state;
  }
}