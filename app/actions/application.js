import {recordTitle} from '../utilities/helpers'
import _getCRState from './getCRState'
import * as api from './api'






// Action Creators, useless unless dispatched

export function loginData(data) {
  return { type: 'LOGIN', data }
}

export function resetLogin() {
  return { type: 'RESETLOGIN' }
}

export function firstLogin(status) {
  return { type: 'FIRSTLOGIN', status }
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

export function storePublications(publications, getDraftWorks) {
	return { type: 'STOREPUBLICATIONS', publications, getDraftWorks }
}

export function resetPublications() {
  return { type: 'RESETPUBLICATIONS' }
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

export function cartUpdate(item, inCart, addToCart) {
	return { type: 'CART_UPDATE', cart: item, inCart, addToCart }
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

    dispatch(searchValue(query))
    dispatch(searchLoading(true))

    api.searchRecords(query, pubTitle, type)
      .then((result)=>{
        dispatch(searchResult(result.message, query))
      })
      .catch(reason => error(reason))
  }
}






export function getPublications (DOIs) {
  return function(dispatch) {
    if(!Array.isArray(DOIs)) DOIs = [DOIs]
    return Promise.all(
      DOIs.map( doi => api.getItem(doi).catch( e => {
        console.error(`ERROR: publication DOI fetch failed `, doi, e)
        throw e
      }))
    )
      .then((publications) => {
        dispatch(storePublications(publications))
        return publications
      })
      .catch( e => {
        console.error('ERROR in getPublications', e)
        throw e
      })
  }
}






export function submitPublication (publication, error = reason => console.error('ERROR in submitPublication', reason)) {
  return function(dispatch) {
    return api.submitItem({message: publication}).then(() => {
      dispatch(getPublications(publication.doi))
    })
    .catch( reason => error(reason))
  }
}





export function deleteRecord (record, error = (reason) => console.error('ERROR in deleteRecord', reason)) {
  return function(dispatch) {
    const {doi, pubDoi, title, type, contains} = record
    return api.deleteItem({doi, title, pubDoi}).then(response => {
      if(response.status === 200) {
        if(type === 'issue') {
          for(let article of contains) {
            dispatch(deleteRecord(article))
          }
        }

        dispatch(removeFromCart(doi, recordTitle(type, title), type))
        dispatch(getPublications(pubDoi))

      } else throw `delete ${response.url} failed: ${response.status || 'Unknown status'} - ${response.statusText || 'Unknown statusText' }`
    })
    .catch(reason => error(reason))
  }
}






export function moveArticles (selections, issue, pubDoi) {
  return async function(dispatch) {
    const promises = []

    for(let selection of selections){
      if(selection.type === 'article') {

        let publicationWithArticle = await api.getItem(selection.doi)

        const article = publicationWithArticle.message.contains[0].type === 'article' ?
          publicationWithArticle.message.contains[0]
          :
          publicationWithArticle.message.contains[0].contains[0]

        article['mdt-version'] = String(Number(article['mdt-version']) + 1)

        const issueTarget = {...issue}
        delete issueTarget.content

        publicationWithArticle.message.contains[0] = {
          ...issueTarget,
          contains: [article]
        }

        promises.push(api.submitItem(publicationWithArticle))
      }
    }

    await Promise.all(promises)

    dispatch(getPublications(pubDoi))
  }
}


