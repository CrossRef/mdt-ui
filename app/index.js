import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'

import configureStore from './store'
import Routing, { routes } from './routing'
import { getCRState, controlModal } from './actions/application'


window.version = version()


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




function version () {
  const mergedBranches =
`
Merged branches / tickets in this build

MM-216
MM-225
MM-223
MM-222
MM-117
MM-215
MM-219
MM-212
MM-220
MM-214
MM-217
MM-181
MM-151

`
  console.log(mergedBranches)
  return mergedBranches
}