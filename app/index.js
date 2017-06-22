//import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'

import configure from './store'
import Routing from './routing'
import { getCRState } from './actions/application'




const store = configure()
const history = syncHistoryWithStore(browserHistory, store)

if(browserHistory.getCurrentLocation().pathname !== '/mdt/') {
  store.dispatch(getCRState());
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Provider store={store}>
    <div>
      <Router history={history} basename={'mdt'}>
        {Routing(store)}
      </Router>
    </div>
  </Provider>, document.querySelector('#root'))
})
