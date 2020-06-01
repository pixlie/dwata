import axios from "axios";

import { appURL, dataItemURL } from "services/urls";
import { getSourceFromPath } from "utils";
import { INITIATE_FETCH_ITEM, COMPLETE_FETCH_ITEM } from "services/dataItem/actionTypes";
import {
  TOGGLE_SIDEBAR, TOGGLE_COLUMN_HEAD_SPECIFICATION, SHOW_NOTES_FOR,
  COMPLETE_FETCH_APP, TOGGLE_ACTIONS, CLOSE_ALL_MODALS,
  TOGGLE_COLUMN_SELECTOR_UI, TOGGLE_FILTER_EDITOR, TOGGLE_SORT_EDITOR
} from './actionTypes';


export const toggleSidebar = () => dispatch => dispatch({
  type: TOGGLE_SIDEBAR,
});


export const toggleColumnHeadSpecification = columnName => dispatch => dispatch({
  type: TOGGLE_COLUMN_HEAD_SPECIFICATION,
  columnName,
});


export const showNotes = identifier => dispatch => dispatch({
  type: SHOW_NOTES_FOR,
  identifier,
});


export const toggleActions = () => dispatch => dispatch({
  type: TOGGLE_ACTIONS,
});


export const toggleFilterEditor = () => dispatch => dispatch({
  type: TOGGLE_FILTER_EDITOR,
});


export const toggleColumnSelector = () => dispatch => dispatch({
  type: TOGGLE_COLUMN_SELECTOR_UI,
});


export const toggleSortEditor = () => dispatch => dispatch({
  type: TOGGLE_SORT_EDITOR,
});


export const closeAllModals = () => dispatch => dispatch({
  type: CLOSE_ALL_MODALS,
});

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
  const {isNoteAppEnabled, noteAppConfig} = state.global;
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
  const {isNoteAppEnabled, noteAppConfig} = state.global;
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
        callback();
      }
    })
    .catch(err => {
      console.log("Could not fetch notes. Try again later.");
      console.log(err);
    });
};