import { TOGGLE_SIDEBAR, TOGGLE_FILTER_EDITOR, TOGGLE_COLUMN_HEAD_SPECIFICATION } from './actionTypes';


export const toggleSidebar = () => dispatch => dispatch({
  type: TOGGLE_SIDEBAR,
});


export const toggleFilterEditor = () => dispatch => dispatch({
  type: TOGGLE_FILTER_EDITOR,
});


export const toggleColumnHeadSpecification = columnName => dispatch => dispatch({
  type: TOGGLE_COLUMN_HEAD_SPECIFICATION,
  columnName,
});