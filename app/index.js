//import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import { STContainer, myDecConfig, setConfig } from 'my_decorators'

import configure from './store'
import Routing from './routing'
import { getCRState } from './actions/application'



setConfig({
	stateTracker: true,
	updateReports: { mount: false, update:true, pass:false, render: false }
});

const store = configure()
const history = syncHistoryWithStore(browserHistory, store)

if(browserHistory.getCurrentLocation().pathname !== '/') {
  store.dispatch(getCRState());
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Provider store={store}>
    <div>
      {myDecConfig.stateTracker && <STContainer />}
      <Router history={history}>
        {Routing(store)}
      </Router>
    </div>
  </Provider>, document.querySelector('#root'))
})
