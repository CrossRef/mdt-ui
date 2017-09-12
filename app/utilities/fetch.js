import fetch from 'isomorphic-fetch'
import { browserHistory } from 'react-router'

import {routes} from '../routing'


const wrappedFetch = function () {
  return fetch.apply(fetch, arguments).then((response) => {
    if (response.status === 401) {
      console.log([response.status, arguments, response]);
      if(browserHistory.getCurrentLocation().pathname !== routes.base) {
        browserHistory.push(routes.base);
        console.error('Authorization failed, kicking back to HomePage')
      }
    }
    return response
  })
}

export const regularFetch = fetch

export default wrappedFetch
