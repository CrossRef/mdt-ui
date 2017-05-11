import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import configure from './store'
import Routing from './routing'

import fetch from './utilities/fetch'
import { STContainer, myDecConfig, setConfig } from 'my_decorators'

setConfig({
	stateTracker: false,
	updateReports: { mount: false, update:false, pass:false, render: false }
});

const store = configure()
const history = syncHistoryWithStore(browserHistory, store)

fetch.registerStore(store)




document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Provider store={store}><div>
  	{myDecConfig.stateTracker && <STContainer />}
    <Router history={history}>
      {Routing(store)}
    </Router></div>
  </Provider>, document.querySelector('#root'))
})
