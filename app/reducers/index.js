import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'

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









