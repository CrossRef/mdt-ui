import { createStore, applyMiddleware } from 'redux'
import { browserHistory } from 'react-router'

import thunk from 'redux-thunk'
import { logger, remoteSync } from '../middleware'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from '../reducers'
import client from '../client'

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

  if (client.isLoggedIn()) {
    console.log('Reloading state from backend')
    store.dispatch(client.actions.getCRState())
  }

  return store
}
