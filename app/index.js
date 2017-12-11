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


const routerActions = {
  resetPage: () => {
    store.dispatch(controlModal({ showModal: false }))
    window.scrollTo(0, 0)
  }
}


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Provider store={store}>
    <div>
      <Router history={history}>
        {Routing(routerActions)}
      </Router>
    </div>
  </Provider>, document.querySelector('#root'))
})




function version () {
  const mergedBranches =
`
Merged branches / tickets in this build

MM-127
MM-166
MM-165
MM-170
MM-163
MM-84
MM-109
MM-29
MM-24
MM-69
MM-116
MM-24
MM-162
MM-164
MM-159
MM-89
MM-158
MM-152
MM-156
MM-148
MM-96
MMM-139
MM-129
MM-140
MM-155
MM-75
MM-153
MM-147
MM-133
MM-132
MM-130
MM-76
MM-71
MM-50
MM-108
MM-47
MM-106
MM-105
MM-118
MM-119
MM-88
MM-99
MM-63
MM-67
MM-52
MM-56
MM-93
MM-86
MM-51
MM-70
MM-58
MM-79
MM-40
MM-59
MM-67
MM-65
MM-43
MM-45
MM-40
MM-42
MM-62
MM-58
MM-39
MM-59
MM-13
MM-60
MM-58
MM-23
MM-21
MM-16
MM-23
MM-22
MM-15
MM-1
MM-5
MM-3
MM-9
MM-36
MM-1
MM-12
MM-11
MM-10
MM-8

`
  console.log(mergedBranches)
  return mergedBranches
}