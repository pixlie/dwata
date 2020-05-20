import { TOGGLE_SIDEBAR, TOGGLE_FILTER_EDITOR } from './actionTypes';


export const toggleSidebar = () => dispatch => dispatch({
  type: TOGGLE_SIDEBAR,
});


export const toggleFilterEditor = () => dispatch => dispatch({
  type: TOGGLE_FILTER_EDITOR,
});