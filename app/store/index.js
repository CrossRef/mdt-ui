import { createHistory } from 'history'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'

import rootReducer from '../reducers'
import remoteSync from '../middleware/remote-sync'

export let exposedStore = {}

export default function configure () {
  const create = window.devToolsExtension
    ? window.devToolsExtension({maxAge: 100})(createStore)
    : createStore


  const createStoreWithMiddleware = applyMiddleware(
    thunk,
    routerMiddleware(),
    remoteSync
  )(create)

  const store = createStoreWithMiddleware(rootReducer)

  exposedStore = store
  return store
}
