import fetch from 'isomorphic-fetch'
import { push } from 'react-router-redux'

let store = null

const wrappedFetch = function () {
  return fetch.apply(fetch, arguments).then((response) => {
    if (response.status === 401) {
      store.dispatch({
        type: 'SET_AUTH_BEARER',
        payload: ''
      })
      store.dispatch(push('/'))

      const err = new Error(response.statusText)
      // We'll likely need the status code
      err.statusCode = response.status
      console.error('Authorization token expired')

      throw err
    }

    return response
  })
}

wrappedFetch.registerStore = function (storeRef) {
  store = storeRef
}

export default wrappedFetch