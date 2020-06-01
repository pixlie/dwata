import {
  TOGGLE_SIDEBAR, TOGGLE_COLUMN_HEAD_SPECIFICATION, SHOW_NOTES_FOR,
  TOGGLE_ACTIONS, CLOSE_ALL_MODALS,
  TOGGLE_COLUMN_SELECTOR_UI, TOGGLE_FILTER_EDITOR, TOGGLE_SORT_EDITOR
} from './actionTypes';


export const toggleSidebar = () => dispatch => dispatch({
  type: TOGGLE_SIDEBAR,
});


export const toggleColumnHeadSpecification = columnName => dispatch => dispatch({
  type: TOGGLE_COLUMN_HEAD_SPECIFICATION,
  columnName,
});


export const showNotes = identifier => dispatch => dispatch({
  type: SHOW_NOTES_FOR,
  identifier,
});


export const toggleActions = () => dispatch => dispatch({
  type: TOGGLE_ACTIONS,
});


export const toggleFilterEditor = () => dispatch => dispatch({
  type: TOGGLE_FILTER_EDITOR,
});


export const toggleColumnSelector = () => dispatch => dispatch({
  type: TOGGLE_COLUMN_SELECTOR_UI,
});


export const toggleSortEditor = () => dispatch => dispatch({
  type: TOGGLE_SORT_EDITOR,
});


export const closeAllModals = () => dispatch => dispatch({
  type: CLOSE_ALL_MODALS,
});