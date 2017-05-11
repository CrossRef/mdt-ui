import { createAction } from 'redux-actions'
import { browserHistory } from 'react-router'

import xmlParse from '../utilities/xmldoc'
import client from '../client'
import fetch from '../utilities/fetch'
import { publicationXml } from '../utilities/xmlGenerator'

export const SET_AUTH_BEARER = createAction('SET_AUTH_BEARER')

// ------------------------ REFACTORED ---------------------

// Action Creators, useless unless dispatched
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

export function cartUpdate(article) {
	return { type: 'CART_UPDATE', cart: article }
}

export function clearCart() {
	return { type: 'CLEAR_UPDATE' }
}

export function removeFromCart(doi, cart) {
	return { type: 'REMOVE_FROM_CART', action: {removeDoi: doi, cart: cart}}
}

// Async Action Creators

export function deposit (cartArray, callback, error = (reason) => console.error(reason)) {
  return function(dispatch) {
    fetch(`http://mdt.crossref.org/mdt/v1/deposit`, {
      method:'post',
      headers: client.headers,
      body: JSON.stringify({
        message: cartArray
      })
    })
      .then(result => result.json())
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

export function submitArticle (publication, articleDoi, callback, error = (reason) => console.error('ERROR in submitReduxForm', reason)) {
  return function(dispatch) {

    fetch(`http://mdt.crossref.org/mdt/v1/work`, {
        method: 'post',
        headers: client.headers,
        body: JSON.stringify(publication)
      }
    ).then(() =>
      fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${articleDoi}`, { headers: client.headers })
        .then(article => article.json())
        .then((article) => {

          if(callback) callback();
        })
        .catch(reason => error(reason))
    ).catch(reason => error(reason))

  }
}

export function getPublications (DOIs, callback, error = (reason) => console.error('ERROR in getPublications', reason)) {
	return function(dispatch) {
		if(!Array.isArray(DOIs)) DOIs = [DOIs];
		Promise.all(
			DOIs.map(
				(doi) =>
					fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${doi}`, { headers: client.headers })
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

export function getItem (doi) {
	return function(dispatch) {
		if(doi){
			return Promise.resolve(
				fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${doi}`, { headers: client.headers })
				.then(publication => publication.json())
			).then((publication) => {
				return publication
			})
		}
	}
}



export function submitPublication (form, callback, error = reason => console.error('ERROR in submitPublication', reason)) {
	return function(dispatch) {
		fetch(`http://mdt.crossref.org/mdt/v1/work`, {
			method:'post',
			headers: client.headers,
			body: JSON.stringify({
				message: {
					'title': {'title': form.title},
					'doi': form.DOI,
					'type': 'Publication',
					'mdt-version': form['mdt-version'] || '0',
					'status': 'draft',
					'content': publicationXml(form),
					'contains': []
				}
			})
		}).then(() =>
			fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${form.DOI}`, { headers: client.headers })
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



