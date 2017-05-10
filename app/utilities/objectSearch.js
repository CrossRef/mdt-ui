let store = null

const objectSearch = function(object, search, returnVal) {
    var r = undefined
    if (returnVal) {
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


const wrappedObjectSearch = function (object, search) {
    return objectSearch(object, search)
}

wrappedObjectSearch.registerStore = function (storeRef) {
  store = storeRef
}

export default wrappedObjectSearch