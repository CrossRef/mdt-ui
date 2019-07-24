import csv from 'csvtojson'
import { XMLSerializer, DOMParser } from 'xmldom'
import {appendElm} from '../../utilities/helpers'
var exports = module.exports = {}
function format (a,...args) { 
  for (var k in args) {
    a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), args[k]);
  }
  return a
}

const header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
  "<doi_batch version=\"4.3.5\" xmlns=\"http://www.crossref.org/doi_resources_schema/4.3.5\" " +
  "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
  "xsi:schemaLocation=\"http://www.crossref.org/doi_resources_schema/4.3.5  " +
  "http://doi.crossref.org/schemas/doi_resources4.3.5.xsd\" " +
  "xmlns:ai=\"http://www.crossref.org/AccessIndicators.xsd\" " +
  "xmlns:fr=\"http://www.crossref.org/fundref.xsd\">\n<head>\n  <doi_batch_id>{0}</doi_batch_id>\n" +
  "  <depositor>\n" +
  "    <depositor_name>mdtDeposit</depositor_name>\n" +
  "    <email_address>{1}</email_address>\n" +
  "  </depositor>\n</head>\n"

/*
<am_lic_start_date>: "2011-11-21"
<award_number>: ""
<funder_identifier>: "http://dx.doi.org/10.13039/100000050"
<funder_name>: "National Heart Lung and Blood Institute"
<license_ref applies_to="am">: "http://www.abcpublishing.org/licenses/default--license"
<license_ref applies_to="tdm">: "http://creativecommons.org/licenses/by-nc/3.0"
<license_ref applies_to="vor">: "http://creativecommons.org/licenses/by-nc/3.0"
<resource content_version="am" mime_type="application/pdf>: "http://www.abcpublishing.orgcontent/40/2/e13.full.pdf"
<resource content_version="am">: "http://www.abcpublishing.orgcontent/40/2/e13.full.pdf"
<resource content_version="vor" mime_type="application/html">: "http://www.abcpublishing.orgcontent/40/2/e13.full.html"
<resource content_version="vor">: "http://www.abcpublishing.orgcontent/40/2/e13.full.html"
<resource mime_type="application/html">: "http://www.abcpublishing.orgcontent/40/2/e13.full.html"
<tdm_lic_start_date>: "2011-11-21"
<vor_lic_start_date>: "2011-11-21"
DOI: "10.5555/nar/gkr1016"

{"DOI":"10.5555/nar/gkr1016","<funder_name>":"National Heart Lung and Blood Institute","<funder_identifier>":"http://dx.doi.org/10.13039/100000050","<award_number>":"","<license_ref applies_to=\"vor\">":"http://creativecommons.org/licenses/by-nc/3.0","<vor_lic_start_date>":"2011-11-21","<license_ref applies_to=\"am\">":"http://www.abcpublishing.org/licenses/default--license","<am_lic_start_date>":"2011-11-21","<license_ref applies_to=\"tdm\">":"http://creativecommons.org/licenses/by-nc/3.0","<tdm_lic_start_date>":"2011-11-21","<resource content_version=\"vor\">":"http://www.abcpublishing.orgcontent/40/2/e13.full.html","<resource content_version=\"vor\" mime_type=\"application/html\">":"http://www.abcpublishing.orgcontent/40/2/e13.full.html","<resource content_version=\"am\">":"http://www.abcpublishing.orgcontent/40/2/e13.full.pdf","<resource content_version=\"am\" mime_type=\"application/pdf>":"http://www.abcpublishing.orgcontent/40/2/e13.full.pdf","<resource mime_type=\"application/html\">":"http://www.abcpublishing.orgcontent/40/2/e13.full.html"}

*/

/*
takes a parsed csv object and generates a deposit standard XML
*/
const funderElems = ['<funder_name>', '<funder_identifier>']
//, '<award_number>'
function f(headers, files) {
  console.log(format(header,"this is the filename.java", "creftest@crossref.org"))
  handleReadFiles(files, headers)
}
  function mainProcessorCb(jsonArrayObj , onComplete) {
  // iterate over the entire list of objects  
  var doc = getDoiObjects(jsonArrayObj)
  var result = format(header,"this is the filename.java", "creftest@crossref.org") +
    new XMLSerializer().serializeToString(doc).replace(/></g, ">\n<") +
    "</doi_batch>"
  if (onComplete){
    onComplete(result)
  }
  console.log(result)
  //console.log(doc)
  //console.log(new XMLSerializer().serializeToString(doc).replace(/></g,">\n<"))
}

const elemReducer = function (row) {
  return function (funderElm, key) {
    if (!row[key] || row[key].trim().length < 1) {
      return funderElm
    }

    var assertion = makeAssertionElem(funderElm, key, row[key])
    /*funderElm.ownerDocument.createElement("fr:assertion")
    assertion.setAttribute("name", key.replace(/[<>]/g, ""))
    assertion.textContent = row[key].trim()
    funderElm.appendChild(assertion)*/
    //appendElm(,row[key],programElm)
    return assertion
  }
}

function getFunderXml(row, doc) {
  var funderElm = doc.createElement('fundref_data')

  var doiElm = doc.createElement('DOI')
  doiElm.textContent = row.DOI.trim()
  funderElm.appendChild(doiElm)
  var programElm = doc.createElementNS("http://www.crossref.org/fundref.xsd", "fr:program")
  programElm.setAttribute("name", "fundref")


  funderElems.filter((item) => Object.keys(row).indexOf(item) > -1) // only process keys for funders
    .reduce(elemReducer(row), programElm) // for all key/vals inrow accumulate result in programElm 
  return funderElm
}

function getLicenseXml(row, doc) {
  var funderElm = doc.createElement('fundref_data')
  return funderElems.filter((item) => Object.keys(row).indexOf(item) > -1).reduce(elemReducer(row), funderElm)
}
// create aggregated by DOI funders doi resources xml
function getXmlForFunders(doiMap) {
  var funderElm = doc.createElement('fundref_data')

  var doiElm = doc.createElement('DOI')
  doiElm.textContent = row.DOI.trim()
  funderElm.appendChild(doiElm)

}

function awardReducer(fundingMap, item) {
  var data = []
  if (fundingMap.get(item["<award_number>"])) {
    data = fundingMap.get(item["<award_number>"])
  }
  data.push(item)
  fundingMap.set(item["<award_number>"], data)
  return fundingMap
}

function makeAssertionElem(doc, name, val) {
  var assertion = doc.ownerDocument.createElement("fr:assertion")
  assertion.setAttribute("name", name.replace(/[<>]/g, ""))
  if (val) {
    assertion.textContent = val.trim()
  }
  doc.appendChild(assertion)
  return assertion
}

function getFundingElem(row, group) {
  var nameElm = makeAssertionElem(group, "<funder_name>", row["<funder_name>"])
  var idElm = makeAssertionElem(group, "<funder_identifier>", row["<funder_identifier>"])
  if (idElm.textContent.length < 1 && nameElm.textContent.length < 1) {
    return
  }
  if (nameElm.textContent.length > 0 && idElm.textContent.length > 0) {
    nameElm.appendChild(idElm)
  } else {
    nameElm = idElm
  }
  // name elem will either be or contain the id if it exists. If neither exists, we 
  // have have returned already.
  group.appendChild(nameElm)
}
const awardCb = function (doc) {
  return function (itemArray, award) {
    var group = doc

    if (award && award.length > 0) {
      group = makeAssertionElem(doc, "fundgroup")
      makeAssertionElem(group, "award_number", award)
    }
    itemArray.map(row => {
      return getFundingElem(row, group)
    }) // for all key/vals inrow accumulate result in programElm 
    //doc.appendChild(group)
  }
}

function aggregateByAward(fundingArray, programElm) {
  var awardMap = new Map()
  awardMap = fundingArray.reduce(awardReducer, awardMap)
  awardMap.forEach(awardCb(programElm))
}
/*
  generate funder snippet for each DOI
*/
const generateFundGroupCB = function (doc) {
  return function (itemArray, doi) {
    // only process items with a funder name or identifier
    var funderArray = itemArray.filter((item) => {
      return (item["<funder_name>"].length > 0 || item["<funder_identifier>"].length > 0)
    })
    if (funderArray.length < 1) {
      return null
    }
    var funderElm = doc.createElement('fundref_data')
    appendElm("doi",doi,funderElm)

    var programElm = doc.createElementNS("http://www.crossref.org/fundref.xsd", "fr:program")
    programElm.setAttribute("name", "fundref")

    aggregateByAward(funderArray, programElm)
    funderElm.appendChild(programElm)
    doc.documentElement.appendChild(funderElm)
    /*
        funderArray.map((row) => {
          funderElm.appendChild(
            funderElems.filter((item) => Object.keys(row).indexOf(item) > -1) // only process keys for funders
            .reduce(elemReducer(row), programElm))
        }) // for all key/vals inrow accumulate result in programElm 
        doc.documentElement.appendChild(funderElm)*/
    return funderElm
  }
}
/*
  Aggregate the data by DOI (so that all funding info for a DOI is in one node)
*/
function getDoiObjects(obj) {
  var doiMap = new Map()
  doiMap = obj.reduce(doiReducer, doiMap)
  var doc = new DOMParser().parseFromString('<body></body>', 'text/xml')
  doiMap.forEach(generateFundGroupCB(doc))
  //var doc = getXmlForFunders(doiMap)

  return doc
}
/*
 Populate 'doiMap' by key 'DOI' from within 'item' with value array of 'item's
*/
 function doiReducer (doiMap, item) {
  var data = []
  if (doiMap.get(item.DOI)) {
    data = doiMap.get(item.DOI)
  }
  data.push(item)
  doiMap.set(item.DOI, data)
  return doiMap
}

function handleReadFiles(files, headers, onComplete) {
  //oFiles = document.getElementById("uploadInput").files,
  //nFiles = oFiles.length;    
  if (files) {
    if (files.length > 0) {
      var reader = new FileReader()
      reader.onload = () => {
        console.log("reader onload converting to csv")
        csv({
            flatKeys: true,
            noheader: false,
            headers: headers
          })
          .fromString(reader.result).then((jsonObj) => {
            mainProcessorCb(jsonObj,onComplete)
          })
      }
      const res = reader.readAsText(files[0])
      return res
      //csv.fs.createReadStream(files[0])      
    }
  }
}


exports.doiReducer=doiReducer
exports.getDoiObjects=getDoiObjects
exports.generateFundGroupCB=generateFundGroupCB
exports.aggregateByAward=aggregateByAward
exports.awardReducer=awardReducer
exports.awardCb=awardCb
exports.getFundingElem=getFundingElem
exports.makeAssertionElem=makeAssertionElem
exports.elemReducer=elemReducer
exports.handleReadFiles=handleReadFiles
exports.mainProcessorCb=mainProcessorCb
