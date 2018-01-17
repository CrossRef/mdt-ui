import {firstLogin, storePublications} from './application'
import {getCRState, getDraftWorks} from './api'
import {routes} from '../routing'


export default function _getCRState (type, currentLocation, error = (reason) => console.error('ERROR in getCRState', reason)) {
  return function(dispatch) {
    getCRState().then((textResponse)=>{
        let state
        const blankCRState = {
          routing: {
            locationBeforeTransitions: {
              pathname: routes.publications,
              query: ''
            }
          },
          dois: [],
          cart: [],
          publications: {}
        }

        if (textResponse) {
          try {
            state = JSON.parse(textResponse)   // try to parse remote store state, if there are errors, use blank CRState
          } catch(err) {
            state = blankCRState
          }
          if(!state || !state.routing) state = blankCRState
        } else {
          state = blankCRState
        }

        getDraftWorks().then((response)=>{
          const draftWorksArray = response.message
          dispatch(storePublications(draftWorksArray))
        })

        let scrubbedState = {...state} //Scrubbed state is used to clear unnecessary or bad data from remote state.

        if(type === 'login' && scrubbedState.login) {
          delete scrubbedState.login //do not retrieve old login state if this is a new login
          dispatch(firstLogin(false)) //if it has a saved login state, its not the first login
        } else if (type === 'login') {
          dispatch(firstLogin(true))
        }
        delete scrubbedState.toast
        delete scrubbedState.publications

        // delete scrubbedState.cart  //deposit cart tends to get bad data, clear it by un-commenting this line, don't forget to re-comment when done

        const pathname = scrubbedState.routing.locationBeforeTransitions.pathname
        const base = routes.base
        let match = true

        // uncomment this checkRoutes function in case the base url has changed to deal with the transition between remote state with old base url to new url
        // match = (function checkRoutes () {
        //   const matchLength = routes.base.length + 4 // check if saved history matches current base. Only match base + 4 characters because some routes may be dynamic but the smallest static route is 4 characters long
        //   for (var route in routes) {
        //     if(pathname.substring(0, matchLength) === routes[route].substring(0, matchLength)) return true
        //   }
        //   return false
        // })()


        if(!match || pathname === base) {   // redirect if it is a new base or if the base route somehow got saved to CRState. The base route is the login page so it should never save to CRState
          scrubbedState.routing.locationBeforeTransitions.pathname = routes.publications
        }

        if(type === 'newLoad') {
          scrubbedState.routing.locationBeforeTransitions.pathname = currentLocation
        }

        console.warn('Retrieving from remote store: ', scrubbedState)
        dispatch({
          type: 'SET_STATE',
          payload: scrubbedState
        })
      })
      .catch(reason => error(reason))
  }
}