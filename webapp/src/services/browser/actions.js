import axios from "axios";

import { INITIATE_FETCH_DATA, FETCH_DATA } from "./actionTypes";
import { dataURL } from "services/urls";


export const fetchData = (sourceId, tableName, payload, callback) => dispatch => {
  dispatch({
    type: INITIATE_FETCH_DATA,
  });

  return axios
    .post(`${dataURL}/${sourceId}/${tableName}`, payload)
    .then(res => {
      if (!!callback) {
        callback();
      }

      return dispatch({
        type: FETCH_DATA,
        payload: res.data,
      });
    })
    .catch(err => {
      console.log('Could not fetch sources. Try again later.');
    });
};