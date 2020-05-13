import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from "connected-react-router";

import createRootReducer from './reducers';
import history from "./history";


/**
 * We are using a connected React Router + Redux store.
 * Please refer to https://github.com/supasate/connected-react-router
 **/
export default initialState => {
  initialState =
    JSON.parse(window.localStorage.getItem("cache.redux.state")) || initialState;

  const store = createStore(
    createRootReducer(history), // root reducer with router state
    initialState,
    compose(
      applyMiddleware(
        thunk,
        routerMiddleware(history) // for dispatching history actions
      ),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );

  store.subscribe(() => {
    // const state = store.getState();
    const persist = {};

    window.localStorage.setItem("cache.redux.state", JSON.stringify(persist));
  });

  return store;
}