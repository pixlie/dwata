import axios from "axios";

import { appURL, dataItemURL } from "services/urls";
import { getSourceFromPath } from "utils";
import { INITIATE_FETCH_ITEM, COMPLETE_FETCH_ITEM } from "services/dataItem/actionTypes";
import { fetchDataToCache } from "services/listCache/actions";
import { COMPLETE_FETCH_APP } from "./actionTypes";
import { getRecordPinAppConfig, getSavedQuerySpecificationAppConfig } from "./getters";


export const getApps = () => dispatch => {
  return axios
    .get(appURL)
    .then(res => {
      dispatch({
        type: COMPLETE_FETCH_APP,
        payload: res.data,
      });
    })
    .catch(err => {
      console.log("Could not fetch apps. Try again later.");
      console.log(err);
    });
};


export const fetchNote = () => (dispatch, getState) => {
  const state = getState();
  let path = null;
  try {
    const {params} = getSourceFromPath(state.router.location.pathname);
    path = btoa(`${params.sourceId}/${params.tableName}`);
  } catch (error) {
    return false;
  }
  const {isNoteAppEnabled, noteAppConfig} = state.apps;
  if (!isNoteAppEnabled || !noteAppConfig) {
    return false;
  }
  const {source_id: sourceId, table_name: tableName} = noteAppConfig;

  dispatch({
    type: INITIATE_FETCH_ITEM,
    sourceId,
    tableName,
    pk: path,
  });

  return axios
    .get(`${dataItemURL}/${sourceId}/${tableName}?path=${path}`)
    .then(res => {
      dispatch({
        type: COMPLETE_FETCH_ITEM,
        payload: res.data,
        sourceId,
        tableName,
        pk: path,
      });
    })
    .catch(err => {
      console.log("Could not fetch notes. Try again later.", err.response.status);
      if (err.response.status === 404) {
        dispatch({
          type: COMPLETE_FETCH_ITEM,
          payload: null,
          sourceId,
          tableName,
          pk: path,
          errorStatus: err.response.status,
        });
      }
    });
};


export const saveNote = (payload, pk, callback) => (dispatch, getState) => {
  const state = getState();
  let path = null;
  try {
    const {params} = getSourceFromPath(state.router.location.pathname);
    path = btoa(`${params.sourceId}/${params.tableName}`);
  } catch (error) {
    return false;
  }
  const {isNoteAppEnabled, noteAppConfig} = state.apps;
  if (!isNoteAppEnabled || !noteAppConfig) {
    return false;
  }
  const {source_id: sourceId, table_name: tableName} = noteAppConfig;
  const url = pk !== null ? `${dataItemURL}/${sourceId}/${tableName}/${pk}` : `${dataItemURL}/${sourceId}/${tableName}`;

  return axios({
    method: pk !== null ? "put" : "post",
    url,
    data: {
      path,
      ...payload,
    }
  })
    .then(res => {
      if (!!callback) {
        callback(res);
      }
    })
    .catch(err => {
      console.log("Could not fetch notes. Try again later.");
      console.log(err);
    });
};


export const pinRecords = () => (dispatch, getState) => {
  const state = getState();
  let path = null;
  try {
    const {params} = getSourceFromPath(state.router.location.pathname);
    path = btoa(`${params.sourceId}/${params.tableName}`);
  } catch (error) {
    return false;
  }
  const {selectedRowList} = state.browser;
  const {sourceId, tableName} = getRecordPinAppConfig(state);

  for (const rowId of selectedRowList) {
    axios
    .post(`${dataItemURL}/${sourceId}/${tableName}`, {
      path,
      record_id: rowId,
    });
  }
};


export const fetchPins = () => (dispatch, getState) => {
  const state = getState();
  const {sourceId, tableName, cacheKey} = getRecordPinAppConfig(state);

  dispatch(fetchDataToCache(
    sourceId,
    tableName,
    cacheKey, {
      columnsSelected: ["id", "path", "record_id"],
    }
  ));
};


export const saveQuerySpecification = (label, pk) => (dispatch, getState) => {
  const state = getState();
  const {columnsSelected, orderBy, filterBy, limit, offset} = state.querySpecification;
  const {sourceId, tableName} = getSavedQuerySpecificationAppConfig(state);
  const url = !!pk ? `${dataItemURL}/${sourceId}/${tableName}/${pk}` : `${dataItemURL}/${sourceId}/${tableName}`;

  try {
    const {params} = getSourceFromPath(state.router.location.pathname);
    return axios({
      method: !!pk ? "put" : "post",
      url,
      data: {
        label,
        source_id: params.sourceId,
        table_name: params.tableName,
        query_specification: {
          columns: columnsSelected.length > 0 ? columnsSelected : undefined,
          order_by: orderBy,
          filter_by: filterBy,
          limit,
          offset,
        }
      }
    })
      .then(res => {
      })
      .catch(err => {
        console.log(err);
      });
  
  } catch (error) {
    return false;
  }
};