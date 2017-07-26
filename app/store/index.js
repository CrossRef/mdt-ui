import { createHistory } from 'history'
import { createStore, applyMiddleware } from 'redux'
import { browserHistory, useRouterHistory  } from 'react-router'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'

import rootReducer from '../reducers'
import remoteSync from '../middleware/remote-sync'


export default function configure () {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore

  const browserHistoryNew = useRouterHistory(createHistory)({
    basename: 'metadatamanager'
  })

  const createStoreWithMiddleware = applyMiddleware(
    thunk,
    routerMiddleware(browserHistoryNew),
    remoteSync
  )(create)

  const store = createStoreWithMiddleware(rootReducer)

  return store
}
