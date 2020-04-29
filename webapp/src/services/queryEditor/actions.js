import axios from "axios";

import { ADD_ORDER, CHANGE_ORDER, TOGGLE_ORDER } from "./actionTypes";


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