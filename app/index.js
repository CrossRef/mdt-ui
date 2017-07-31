//import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import { STContainer, myDecoratorsConfig, setConfig } from 'my_decorators'

import configure from './store'
import Routing, { routes } from './routing'
import { getCRState } from './actions/application'



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
      <Router history={history} onUpdate={()=>window.scrollTo(0, 0)}>
        {Routing()}
      </Router>
    </div>
  </Provider>, document.querySelector('#root'))
})
