import fetch from './fetch'
import _ from 'lodash'

function isValidDOI (doi) {
  var re = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i
  return re.test(doi)
}

function dupCheck (doi) {
  if(doi) {
    if (doi.length > 0) {
      if (isValidDOI(doi)) {
        return Promise.resolve(fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${doi}`, { headers: {Authorization: localStorage.getItem('auth')} })
        .then((data) => {return data.status === 200}))
      } else {
        return (false, false)
      }
    } else {
      return false
    }
  } else {
    return false
  }
}

const checkDupeDOI = function (doi, callback) {
  //doi can be an array of doi's
  if(Array.isArray(doi)){
      var promises = []
      _.each(doi, (each_doi) => {
        promises.push(dupCheck(each_doi))
      })
      return Promise.all(promises).then(
        (isDupe) => {
          callback(isDupe)
        }
      )
  } else {
    return Promise.resolve(dupCheck(doi)).then((isDupe) => callback(isDupe))
  }

}

export default checkDupeDOI