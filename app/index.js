import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'

import configureStore from './store'
import Routing, { routes } from './routing'
import { getCRState, controlModal } from './actions/application'


const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

const currentLocation = browserHistory.getCurrentLocation().pathname;
if(currentLocation !== routes.base) {
  store.dispatch(getCRState('newLoad', currentLocation))
}


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Provider store={store}>
    <div>
      <Router history={history}>
        {Routing(store)}
      </Router>
    </div>
  </Provider>, document.querySelector('#root'))
})