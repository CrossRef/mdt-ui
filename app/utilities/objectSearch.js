const objectSearch = function(object, search, returnVal) {
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

export default objectSearch


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