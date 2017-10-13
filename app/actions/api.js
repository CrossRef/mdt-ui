import withQuery from 'with-query'

import authorizedFetch, {regularFetch} from '../utilities/fetch'
const apiBaseUrl = require('../../deployConfig').apiBaseUrl




export function getCRState () {
  return authorizedFetch(`${apiBaseUrl}/state`, {
    method: 'get',
    headers: {Authorization: localStorage.getItem('auth')}
  })
    .then((response)=> {
      return response.text()
    })
}


export function syncState (postingState) {
  authorizedFetch(`${apiBaseUrl}/state`, {
    method: 'POST',
    headers: {Authorization: localStorage.getItem('auth')},
    body: JSON.stringify(postingState)
  })
}



export function login (usr, pwd) {
  return authorizedFetch(`${apiBaseUrl}/login`, {
    method: 'post',
    body: JSON.stringify({usr, pwd})
  })
}


export function searchTitle (query) {
  return authorizedFetch(`${apiBaseUrl}/search?q=${query}`, {
    method: 'get',
    headers: {Authorization: localStorage.getItem('auth')}
  })
    .then((response)=> response.json() )
}



export function searchRecords (query, pubTitle, type) {
  return authorizedFetch(`${apiBaseUrl}/search/works?q=${query}&title=${pubTitle}&type=${type.toLowerCase()}`, {
    method: 'get',
    headers: {Authorization: localStorage.getItem('auth')}
  })
    .then((response)=> response.json() )
}



export function getItem (id, forced) {
  let doi, pubDoi, title
  if(typeof id === 'object') {
    doi = id.doi
    title = id.title
    pubDoi = id.pubDoi
  } else if(typeof id === 'string') {
    doi = id
  }

  const queryParams = doi ? `doi=${doi}` : `pubdoi=${pubDoi}&title=${JSON.stringify(title)}`

  return authorizedFetch(`${apiBaseUrl}/work?${queryParams}${forced ? `&forced=true` : ''}`, { headers: {Authorization: localStorage.getItem('auth')} })
    .then(response => {
      if(response.status !== 200) {
        throw `${response.status}: ${response.statusText}`
      }
      return response.json()
    })
}



export function submitItem (publication) {
  return authorizedFetch(`${apiBaseUrl}/work`, {
    method:'post',
    headers: {Authorization: localStorage.getItem('auth')},
    body: JSON.stringify(publication)
  })
    .then((response) => {
      if(response.status !== 202) {
        throw `${response.status}: ${response.statusText}`
      }
    })
}




export function deleteItem (doi) {
  return authorizedFetch(`${apiBaseUrl}/work?doi=${doi}`, {
    method: 'delete',
    headers: {Authorization: localStorage.getItem('auth')}
  })
}



export function deposit (cartArray) {
  return authorizedFetch(`${apiBaseUrl}/deposit`, {
    method:'post',
    headers: {Authorization: localStorage.getItem('auth')},
    body: JSON.stringify({
      message: cartArray
    })
  })
    .then(result => {
      if(result.status > 202) throw `Server Error ${result.status}: ${result.statusText}`
      return result.json()
    })
}




export function getDepositHistory (params) {
  return authorizedFetch(withQuery(`${apiBaseUrl}/history`, params), {
    headers: {Authorization: localStorage.getItem('auth')}
  })
    .then(depositHistory => depositHistory.json())
}