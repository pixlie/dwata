import axios from "axios";

import { dataItemURL } from "services/urls";
import { getItemPartsFromPath } from "utils";
import { INITIATE_FETCH_ITEM, COMPLETE_FETCH_ITEM } from "./actionTypes";



export const fetchDataItem = customPath => (dispatch, getState) => {
  const state = getState();
  let sourceId = null,
    tableName = null,
    pk = null;
  try {
    const {params} = getItemPartsFromPath(!!customPath ? customPath : state.router.location.pathname);
    ({sourceId, tableName, pk} = params);
  } catch (error) {
    return false;
  }

  dispatch({
    type: INITIATE_FETCH_ITEM,
    sourceId,
    tableName,
    pk,
  });

  return axios
    .get(`${dataItemURL}/${sourceId}/${tableName}/${pk}`)
    .then(res => {
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