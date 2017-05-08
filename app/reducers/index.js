import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import application from './application'
import rest from '../client'



const combinedReducers = combineReducers({
  ...rest.reducers,
  routing,
  application,
  modal: modalReducer,
  publications: publicationsReducer,
  dois: doiReducer
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

function doiReducer (state = [], action) {

  switch (action.type) {
    case 'DOI_ADD':
      if(Array.isArray(action.doi))
        return [...state, ...action.doi]
        else return [...state, action.doi]
    default:
      return state
  }
}

function modalReducer ( state = {
  showModal: false,
  title: '',
  Component: () => {},
  props: {}
}, action) {

  switch (action.type) {
    case 'MODAL':
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
        publications.forEach( publication => {
          if(!publication || !publication.message || !publication.message.doi) return console.warn(`Had trouble retrieving data for a Publication`);
          normalizedData[publication.message.doi] = publication
        });
        return normalizedData
      };
      
      if (Array.isArray(action.publications)) return {...state, ...normalize(action.publications)};
      const publication = action.publications;
      return {...state, [publication.message.doi]:publication}

      return {...state, ...normalizedPublications}
    default:
      return state
  }
}