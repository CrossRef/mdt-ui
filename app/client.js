import fetch from './utilities/fetch'
import reduxApi from 'redux-api'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import { push } from 'react-router-redux'
import _ from 'lodash'

let headers = {}

let client = reduxApi({
  login: {
    url: 'http://mdt.crossref.org/mdt/v1/login',
    options: {
      method: 'post'
    },
    postfetch: [({ data, action, dispatch, getState, request }) => {
      dispatch({
        type: 'SET_AUTH_BEARER',
        payload: `${data.token_type} ${data.access_token}`
      })
      dispatch({
        type: 'CROSSMARK',
        payload: false
      })
      dispatch(client.actions.getCRState())
    }]
  },

  search: {
    url: 'http://mdt.crossref.org/mdt/v1/search',
    options: { headers }
  },

  getCRState: { // getState became a conflict between redux's getState and the getState from crossref, had to do a name change
    url: 'http://mdt.crossref.org/mdt/v1/state',
    options: {
      method: 'get',
      headers
    },
    postfetch: [({ data, action, dispatch, getState, request }) => {

      const scrubbedData = {...data}; // Use scrubbedData to remove modal component of data being pulled from server, in case it got saved.
      delete scrubbedData.modal;
      delete scrubbedData.publications;
      delete scrubbedData.crossmarkAuth;

      scrubbedData.dois = [...(scrubbedData.dois || []), ...(scrubbedData.application.DOIs || [])];
      scrubbedData.dois = removeDuplicates(scrubbedData.dois);

      if (scrubbedData && !_.isEmpty(scrubbedData)) {
        dispatch({
          type: 'SET_STATE',
          payload: scrubbedData
        })

        if (scrubbedData.routing.locationBeforeTransitions.pathname === '/') {
          dispatch(push('/publications'))
        }
      } else {
        dispatch(push('/publications'))
      }
    }]
  }
})
.use('fetch', adapterFetch(fetch))

client.headers = headers
client.isLoggedIn = function (callback) {
  if (localStorage.getItem('auth')) {
    this.headers.Authorization = localStorage.getItem('auth')
  }
  console.log('User', this.headers.Authorization ? 'is' : 'isn\'t', 'logged in')
  return !!this.headers.Authorization
}
export default client


function removeDuplicates(a) {
  var seen = {};
  var out = [];
  var len = (a || []).length;
  var j = 0;
  for(var i = 0; i < len; i++) {
    var item = a[i];
    if(seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
}