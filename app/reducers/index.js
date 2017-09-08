import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import _ from 'lodash'
import {Map, fromJS} from 'immutable'



const combinedReducers = combineReducers({
  search: searchReducer,
  login: loginReducer,
  routing: routing,
  modal: modalReducer,
  publications: publicationsReducer,
  dois: doiReducer,
  reduxForm: reduxFormReducer,
  cart: cartReducer,
  cartToast: cartToastReducer
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


function reduxFormReducer (state = Map({}), action) {
  switch (action.type) {
    case 'REDUXFORM_ADD':
      if(typeof action.value === 'object' && !Map.isMap(action.value)) {
        action.value = fromJS(action.value);
      }

      if(action.value === '') {
        const [cardKey, index, fieldKey] = action.keyPath;
        const fieldGroup = state.getIn([cardKey, index]);

        if(fieldGroup.size === 1 && fieldGroup.get(fieldKey)) {  // if this property is the last one, delete parent
          const card = state.get(cardKey);
          if(card.size === 1 && card.get(index)) {
            return state.delete(cardKey)
          } else {
            return state.deleteIn([cardKey, index])
          }
        } else {
          return state.deleteIn(action.keyPath)
        }
      } else {
        return state.setIn(action.keyPath, action.value)
      }
    case 'REDUXFORM_DELETE':
      return state.deleteIn(action.keyPath)
    case 'REDUXFORM_CLEAR':
      return Map({})
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
          return !!element
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
          normalizedData[publications.message.doi] = {...publications, normalizedRecords}

        } else normalizedData[publications.message.doi] = publications;

        return normalizedData
      };

      return {...state, ...normalize(action.publications)}
    default:
      return state
  }
}

function cartToastReducer (state = {
  doi: '',
  title: '',
  recordType: '',
  updateType: ''
}, action) {
  switch (action.type) {
    case 'CART_UPDATE':
      const record = action.cart[0]
      if(record.type === 'article') {
        return {doi: record.doi, title: record.title.title, recordType: record.type, updateType: 'add'}
      }
      else if(record.type === 'issue') {
        return {
          title: `${record.title.volume ? `, Volume ${record.title.volume}, ` : ''}Issue ${record.title.issue}`,
          recordType: record.type,
          updateType: 'add'
        }
      }
      else return state
    case 'REMOVE_FROM_CART':
      return {doi: action.doi, title: action.title, recordType: action.recordType, updateType: 'remove'}
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
        return action.doi === item.doi
      })
      if(removeIndex !== -1) {
        var newState = [...state];
        newState.splice(removeIndex, 1)
        return newState
      } else return state
    case 'CLEAR_CART':
      var cart = []
      return [...cart]
    default:
      return state
  }
}


