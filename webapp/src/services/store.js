import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';


export default initialState => {
  initialState =
    JSON.parse(window.localStorage.getItem("cache.redux.state")) || initialState;

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(
        thunk
      )
      /* window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__() */
    )
  );

  store.subscribe(() => {
    // const state = store.getState();
    const persist = {};

    window.localStorage.setItem("cache.redux.state", JSON.stringify(persist));
  });

  return store;
}