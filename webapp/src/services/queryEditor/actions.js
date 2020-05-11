import { fetchData } from "services/browser/actions";
import {
  ADD_ORDER, CHANGE_ORDER, TOGGLE_ORDER, TOGGLE_QUERY_EDITOR,
  NEXT_PAGE,
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


export const toggleOrderBy = columnName => ({
  type: TOGGLE_ORDER,
  columnName,
});


export const toggleQueryEditor = () => dispatch => dispatch({
  type: TOGGLE_QUERY_EDITOR,
});


export const nextPage = () => dispatch => {
  dispatch({
    type: NEXT_PAGE,
  });

  dispatch(fetchData());
}