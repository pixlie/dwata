import { fetchData } from "services/browser/actions";
import {
  ADD_ORDER, CHANGE_ORDER, TOGGLE_ORDER,
  TOGGLE_FILTER_EDITOR, TOGGLE_COLUMN_SELECTOR_UI, TOGGLE_SORT_EDITOR,
  NEXT_PAGE, PREVIOUS_PAGE, GOTO_PAGE, TOGGLE_COLUMN_SELECTION,
} from "./actionTypes";


export const addOrderBy = (columnName) => ({
  type: ADD_ORDER,
  columnName,
});


export const changeOrderBy = (columnName, orderType) => ({
  type: CHANGE_ORDER,
  columnName,
  orderType,
});


export const toggleOrderBy = columnName => dispatch => {
  // This method is triggerd from table head and it instantly loads new data
  dispatch({
    type: TOGGLE_ORDER,
    columnName,
  });

  dispatch(fetchData());
}


export const toggleFilterEditor = () => dispatch => dispatch({
  type: TOGGLE_FILTER_EDITOR,
});


export const toggleColumnSelector = () => dispatch => dispatch({
  type: TOGGLE_COLUMN_SELECTOR_UI,
});


export const toggleSortEditor = () => dispatch => dispatch({
  type: TOGGLE_SORT_EDITOR,
});


export const nextPage = () => dispatch => {
  dispatch({
    type: NEXT_PAGE,
  });

  dispatch(fetchData());
}


export const previousPage = () => dispatch => {
  dispatch({
    type: PREVIOUS_PAGE,
  });

  dispatch(fetchData());
}


export const gotoPage = pageNum => dispatch => {
  dispatch({
    type: GOTO_PAGE,
    pageNum,
  });

  dispatch(fetchData());
}


export const toggleColumnSelection = columnName => dispatch => dispatch({
  type: TOGGLE_COLUMN_SELECTION,
  columnName,
});