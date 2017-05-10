import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import application from './application'
import rest from '../client'
import _ from 'lodash'



const combinedReducers = combineReducers({
  ...rest.reducers,
  routing,
  application,
  modal: modalReducer,
  publications: publicationsReducer,
  dois: doiReducer,
  reduxForm: reduxFormReducer,
  crossmarkAuth: crossmarkAuthReducer,
  cart: cartReducer,
  items: getItemReducer
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



// ------------------------ REFACTORED --------------------------------

function reduxFormReducer (state = { submit: false }, action) {

  switch (action.type) {
    case 'REDUXFORM_ADD':
      return {...state, ...action.keyVal}
    default:
      return state
  }
}



function crossmarkAuthReducer (state = false, action) {

  switch (action.type) {
    case 'CROSSMARK':
      return action.payload
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

      function normalize (publicationsArray) {  //Redux likes normalized state: store items in an object, with the IDs of the items as keys and the items themselves as the values.
        let normalizedData = {};
        publicationsArray.forEach( eachPublication => {
          if(!eachPublication || !eachPublication.message || !eachPublication.message.doi) return console.warn(`Had trouble retrieving data for a Publication`);
          normalizedData[eachPublication.message.doi] = eachPublication
        });
        return normalizedData
      };

      if (Array.isArray(publications)) {
        return {...state, ...normalize(action.publications)}
      } else {
        return {...state, [publications.message.doi]:publications }
      }
    default:
      return state
  }
}



function cartReducer (state = [], action) {
  switch (action.type) {
    case 'CART_UPDATE':
      if(Array.isArray(action.cart)) {

        var inCartItem = _.find(state, (item) => {
          return item.doi === action.cart[0].doi
        })


        if (!inCartItem) { //only add if doi does not exist
          return [...state, ...action.cart]
        } else {
          return [...state]
        }
      } else {
        return [...state, action.cart]
      }
    case 'REMOVE_FROM_CART':
      var cart = action.action.cart
      if(Array.isArray(action.action.cart)) {
        for(var i = 0; i < cart.length; i++) {
          var doi = cart[i].doi || cart[i].article.doi
          if (doi) {
            if (doi === action.action.removeDoi) {
              cart.splice(i,1)
            }
          }
        }
        return [...cart]
      }
        else return [...cart]
    case 'CLEAR_CART':
      return [...state, []]
    default:
      return state
  }
}



function getItemReducer (state = [], action) {
  switch (action.type) {
    case 'GET_ITEM':
      if(Array.isArray(action.cart)) {

        var inCartItem = _.find(state, (item) => {
          return item.doi === action.cart[0].doi
        })


        if (!inCartItem) { //only add if doi does not exist
          return [...state, ...action.cart]
        } else {
          return [...state]
        }
      } else {
        return [...state, action.cart]
      }
      return [...state, action.cart]
    default:
      return state
  }
}

