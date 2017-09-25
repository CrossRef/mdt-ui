import React from 'react'
const jsesc = require('jsesc')
var ObjTree = require('xml-objtree')
import $ from 'jquery'




export function refreshErrorBubble () {
  var firstError = $(".fieldError").first()
  if (firstError.length > 0) {
    $('.fullError').show()
    $('.fullError').find('.tooltips').css({
      'top': ((firstError.offset().top + (firstError.position().top - (firstError.position().top * .9)) - ($('.switchLicense').first().position().top + 15) - ($('.switchLicense').first().offset().top + 15))) + 25
    })
  } else {
    $('.fullError').hide()
  }
}





export function isDOI (doi) {
  var re = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i
  return re.test(doi)
}






export function isURL (url) {
  var re = /^(?:(ftp|http|https)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
  return re.test(url)
}






export async function asyncCheckDupeDoi (doi) {
  const response = await authorizedFetch(`${apiBaseUrl}/work?doi=${doi}`, { headers: {Authorization: localStorage.getItem('auth')} })
  return response.status === 200
}






export function compareDois (doi1, doi2) {
  if(typeof doi1 !== 'string' || typeof doi2 !== 'string') {
    return false
  } else {
    return doi1.toLowerCase() === doi2.toLowerCase()
  }
}






export function jsEscape (str) {
  return jsesc(str, {'json': true, 'wrap' : false})
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







export function xmldoc (content) {
  const objTree = new ObjTree();
  const json = objTree.parseXML(content)
  return json
}







export class Deferred {
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
    if(finder(object[key])) {
      return object[key]
    }
    if(typeof object[key] === 'object') {
      result = objectFind(object[key], finder)
      if(result !== undefined) return result
    }
  }

  return result
}







export function ClassWrapper ({classNames, children}) {
  const Reducer = () => classNames.reduceRight((previousValue, currentValue, index, array) => {
    if (index == array.length - 2) {

      const LastChild = Array.isArray(previousValue) ? (lastChildProps) => React.createElement(previousValue[0], {className: previousValue[1]}, lastChildProps.children)
        : (lastChildProps) => <div className={previousValue}>{lastChildProps.children}</div>

      const NextChild = Array.isArray(currentValue) ? (nextChildProps) => React.createElement(currentValue[0], {className: currentValue[1]}, nextChildProps.children)
        : (nextChildProps) => <div className={currentValue}>{nextChildProps.children}</div>

      return <NextChild><LastChild>{children}</LastChild></NextChild>

    } else {

      const ThisChild = Array.isArray(currentValue) ? (thisChildProps) => React.createElement(currentValue[0], {className: currentValue[1]}, thisChildProps.children)
        : (thisChildProps) => <div className={currentValue}>{thisChildProps.children}</div>

      return <ThisChild>{previousValue}</ThisChild>
    }
  });
  return <Reducer />
}