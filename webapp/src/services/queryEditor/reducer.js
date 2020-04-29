import { ADD_ORDER, CHANGE_ORDER, TOGGLE_ORDER } from "./actionTypes";
import { transformData } from "utils";


const initialState = {
  orderBy: {},
};


export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
}