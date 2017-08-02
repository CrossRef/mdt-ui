import { browserHistory } from 'react-router'

import xmlParse from '../utilities/xmldoc'
import fetch from '../utilities/fetch'
import { publicationXml } from '../utilities/xmlGenerator'
import { routes } from '../routing'

const withQuery = require('with-query')

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

export function editForm(keyVal) {
    return { type: 'REDUXFORM_ADD', keyVal}
}

export function clearForm() {
  return { type: 'REDUXFORM_CLEAR' }
}

export function cartUpdate(article) {
	return { type: 'CART_UPDATE', cart: article }
}

export function clearCart() {
	return { type: 'CLEAR_CART'}
}

export function removeFromCart(doi) {
	return { type: 'REMOVE_FROM_CART', action: {removeDoi: doi}}
}

// Async Action Creators

export function login (usr, pwd, error = (reason) => console.error('ERROR in login', reason)) {
  return function(dispatch) {
    fetch(`http://mdt.crossref.org/mdt/v1/login`, {
      method: 'post',
      body: JSON.stringify({usr, pwd})
    })
    .then((response)=> {
      if(response.status !== 200) { dispatch(loginData({error: `${response.status}: ${response.statusText}`})) }
      else return response.json()
    })
    .then((response)=>{
      if(!response) return;
      const authBearer = `${response.token_type} ${response.access_token}`;
      localStorage.setItem('auth', authBearer);
      localStorage.setItem('user', usr);
      response.error = null;
      dispatch(loginData(response));
      dispatch(getCRState('login'));
    })
    .catch(reason => error(reason))
  }
}

export function logout () {
  browserHistory.push(routes.base)
}

export function getCRState (type, error = (reason) => console.error('ERROR in getCRState', reason)) {
  return function(dispatch) {
    fetch(`http://mdt.crossref.org/mdt/v1/state`, {
      method: 'get',
      headers: {Authorization: localStorage.getItem('auth')}
    })
    .then((response)=> {
      if(response.status === 401) throw '401 Unauthorized - Not logged in';
      return response.text();
    })
    .then((textResponse)=>{
      let state;
      const newCRState = {
        routing: {
          locationBeforeTransitions: {
            pathname: routes.publications,
            query: ''
          }
        }
      };

      if (textResponse) {
        try {
          state = JSON.parse(textResponse);
        } catch(err) {
          state = newCRState
        }
        if(!state || !state.routing) state = newCRState
      } else {
        state = newCRState;
      }

      let scrubbedState = {...state}; //Scrubbed state is used to clear unnecessary or bad data from remote state.

      if(type === 'login') delete scrubbedState.login; //do not retrieve old login state if this is a new login

      // delete scrubbedState.cart;  //deposit cart tends to get bad data, clear it by un-commenting this line, don't forget to re-comment when done


      const pathname = scrubbedState.routing.locationBeforeTransitions.pathname;
      const base = routes.base;
      const matchLength = base.length + 4;

      // check if saved history matches current base. Only match base + 4 characters because some routes may be dynamic but the smallest static route is 4 characters long

      let match = (function checkRoutes () {
        for (var route in routes) {
          if(pathname.substring(0, matchLength) === routes[route].substring(0, matchLength)) return true
        }
        return false
      })();


      // redirect if it is a new base or if the base route somehow got saved to CRState. The base route is the login page so it should never save to CRState

      if(!match || pathname === base) {
        scrubbedState.routing.locationBeforeTransitions.pathname = routes.publications
      }
      dispatch({
        type: 'SET_STATE',
        payload: scrubbedState
      })
    })
    .catch(reason => error(reason))
  }
}


export function search (query, error = (reason) => console.error('ERROR in search', reason)) {
  return function (dispatch) {
    if(!query) return;
    dispatch(searchValue(query));
    dispatch(searchLoading(true)); //having 2 dispatches seems to give the initial searchValue time to save to store before the return's searchValue is checked
    fetch(`http://mdt.crossref.org/mdt/v1/search?q=${query}`, {
      method: 'get',
      headers: {Authorization: localStorage.getItem('auth')}
    })
    .then((response)=> response.json() )
    .then((result)=>{
      dispatch(searchResult(result.message, query));
    })
    .catch(reason => error(reason))
  }
}

export function searchRecords (query, pubTitle, type, error = (reason) => console.error('ERROR in searchRecords', reason)) {
  return function (dispatch) {
    if(!query) return;
    dispatch(searchValue(query));
    dispatch(searchLoading(true));
    fetch(`http://mdt.crossref.org/mdt/v1/search/works?q=${query}&title=${pubTitle}&type=${type.toLowerCase()}`, {
      method: 'get',
      headers: {Authorization: localStorage.getItem('auth')}
    })
      .then((response)=> response.json() )
      .then((result)=>{
        dispatch(searchResult(result.message, query));
      })
      .catch(reason => error(reason))
  }
}


export function getPublications (DOIs, callback, error = (reason) => console.error('ERROR in getPublications', reason)) {
  return function(dispatch) {
    if(!Array.isArray(DOIs)) DOIs = [DOIs];
    Promise.all(
      DOIs.map(
        (doi) =>
          fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${doi}`, { headers: {Authorization: localStorage.getItem('auth')}})
            .then(publication => publication.json())
            .catch(reason => console.error(`ERROR: publication DOI fetch failed `, reason))
      )
    )
      .then((publications) => {
        dispatch(storePublications(publications));
        if(callback) callback(publications)
      })
      .catch((reason) => {
        error(reason)
      })
  }
}


export function submitPublication (form, callback, error = reason => console.error('ERROR in submitPublication', reason)) {
  return function(dispatch) {
    fetch(`http://mdt.crossref.org/mdt/v1/work`, {
      method:'post',
      headers: {Authorization: localStorage.getItem('auth')},
      body: JSON.stringify({
        message: {
          'title': {'title': form.title},
          'doi': form.DOI,
          'owner-prefix': form.DOI.split('/')[0],
          'type': 'Publication',
          'mdt-version': form['mdt-version'] || '0',
          'status': 'draft',
          'content': publicationXml(form),
          'contains': []
        }
      })
    }).then(() =>
      fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${form.DOI}`, { headers: {Authorization: localStorage.getItem('auth')} })
        .then(publication => publication.json())
        .then(publication => {
          dispatch(storePublications(publication));
          if(callback) callback(publication)
        })
        .catch( reason => {
          error(reason)
        })
    )
    .catch( reason => {
      error(reason)
    })
  }
}


export function submitArticle (publication, articleDoi, callback, error = (reason) => console.error('ERROR in submitArticle', reason)) {
  return function(dispatch) {

    fetch(`http://mdt.crossref.org/mdt/v1/work`, {
        method: 'post',
        headers: {Authorization: localStorage.getItem('auth')},
        body: JSON.stringify(publication)
      }
    ).then(() =>
      fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${articleDoi}`, { headers: {Authorization: localStorage.getItem('auth')} })
        .then(article => article.json())
        .then((article) => {
          if(callback) callback();
        })
        .catch(reason => error(reason))
    ).catch(reason => error(reason))

  }
}


export function submitIssue (publication, callback, error = (reason) => console.error('ERROR in submitIssue', reason)) {
  return function(dispatch) {
    fetch(`http://mdt.crossref.org/mdt/v1/work`, {
        method: 'post',
        headers: {Authorization: localStorage.getItem('auth')},
        body: JSON.stringify(publication)
      }
    ).then(() => {
      if(callback) callback();
    })
    .catch((reason) => error(reason))
  }
}


export function deposit (cartArray, callback, error = (reason) => console.error(reason)) {
  return function(dispatch) {
    fetch(`http://mdt.crossref.org/mdt/v1/deposit`, {
      method:'post',
      headers: {Authorization: localStorage.getItem('auth')},
      body: JSON.stringify({
        message: cartArray
      })
    })
    .then(result => {
      if(result.status > 202) throw `Error ${result.status}: ${result.statusText}`;
      return result.json()
    })
    .then(result => {
      let resultArray = result.message;
      resultArray = resultArray.map((item) => {
        const getXML = xmlParse(item.result);
        if(getXML !== undefined) item.result = getXML;
        return item;
      });
      console.log('DEPOSIT RESULT', resultArray);
      if(callback) callback(resultArray)
    })
    .catch(reason => error(reason))
  }
}


export function getItem (doi) {
	return function(dispatch) {
		if(doi){
			return Promise.resolve(
				fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${doi}`, { headers: {Authorization: localStorage.getItem('auth')} })
				.then(response => {
				  if(response.status !== 200) {
				    console.error(`${response.status}: ${response.statusText}`, response);
				    throw `${response.status}: ${response.statusText}`
				  }
				  return response.json()
				})
			)
		}
	}
}

export function getDepositHistory (params, callback, error = (reason) => console.error(reason)) {
	return function(dispatch) {
    return Promise.resolve(
      fetch(withQuery('http://mdt.crossref.org/mdt/v1/history', params),
      {
        headers: {Authorization: localStorage.getItem('auth')}
      }
    ).then(depositHistory => depositHistory.json())
    ).then((depositHistory) => {
      if(callback) callback(depositHistory)
      return depositHistory
    })
    .catch(reason => error(reason))
	}
}

export function deleteRecord (doi, pubDoi, callback, error = (reason) => console.error('ERROR in deleteRecord', reason)) {
  return function(dispatch) {
    fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${doi}`, {
      method: 'delete',
      headers: {Authorization: localStorage.getItem('auth')}
    })
      .then(response => {
        if(response.status === 200) {
          dispatch(getPublications(pubDoi));
          if(callback) callback();
        } else throw `delete ${response.url} failed: ${response.status || 'Unknown status'} - ${response.statusText || 'Unknown statusText' }`
      })
      .catch(reason => error(reason))
  }
}




