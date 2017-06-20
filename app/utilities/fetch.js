import fetch from 'isomorphic-fetch'
import { browserHistory } from 'react-router'


const wrappedFetch = function () {
  return fetch.apply(fetch, arguments).then((response) => {
    if (response.status === 401) {
      console.log([response.status, arguments, response]);
      if(browserHistory.getCurrentLocation().pathname !== '/mdt/') {
        browserHistory.push('/mdt/');
        console.error('Authorization failed, kicking back to HomePage')
      }
    }
    return response
  })
}

export default wrappedFetch
