import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import _ from 'lodash'



const combinedReducers = combineReducers({
  search: searchReducer,
  login: loginReducer,
  routing: routing,
  modal: modalReducer,
  publications: publicationsReducer,
  dois: doiReducer,
  reduxForm: reduxFormReducer,
  cart: cartReducer,
})

export default (state, action) => {

  switch (action.type) {
    case 'SET_STATE':
      return {
        ...state,
        ...action.payload
      }
    default:
      return combinedReducers(state, action) || state || {}
  }
}


function loginReducer (state = {'crossmark-prefixes': [], prefixes: []}, action) {
  switch (action.type) {
    case 'LOGIN':
      return {...state, ...action.data}
    default:
      return state
  }
}


function searchReducer (state = {loading:false, searchValue: '', result:[]}, action) {
  switch (action.type) {
    case 'SEARCH_RESULT':
      if(action.value === state.searchValue) {
        return {...state, result: action.result, loading:false}
      } else return state
    case 'SEARCH_STATUS':
      return {...state, loading: action.status}
    case 'SEARCH_VALUE':
      return {...state, searchValue: action.value}
    default:
      return state
  }
}


function reduxFormReducer (state = { submit: false }, action) {
  switch (action.type) {
    case 'REDUXFORM_ADD':
      return {...state, ...action.keyVal}
    case 'REDUXFORM_CLEAR':
      return { submit: false }
    default:
      return state
  }
}



function doiReducer (state = [], action) {
  switch (action.type) {
    case 'DOI_ADD':
      if(!action.doi) return state;
      if(Array.isArray(action.doi)) {
        filteredDois = action.doi.filter( element => {
          return element ? true : false
        })
        return [...state, ...filteredDois]
      }

        else return [...state, action.doi]
    default:
      return state
  }
}



function modalReducer ( state = {
  showModal: false,
  title: '',
  style: 'defaultModal',
  Component: () => {},
  props: {}
}, action) {

  switch (action.type) {
    case 'MODAL':
      if(!action.modalObj.style) action.modalObj.style = 'defaultModal'
      return {...state, ...action.modalObj}
    default:
      return state
  }
}



function publicationsReducer (state = {}, action) {
  switch (action.type) {
    case 'PUBLICATIONS':
      const publications = action.publications;

      function normalize (publications) {  //Redux likes normalized state: store items in an object, with the IDs of the items as keys and the items themselves as the values.
        let normalizedData = {};

        if(Array.isArray(publications)) {
          publications.forEach( eachPublication => {
            if(!eachPublication || !eachPublication.message || !eachPublication.message.doi) return console.warn(`Had trouble retrieving data for a Publication`, eachPublication || 'Empty Array Value');
            const normalizedRecords = {};

            if((eachPublication.message.contains || []).length) {
              eachPublication.message.contains.forEach(eachRecord => {
                if (!eachRecord || !eachRecord.doi) return console.warn(`Had trouble retrieving data for a Record`, eachRecord || 'Empty Array Value');
                normalizedRecords[eachRecord.doi] = eachRecord;
              });
            }
            normalizedData[eachPublication.message.doi] = {...eachPublication, normalizedRecords}
          });

        } else if(publications.message.contains.length) {
          const normalizedRecords = {};

          publications.message.contains.forEach(eachRecord => {
            if(!eachRecord || !eachRecord.doi) return console.warn(`Had trouble retrieving data for a Record`, eachRecord || 'Empty Array Value');
            normalizedRecords[eachRecord.doi] = eachRecord;
          });
          normalizedData[eachPublication.message.doi] = {...publications, normalizedRecords}

        } else normalizedData[publications.message.doi] = publications;

        return normalizedData
      };

      return {...state, ...normalize(action.publications)}
    default:
      return state
  }
}



function cartReducer (state = [], action) {
  switch (action.type) {
    case 'CART_UPDATE':
      var newState = [...state]

      function mergeByDoi(arr) {
        return _(arr)
          .groupBy(function(item) { // group the items using the lower case
            return item.doi;
          })
          .map(function(group) { // map each group
            return _.mergeWith.apply(_, [{}].concat(group, function(obj, src) { // merge all items, and if a property is an array concat the content
              if (Array.isArray(obj)) {
                return obj.concat(src);
              }
            }))
          })
          .values() // get the values from the groupBy object
          .value();
      }
      newState.push(action.cart[0])
      newState = mergeByDoi(newState) //does 2 things, removes dupes and also merge the content if there was 2 of the same that way there is more info if there is more info

      return [...newState]
    case 'REMOVE_FROM_CART':
      var removeIndex = _.findIndex(state, (item) => {
        return action.action.removeDoi === item.doi
      })
      var newState = [...state];
      newState.splice(removeIndex, 1);
      return [...newState]
    case 'CLEAR_CART':
      var cart = []
      return [...cart]
    default:
      return state
  }
}


