import axios from 'axios';

import { sourceURL } from '../urls';
import { INITIATE_FETCH_SOURCE, FETCH_SOURCE } from './actionTypes';


export const fetchSource = callback => dispatch => {
  dispatch({
    type: INITIATE_FETCH_SOURCE,
  });

  return axios
    .get(sourceURL)
    .then(res => {
      if (!!callback) {
        callback();
      }

      return dispatch({
        type: FETCH_SOURCE,
        payload: res.data,
      });
    })
    .catch(err => {
      console.log('Could not fetch sources. Try again later.');
    });
};