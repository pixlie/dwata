import axios from 'axios';

import { schemanURL } from '../urls';
import { INITIATE_FETCH_SCHEMA, FETCH_SCHEMA } from './actionTypes';


export const fetchSchema = (sourceId, callback) => dispatch => {
  dispatch({
    type: INITIATE_FETCH_SCHEMA,
    sourceId,
  });

  return axios
    .get(`${schemanURL}/${sourceId}`)
    .then(res => {
      if (!!callback) {
        callback();
      }

      return dispatch({
        type: FETCH_SCHEMA,
        sourceId,
        payload: res.data,
      });
    })
    .catch(err => {
      console.log('Could not fetch schema. Try again later.');
    });
};