import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
import _ from 'lodash'
import {Map, fromJS} from 'immutable'
import {recordTitle} from '../utilities/helpers'

import publicationsReducer from './publicationsReducer'
import reduxFormReducer from './reduxFormReducer'
import toastReducer from './toastReducer'
import cartReducer from './cartReducer'


const combinedReducers = combineReducers({
  search: searchReducer,
  login: loginReducer,
  routing: routerReducer,
  modal: modalReducer,
  publications: publicationsReducer,
  dois: doiReducer,
  reduxForm: reduxFormReducer,
  cart: cartReducer,
  toast: toastReducer
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



function doiReducer (state = [], action) {
  switch (action.type) {
    case 'DOI_ADD':
      if(!action.doi) return state
      if(Array.isArray(action.doi)) {
        filteredDois = action.doi.filter( element => {
          return !!element
        })
        return [ ...new Set([...state, ...filteredDois])]
      }

        else return [ ...new Set(state).add(action.doi)]
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




function toastReducer (state = {
  doi: '',
  title: '',
  recordType: '',
  updateType: ''
}, action) {
  switch (action.type) {
    case 'CART_UPDATE':
      const record = action.cart[0]
      if(record.type === 'article') {
        return {doi: record.doi, title: record.title.title, recordType: record.type, updateType: 'addToCart'}
      }
      else if(record.type === 'issue') {
        return {
          title: `${record.title.volume ? `, Volume ${record.title.volume}, ` : ''}Issue ${record.title.issue}`,
          recordType: record.type,
          updateType: 'addToCart'
        }
      }
      else return state
    case 'REMOVE_FROM_CART':
      return {doi: action.doi, title: action.title, recordType: action.recordType, updateType: 'removeFromCart'}
    case 'NEW_TOAST':
      return action.toast
    case 'CLEAR_TOAST':
      return {doi: '', title: '', recordType: '', updateType: ''}
    default:
      return state
  }
}

function cartReducer (state = [], action) {
  switch (action.type) {
    case 'CART_UPDATE':
      var newState = [...state]

      if(!Array.isArray(action.cart)) action.cart = [action.cart]

    function mergeByDoi(arr) {
      return _(arr)
        .groupBy(function(item) { // group the items using the lower case
          return item.doi
        })
        .map(function(group) { // map each group
          return _.mergeWith.apply(_, [{}].concat(group, function(obj, src) { // merge all items, and if a property is an array concat the content
            if (Array.isArray(obj)) {
              return mergeByDoi(obj.concat(src))
            }
          }))
        })
        .values() // get the values from the groupBy object
        .value()
    }
      newState.push(action.cart[0])
      newState = mergeByDoi(newState) //does 2 things, removes dupes and also merge the content if there was 2 of the same that way there is more info if there is more info
      return [...newState]
    case 'REMOVE_FROM_CART':
      var removeIndex = _.findIndex(state, (item) => {
        return action.doi.toLowerCase() === item.doi.toLowerCase()
      })
      if(removeIndex !== -1) {
        var newState = [...state]
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


