import {recordTitle} from '../utilities/helpers'
import _getCRState from './getCRState'
import * as api from './api'






// Action Creators, useless unless dispatched

export function loginData(data) {
  return { type: 'LOGIN', data }
}

export function searchResult(result, value) {
  return { type: 'SEARCH_RESULT', result, value }
}

export function searchLoading (status) {
  return { type: 'SEARCH_STATUS', status}
}

export function searchValue (value) {
  return { type: 'SEARCH_VALUE', value}
}

export function controlModal(modalObj) {
	return { type: 'MODAL', modalObj }
}

export function storePublications(publications) {
	return { type: 'PUBLICATIONS', publications }
}

export function addDOIs(doi) {
	return { type: 'DOI_ADD', doi }
}

export function editForm(keyPath, value) {
  return { type: 'REDUXFORM_ADD', keyPath, value}
}

export function deleteCard(keyPath) {
  return { type: 'REDUXFORM_DELETE', keyPath}
}

export function clearForm() {
  return { type: 'REDUXFORM_CLEAR' }
}

export function cartUpdate(item, addToCart, inCart) {
	return { type: 'CART_UPDATE', cart: item, addToCart, inCart }
}

export function clearCart() {
	return { type: 'CLEAR_CART'}
}

export function removeFromCart(doi, title, recordType) {
	return { type: 'REMOVE_FROM_CART', doi, title, recordType }
}

export function clearToast () {
  return { type: 'CLEAR_TOAST' }
}



// Async Action Creators

export const getCRState = _getCRState



export function login (usr, pwd, error = (reason) => console.error('ERROR in login', reason)) {
  return function(dispatch) {
    api.login(usr, pwd).then((response)=> {
      if(response.status !== 200) { dispatch(loginData({error: `${response.status}: ${response.statusText}`})) }
      else return response.json()
    })
    .then((response)=>{
      if(!response) return
      const authBearer = `${response.token_type} ${response.access_token}`
      localStorage.setItem('auth', authBearer)
      localStorage.setItem('user', usr)
      response.error = null
      dispatch(loginData(response))
      dispatch(getCRState('login'))
    })
    .catch(reason => error(reason))
  }
}





export function search (query, error = (reason) => console.error('ERROR in search', reason)) {
  return function (dispatch) {
    if(!query) {
      return
    }
    dispatch(searchValue(query))
    dispatch(searchLoading(true)) //having 2 dispatches seems to give the initial searchValue time to save to store before the return's searchValue is checked

    api.searchTitle(query)
      .then((result)=>{
        dispatch(searchResult(result.message, query))
      })
      .catch(reason => error(reason))
  }
}





export function searchRecords (query, pubTitle, type, error = (reason) => console.error('ERROR in searchRecords', reason)) {
  return function (dispatch) {
    if(!query) {
      return
    }
    dispatch(searchValue(query))
    dispatch(searchLoading(true))
    if(type === 'Issue') {
      type = 'allissues'
    }

    api.searchRecords(query, pubTitle, type)
      .then((result)=>{
        dispatch(searchResult(result.message, query))
      })
      .catch(reason => error(reason))
  }
}






export function getPublications (DOIs, callback, error = (reason) => console.error('ERROR in getPublications', reason)) {
  return function(dispatch) {
    if(!Array.isArray(DOIs)) DOIs = [DOIs]
    Promise.all(
      DOIs.map( doi => api.getItem(doi).catch(reason => console.error(`ERROR: publication DOI fetch failed `, reason)) )
    )
      .then((publications) => {
        dispatch(storePublications(publications))
        if(callback) callback(publications)
      })
      .catch((reason) => {
        error(reason)
      })
  }
}






export function submitPublication (publication, error = reason => console.error('ERROR in submitPublication', reason)) {
  return function(dispatch) {
    return api.submitItem({message: publication}).then(() => {
      dispatch(addDOIs(publication.doi))
      dispatch(getPublications(publication.doi))
    })
    .catch( reason => error(reason))
  }
}





export function deleteRecord (record, error = (reason) => console.error('ERROR in deleteRecord', reason)) {
  return function(dispatch) {
    const {doi, pubDoi, title, type, contains} = record
    return api.deleteItem(doi).then(response => {
      if(response.status === 200) {
        if(type === 'issue') {
          for(let i in contains) {
            dispatch(deleteRecord(contains[i]))
          }
        }

        dispatch(removeFromCart(doi, recordTitle(type, title), type))
        dispatch(getPublications(pubDoi))

      } else throw `delete ${response.url} failed: ${response.status || 'Unknown status'} - ${response.statusText || 'Unknown statusText' }`
    })
    .catch(reason => error(reason))
  }
}


