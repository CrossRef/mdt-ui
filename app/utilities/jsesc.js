const jsesc = require('jsesc')

let store = null

const wrappedJSesc = function (str) {
  return jsesc(str, {'json': true, 'wrap' : false})
}

wrappedJSesc.registerStore = function (storeRef) {
  store = storeRef
}

export default wrappedJSesc