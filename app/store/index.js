import { createStore, applyMiddleware } from 'redux'
import { browserHistory } from 'react-router'

import thunk from 'redux-thunk'
import remoteSync from '../middleware/remote-sync'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from '../reducers'

export default function configure () {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore

  const createStoreWithMiddleware = applyMiddleware(
    //logger,
    thunk,
    routerMiddleware(browserHistory),
    remoteSync
  )(create)

  const store = createStoreWithMiddleware(rootReducer)

  return store
}
