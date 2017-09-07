//import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import { STContainer, myDecoratorsConfig, setConfig } from 'my_decorators'

import configure from './store'
import Routing, { routes } from './routing'
import { getCRState, controlModal } from './actions/application'

window.version=version()

setConfig({
	showStateTracker: false,
	updateReports: { mount: false, update:false, pass:false, render: false }
});

const store = configure()
const history = syncHistoryWithStore(browserHistory, store)

if(browserHistory.getCurrentLocation().pathname !== `${routes.base}`) {
  store.dispatch(getCRState());
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Provider store={store}>
    <div>
      {myDecoratorsConfig.showStateTracker && <STContainer />}
      <Router history={history} onUpdate={()=>{
        if(!store.getState().routing.locationBeforeTransitions.query.modal) {
          store.dispatch(controlModal({ showModal: false }))
        }
        window.scrollTo(0, 0);
      }}>
        {Routing()}
      </Router>
    </div>
  </Provider>, document.querySelector('#root'))
})




function version () {
  const mergedBranches =
    `
Merged branches / tickets in this build
MM-52
MM-56
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
