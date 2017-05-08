var ObjTree = require('xml-objtree')

let store = null

const wrappedXmlDoc = function (content) {
    const objTree = new ObjTree();
    const json = objTree.parseXML(content)
    return json
}

wrappedXmlDoc.registerStore = function (storeRef) {
  store = storeRef
}

export default wrappedXmlDoc