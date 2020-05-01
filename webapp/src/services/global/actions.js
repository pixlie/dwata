import { TOGGLE_SIDEBAR, TOGGLE_QUERY_EDITOR } from './actionTypes';


export const toggleSidebar = () => dispatch => dispatch({
  type: TOGGLE_SIDEBAR,
});


export const toggleQueryEditor = () => dispatch => dispatch({
  type: TOGGLE_QUERY_EDITOR,
});