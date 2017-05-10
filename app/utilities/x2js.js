var x2Js = require('x2js')

let store = null

const wrappedJSONtoXML = function (content) {
    const x2js = new x2Js();
    const xml = x2js.js2xml(content)
    return xml
}

wrappedJSONtoXML.registerStore = function (storeRef) {
  store = storeRef
}

export default wrappedJSONtoXML