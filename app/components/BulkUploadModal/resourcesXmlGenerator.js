import csv from 'csvtojson'
import {appendElm,appendAttribute, lowerCaseFirst} from '../../utilities/helpers'

String.prototype.format = function () {
  var a = this;
  for (var k in arguments) {
    a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
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
  "    <depositor_name>webDeposit</depositor_name>\n" +
  "    <email_address>{1}</email_address>\n" +
  "  </depositor>\n</head>\n<body>\n"

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
const funderElems=['<funder_name>','<funder_identifier>','<award_number>']

const f = function (headers, files) {
  console.log(header.format("this is the filename.java", "This is the email@.com"))

  handleReadFiles(files, headers)

}
const cb = function (jsonArrayObj) {
  console.log(jsonArrayObj)
  var doc = new DOMParser().parseFromString('<doi_resources></doi_resources>','text/xml')
  // iterate over the entire list of objects
  var results = jsonArrayObj.map((row) => {
    var xml
    if (row['<funder_name>'])
    {
      xml=getFunderXml(row,doc)
    }

    return xml
  })
  results.filter((item)=>{return !!item}).reduce((doc,item)=>{
    doc.documentElement.append(item)
     return doc},doc)
  
  //console.log(doc)
  console.log(new XMLSerializer().serializeToString(doc).replace(/></g,">\n<"))
}
 
const elemReducer = function (row){
  return function (funderElm,key){
    if (!row[key]||row[key].trim().length<1){
      return funderElm
    }
    var assertion = funderElm.ownerDocument.createElement("fr:assertion")
    assertion.setAttribute("name", key.replace(/[<>]/g,""))
    assertion.textContent = row[key].trim()
    funderElm.appendChild(assertion)
    //appendElm(,row[key],programElm)
    return funderElm
  }
}
function getFunderXml(row,doc)
{
  var funderElm = doc.createElement('fundref_data')
  
  var doiElm=doc.createElement('DOI')
  doiElm.textContent=row.DOI.trim()
  funderElm.appendChild(doiElm)
  var programElm = doc.createElementNS("http://www.crossref.org/fundref.xsd", "fr:program")
  programElm.setAttribute("name", "fundref")

  funderElm.appendChild(
    funderElems.filter((item)=>Object.keys(row).indexOf(item)>-1) // only process keys for funders
      .reduce(elemReducer(row),programElm) ) // for all key/vals inrow accumulate result in programElm 
  return funderElm
}
function getLicenseXml(row,doc)
{
  var funderElm = doc.createElement('fundref_data')
  return funderElems.filter((item)=>Object.keys(row).indexOf(item)>-1).reduce(elemReducer(row),funderElm)  
}


function handleReadFiles(files, headers) {
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
            cb(jsonObj)
          })
      }
      const res = reader.readAsText(files[0])
      return res
      //csv.fs.createReadStream(files[0])      
    }
  }
}



export default f
module.exports.f = f