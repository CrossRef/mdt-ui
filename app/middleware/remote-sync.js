import fetch from '../utilities/fetch'


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
  'LOGIN'
]

const BREAKER_ACTION = 'SET_STATE'
let pendingAction = false
let breakerActionSeen = false

export default store => next => action => {
  var nextState = next(action) // update store to next state first

  if (action) {

    let actionType = action.type;
    const authHeader = localStorage.getItem('auth');

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
            if( //scrub data being synced to server
              property !== 'modal' &&
              property !== 'reduxForm' &&
              property !== 'search'
            )
              postingState[property] = reduxState[property]
          }
        }
        //Scrub dois array
        postingState.dois = postingState.dois.filter( element => {
          return element ? true : false
        });
        postingState.dois = removeDuplicates(postingState.dois);

        console.warn('Syncing to remote store:', pendingAction || actionType, postingState)
        fetch('http://mdt.crossref.org/mdt/v1/state', {
          method: 'POST',
          headers: {Authorization: authHeader},
          body: JSON.stringify(postingState)
        })

        // Reset pending state
        pendingAction = false
      }
    }
  }

  return nextState
}

var isEmpty = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false
    }
  }
  return true
}

function removeDuplicates(a) {
  var seen = {};
  var out = [];
  var len = a.length;
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
