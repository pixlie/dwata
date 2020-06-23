import { fetchData } from "services/browser/actions";
import {
  ADD_ORDER, CHANGE_ORDER, TOGGLE_ORDER,
  NEXT_PAGE, PREVIOUS_PAGE, GOTO_PAGE, TOGGLE_COLUMN_SELECTION,
  INITIATE_QUERY_FILTER, SET_QUERY_FILTER, REMOVE_QUERY_FILTER,
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


export const initiateFilter = (columnName, dataType) => dispatch => dispatch({
  type: INITIATE_QUERY_FILTER,
  columnName,
  dataType,
});


export const setFilter = (columnName, filters) => dispatch => dispatch({
  type: SET_QUERY_FILTER,
  columnName,
  filters,
});


export const removeFilter = columnName => dispatch => dispatch({
  type: REMOVE_QUERY_FILTER,
  columnName,
});