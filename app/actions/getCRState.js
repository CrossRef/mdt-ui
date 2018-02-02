import {firstLogin, storePublications} from './application'
import {getCRState, getDraftWorks} from './api'
import {routes} from '../routing'
import {normalize} from '../utilities/helpers'


export default function _getCRState (type, currentLocation) {
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
          const getDraftWorks = true
          dispatch(storePublications(normalize(draftWorksArray), getDraftWorks))
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


        if(pathname === base) {   // redirect if it is a new base or if the base route somehow got saved to CRState. The base route is the login page so it should never save to CRState
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
      .catch(reason => console.error('ERROR in getCRState', reason))
  }
}