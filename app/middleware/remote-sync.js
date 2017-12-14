import {routes} from '../routing'
import * as api from '../actions/api'


var blacklistActions = [
  'SET_STATE', // We don't want to sync back what we just got
  'SET_AUTH_BEARER', // Setting a new auth token shouldn't over-write the existing state
  'PUBLICATIONS',
  'MODAL',
  'GET_CART',
  'GET_ITEM',
  'REDUXFORM_ADD',
  'REDUXFORM_CLEAR',
  'SEARCH_RESULT',
  'SEARCH_STATUS',
  'SEARCH_VALUE',
  'LOGIN',
  'CLEAR_TOAST'
]

const BREAKER_ACTION = 'SET_STATE'
let pendingAction = false
let breakerActionSeen = false

export default store => next => action => {
  var nextState = next(action) // update store to next state first

  if (action) {

    if(action.type === '@@router/LOCATION_CHANGE' && action.payload.pathname === routes.base) {
      return
    }

    let actionType = action.type
    const authHeader = localStorage.getItem('auth')

    if (!breakerActionSeen && actionType === BREAKER_ACTION) {
      breakerActionSeen = true
      console.log('Breaker action called, enabling posting state to backend')
      // If a pending action is active, that takes priority
      actionType = pendingAction || actionType
    }

    if (actionType && !actionType.startsWith('@@redux-api@') && blacklistActions.indexOf(actionType) === -1) {
      if (!breakerActionSeen) {
        pendingAction = actionType
        console.log(`Pending ${actionType}`)
      } else if (authHeader) {
        var reduxState = store.getState()
        var postingState = {}

        for (var property in reduxState) {
          if (reduxState.hasOwnProperty(property) && !reduxState[property].hasOwnProperty('sync')) {

            const syncedState =
              property === 'login' ||
              property === 'routing' ||
              property === 'cart'

            if(syncedState) {
              postingState[property] = reduxState[property]
            }
          }
        }

        console.warn('Syncing to remote store:', pendingAction || actionType, postingState)
        api.syncState(postingState)

        // Reset pending state
        pendingAction = false
      }
    }
  }

  return nextState
}


