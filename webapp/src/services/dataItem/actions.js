import axios from "axios";

import { dataItemURL } from "services/urls";
import { getItemPartsFromPath } from "utils";
import { INITIATE_FETCH_ITEM, COMPLETE_FETCH_ITEM, LOAD_ITEM_FROM_CACHE } from "./actionTypes";



export const fetchDataItem = callback => (dispatch, getState) => {
  const state = getState();
  const {params: {sourceId, tableName, pk}} = getItemPartsFromPath(state.router.location.pathname);

  dispatch({
    type: INITIATE_FETCH_ITEM,
    sourceId,
    tableName,
    pk,
  });

  return axios
    .get(`${dataItemURL}/${sourceId}/${tableName}/${pk}`)
    .then(res => {
      if (!!callback) {
        callback();
      }

      dispatch({
        type: COMPLETE_FETCH_ITEM,
        payload: res.data,
        sourceId,
        tableName,
        pk,
      });
    })
    .catch(err => {
      console.log("Could not fetch sources. Try again later.");
      console.log(err);
    });
};