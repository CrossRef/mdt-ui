import { createAction } from 'redux-actions'
import { browserHistory } from 'react-router'
import client from '../client'

import fetch from '../utilities/fetch'

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



// Async Action Creators
export function getPublications (DOIs, callback) {
	return function(dispatch) {
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
			if(callback) { callback() }
		})
		.catch((reason) => {
			console.error('ERROR: getPublications ', reason)
		})
	}
}

export function submitPublication (form, callback, error = reason => console.error(reason)) {
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
					'content': '<Journal xmlns="http://www.crossref.org/xschema/1.1"><journal_metadata language="' + form.language + '"><full_title>' + form.title + '</full_title><abbrev_title>' + form.abbreviation + '</abbrev_title><issn media_type="print"></issn><issn media_type="electronic">' + form.electISSN + '</issn><doi_data><doi>'+form.DOI+'</doi><resource>'+form.url+'</resource></doi_data></journal_metadata><archive_locations><archive name="' + form.archivelocation + '"/></archive_locations></Journal>',
					'contains': []
				}
			})
		}).then(() =>
			fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${form.DOI}`, { headers: client.headers })
			.then(publication => publication.json())
			.then(publication => {
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