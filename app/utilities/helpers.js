import React from 'react'
import $ from 'jquery'
var ObjTree = require('xml-objtree')

import {exposedStore} from '../store'
import {controlModal} from '../actions/application'
import * as api from '../actions/api'







export function appendElm(elmName, val, appendToElm) {
  var el = null
  if (appendToElm && val && (val.trim().length )) {
    el = appendToElm.ownerDocument.createElement(elmName)
    el.textContent = val.trim()
    appendToElm.appendChild(el)
  }
  return el
}


export function appendAttribute(attrName, val, appendToElm) {
  if (appendToElm && val && val.trim().length ) appendToElm.setAttribute(attrName, val.trim())
}








export function recordTitle (type, title) {
  if(type === 'issue') {
    return `${title.volume ? `Volume ${title.volume}` : ''}${title.volume && title.issue ? ', ' : ''}${title.issue ? `Issue ${title.issue}` : ''}`
  } else {
    return title.title
  }
}




export function doiEntered (doi, ownerPrefix) {
  return doi.length > `${ownerPrefix}/`.length
}

export function urlEntered (url) {
  return !!url && url.length > 'http://'.length
}

export function isDOI (doi) {
  var re = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i
  return re.test(doi)
}

export function isURL (url) {
  var re = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
  return re.test(url)
}







export async function asyncCheckDupeDoi (doi) {
  try {
    await api.getItem(doi)
    return true
  } catch (e) {
    return false
  }
}






export function compareDois (doi1, doi2) {
  if(typeof doi1 !== 'string' || typeof doi2 !== 'string') {
    return false
  } else {
    return doi1.toLowerCase() === doi2.toLowerCase()
  }
}




export function pascaleCase (name) {
  if (name) {
    var arr, i, l;
    arr = String(name).split(/\s|_/);

    i = 0;
    l = arr.length;

    while (i < l) {
      arr[i] = arr[i].substr(0, 1).toUpperCase() + (arr[i].length > 1 ? arr[i].substr(1).toLowerCase() : '');
      i++;
    }

    return arr.join(' ');
  } else {
    return name;
  }
}






export function lowerCaseFirst (string) {
  return string.charAt(0).toLowerCase() + string.slice(1)
}







export function xmldoc (content) {
  const objTree = new ObjTree();
  const json = objTree.parseXML(content)
  return json
}



//This helper returns a thenable object that will run its then callback at the end of the current event loop.
//This guarantees that the callback will come after any UI updates that have already been scheduled by React
export function finishUpdate () {
  return Promise.resolve()
}





export class DeferredTask {
  constructor () {
    this.promise = new Promise((resolve, reject) => {

      this.reject = reject

      this.resolve = resolve
    })
  }
}







export function cleanObj(obj) {
  for (var propName in obj) {
    if (obj[propName] === null || (typeof obj[propName] === undefined)) {
      delete obj[propName];
    }
  }

  return obj
}







export function objectSearch (object, search, returnVal) {
  var r = undefined
  if ((returnVal) || (returnVal === '')){
    r = returnVal
  }
  Object.keys(object).some(function (k) {
    if (object[k]) {
      if (k === search) {
        r = object[k]
        return true
      }
      if (typeof object[k] === 'object') {
        r = objectSearch(object[k], search)
        return !!r
      }
    }
  });
  return r;
}




export function objectFind (object, finder) {
  let result = undefined
  for (let key in object) {
    try {
      if(finder(object[key])) {
        return object[key]
      }
      if(typeof object[key] === 'object') {
        result = objectFind(object[key], finder)
        if(result !== undefined) return result
      }
    } catch (e) {
      console.error('Error in objectFind', e)
    }
  }

  return result
}



export function objectFindAll (object, finder) {
  let result = []
  for (let key in object) {
    try {

      if(finder(object[key])) {
        result.push(object[key])
      }
      if(typeof object[key] === 'object') {
        result = [...result, ...objectFindAll(object[key], finder)]
      }

    } catch(e) {
      console.error('Error in objectFindAll', e)
    }
  }

  return result
}






export class SearchableRecords {
  constructor (records) {
    Object.assign(this, records)

    Object.defineProperties(this, {
      'find': {
        enumberable: false,
        value: (finder) => {
          return objectFind(this, finder)
        }
      },

      'findAll': {
        enumberable: false,
        value: (finder) => {
          return objectFindAll(this, finder)
        }
      },

      'searchByKey': {
        enumberable: false,
        value: (key) => {
          return objectSearch(this, key)
        }
      }
    })
  }
}






export function removeDuplicates(a) {
  var seen = {}
  var out = []
  var j = 0
  for(let i in a) {
    var item = a[i]
    if(seen[item] !== 1) {
      seen[item] = 1
      out[j++] = item
    }
  }
  return out
}







export const errorHandler = (errorString, error, overideModal) => {
  console.error('Error Handler: ', error || errorString)

  if(overideModal || !exposedStore.getState().modal.showModal) {
    exposedStore.dispatch(controlModal({
      showModal: true,
      title: errorString.toString(),
      style: 'errorModal',
      Component: ()=>null
    }))
  } else {
    console.warn('Error Handler: Modal already open, cancelled Modal message. See error above.')
  }
  return finishUpdate()
}








export function getTooltipPosition () {
  const infoFlag = $('.infoFlag')
  const isDate = $('.infoFlagDate').length
  const switchLicense = $('.switchLicense').first()

  let bubblePosition
  try {
    bubblePosition =
      ((infoFlag.offset().top + (infoFlag.position().top - (infoFlag.position().top * .9))
      - (switchLicense.position().top + 15) - (switchLicense.offset().top + 15)))
  } catch (e) {
    bubblePosition = false
  }

  if(isDate) bubblePosition -= 35

  return bubblePosition
}






if(Array.prototype.equals)
  console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.")

Object.defineProperty(Array.prototype, "equals", {
  enumerable: false,
  value: function (array) {
    if (!array)
      return false;

    // compare lengths - can save a lot of time
    if (this.length !== array.length)
      return false;

    for (let i in this) {
      if (this[i] !== array[i]) {
        return false;
      }
    }
    return true;
  }
});






export function escapeString (s) {
  let stringified = JSON.stringify(s)
  return stringified.slice(1, stringified.length - 1) //Removes quotations that stringify adds
}




export function validDate ( yearfield, monthfield, dayfield ){
  yearfield = parseInt(yearfield); monthfield = parseInt(monthfield); dayfield = parseInt(dayfield);
  if (!dayfield || !monthfield || !yearfield){
    return true;
  }
  // we have a year, month and day.
  const dayobj = new Date(yearfield, monthfield-1, dayfield)

  if ((dayobj.getMonth()+1 !== monthfield)||(dayobj.getDate() !== dayfield)||(dayobj.getFullYear() !== yearfield)) return false

  return true;
}

