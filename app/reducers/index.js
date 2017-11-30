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
  stateRetrieved: stateRetrievedReducer,
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


function loginReducer (state = {'crossmark-prefixes': [], prefixes: [], firstLogin: undefined}, action) {
  switch (action.type) {
    case 'LOGIN':
      return {...state, ...action.data}
    case 'RESETLOGIN':
      return {'crossmark-prefixes': [], prefixes: [], firstLogin: undefined}
    case 'FIRSTLOGIN':
      return {...state, firstLogin: action.status}
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


function stateRetrievedReducer (state = false, action) {
  switch (action.type) {
    case 'DOI_SYNC':
      return true
    default:
      return state
  }
}


function doiReducer (state = [], action) {
  switch (action.type) {
    case 'DOI_ADD':
      if(!action.doi) return state
      if(Array.isArray(action.doi)) {
        const filteredDois = action.doi.filter( element => {
          return !!element
        })
        return [ ...new Set([...state, ...filteredDois])]
      }

        else return [ ...new Set(state).add(action.doi)]

    case 'DOI_SYNC':
      if(!action.doi) return state
      const filteredDois = action.doiArray.filter( element => {
        return !!element
      })
      return [ ...new Set(filteredDois)]

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









