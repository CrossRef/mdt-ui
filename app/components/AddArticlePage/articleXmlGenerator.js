import _ from 'lodash'
import moment from 'moment'
import { XMLSerializer, DOMParser } from 'xmldom'

import { getSubItems } from '../../utilities/getSubItems'
import { cardNames, registryDois } from '../../utilities/crossmarkHelpers'
import {appendElm,appendAttribute, lowerCaseFirst} from '../../utilities/helpers'
const { pubHist, peer, copyright, supp, clinical, other, update } = cardNames



export default function (state, reduxForm) {
  const article = state.article
  const onlineYear = article.onlineDateYear, onlineMonth = article.onlineDateMonth, onlineDay = article.onlineDateDay,
    printYear = article.printDateYear, printMonth = article.printDateMonth, printDay = article.printDateDay
  const language = state.addInfo.language


  var doc = new DOMParser().parseFromString('<journal_article></journal_article>','text/xml')

  appendAttribute("language",language,doc.documentElement)

  var el = doc.createElement("titles")
  appendElm("title",article.title,el)
  appendElm("subtitle",article.subtitle,el)

  appendElm("original_language_title",article.originallanguagetitle,el)
  appendElm("subtitle",article.originallanguagetitlesubtitle,el)
  doc.documentElement.appendChild(el)

  appendContributorElm(doc.documentElement)
  if (article.abstract.trim().length > 0) {
    el = doc.createElementNS('http://www.ncbi.nlm.nih.gov/JATS1', 'jats:abstract')
    var el2 = doc.createElement('jats:p')
    el2.textContent = article.abstract.trim()
    el.appendChild(el2)
    doc.documentElement.appendChild(el)
  }
  if (onlineYear || onlineMonth || onlineDay) {
    el = doc.createElement('publication_date')
    el.setAttribute('media_type', 'online')
    appendElm("month", onlineMonth, el)
    appendElm("day", onlineDay, el)
    appendElm("year", onlineYear, el)
    doc.documentElement.appendChild(el)
  }
  if (printYear || printMonth || printDay) {
    el = doc.createElement('publication_date')
    el.setAttribute('media_type', 'print')
    appendElm("month", printMonth, el)
    appendElm("day", printDay, el)
    appendElm("year", printYear, el)
    doc.documentElement.appendChild(el)
  }
  appendPagesXML(doc.documentElement)
  appendPublisherItems(doc.documentElement)
  appendCrossmarkXml(doc.documentElement)
  appendRelatedItemsElm(doc.documentElement)
  if (state.addInfo.archiveLocation.trim().length && state.addInfo.archiveLocation !== 'N/A') {
    el = doc.createElement('archive_locations')
    el2 = doc.createElement("archive")
    el2.setAttribute("name", state.addInfo.archiveLocation)
    el.appendChild(el2)
    doc.documentElement.appendChild(el)
  }
  el = doc.createElement("doi_data")
  el2 = doc.createElement("doi")
  el2.textContent = article.doi
  el.appendChild(el2)
  el2 = doc.createElement("resource")
  el2.textContent = article.url
  el.appendChild(el2)
  appendCollectionXML(el)
  doc.documentElement.appendChild(el)

  //citation list
  if(state.references && state.references.length) {
    el = doc.createElement("citation_list")
    state.references.forEach( (reference, i) => {
      el2 = doc.createElement("citation")
      el2.setAttribute("key", `ref${i}`)
      let el3
      if(reference.matchValuation > 60 && reference.DOI) {
        el3 = doc.createElement("doi")
        el3.textContent = reference.DOI
        el2.appendChild(el3)
      }

      el3 = doc.createElement("unstructured_citation")
      el3.textContent = reference.reference
      el2.appendChild(el3)
      el.appendChild(el2)
      doc.documentElement.appendChild(el)
    })
  }

  return doc

  function appendContributorElm(root) {
    var contributors = getSubItems(state.contributors)
    if (contributors.length == 0) return
    const contElm = root.ownerDocument.createElement("contributors")

    for (var i in contributors) {
      const contributor = contributors[i]
      //var attributes=_.filter( Object.keys(contributor),(key)=>{return  (contributor[key] && typeof contributor[key] === 'string' && contributor[key].trim().length>0)})
      if ((contributor.groupAuthorName && contributor.groupAuthorName.trim().length) || (contributor.groupAuthorRole && contributor.groupAuthorRole.trim().length)) {
        const orgElm = root.ownerDocument.createElement("organization")
        orgElm.setAttribute("sequence", i == 0 ? "first" : "additional")
        appendAttribute("contributor_role", contributor.groupAuthorRole, orgElm)
        orgElm.textContent = contributor.groupAuthorName
        contElm.appendChild(orgElm)
      } else {
        const personElm = root.ownerDocument.createElement("person_name")
        personElm.setAttribute("sequence", i == 0 ? "first" : "additional")
        appendAttribute("contributor_role", contributor.role, personElm)
        appendElm("given_name", contributor.firstName, personElm)
        appendElm("surname", contributor.lastName, personElm)
        appendElm("suffix", contributor.suffix, personElm)
        appendElm("affiliation", contributor.affiliation, personElm)
        appendElm("ORCID", contributor.orcid, personElm)
        contElm.appendChild(personElm)
      }
    }
    root.appendChild(contElm)
  }
  function appendFunder(el) {
    var funders = getSubItems(state.funding)
    if(!funders || !funders.length)return
    var programElm = el.ownerDocument.createElementNS("http://www.crossref.org/fundref.xsd", "fr:program")

    for (let funder of funders) {
      var funderName
      if (funder.funderName) {
        funderName = funder.funderName.trim().length > 0 ? funder.funderName : undefined
      }
      var nameElm
      if (funderName) {
        nameElm = el.ownerDocument.createElement("fr:assertion")
        nameElm.setAttribute("name", "funder_name")
        nameElm.textContent = funderName
      }
      var funder_identifier
      if (funder.funder_identifier) {
        funder_identifier = funder.funder_identifier.trim().length > 0 ? funder.funder_identifier : undefined
      }
      var identElm
      if (funder_identifier) {
        identElm = el.ownerDocument.createElement("fr:assertion")
        identElm.setAttribute("name", "funder_identifier")
        identElm.textContent = funder_identifier
      }
      var grantNumbers = _.filter(funder.grantNumbers, (awardNumber) => {
        return (awardNumber && awardNumber.trim())
      })
      var fundGroupElm
      // not needed now, but might want to not have a fundgroup
      if (funder_identifier || funderName || grantNumbers.length) {
        fundGroupElm = el.ownerDocument.createElement("fr:assertion")
        fundGroupElm.setAttribute("name", "fundgroup")
      } else {
        fundGroupElm = programElm
      }
      var identParent=fundGroupElm
      if (funderName) {
        fundGroupElm.appendChild(nameElm)
        identParent=nameElm
      }

      if (funder_identifier) {
        identParent.appendChild(identElm)
      }

      for (let grant of grantNumbers) {
        const grantElm = appendElm("fr:assertion", grant, fundGroupElm)
        grantElm.setAttribute("name", "award_number")
      }
      programElm.appendChild(fundGroupElm)
    }
    el.appendChild(programElm)

  }
  function appendLicenseElm(root) {
    var licenses = getSubItems(state.license)
    if (!licenses || !licenses.length) {
      return
    }
    var licElm = root.ownerDocument.createElementNS("http://www.crossref.org/AccessIndicators.xsd", "ai:program")
    licElm.setAttribute("name", "AccessIndicators")

    for (var i in licenses) {
      var license = licenses[i]
      const year = license.acceptedDateYear, month = license.acceptedDateMonth, day = license.acceptedDateDay

      const dayHolder = []
      if (year) {
        dayHolder.push(year)
      }
      if (month) {

        dayHolder.push(month.length < 2 ? `0${month}` : month)
      }
      if (day) {
        dayHolder.push(day.length < 2 ? `0${day}` : day)
      }
      var el
      const isDate = dayHolder.length > 0
      if (isDate || license.licenseurl || license.appliesto) {
        const date = isDate ? dayHolder.join('-') : ''
        if (i == 0 && article.freetolicense === 'yes') {
          el = root.ownerDocument.createElement("ai:free_to_read")
          appendAttribute("start_date", date, el)
          licElm.appendChild(el)
        }
        el = appendElm("ai:license_ref",license.licenseurl,licElm)
        appendAttribute("applies_to", license.appliesto, el)
        appendAttribute("start_date", date, el)
      }
    }
    root.appendChild(licElm)
  }
  function appendRelatedItemsElm(root) {
    const relatedItems = getSubItems(state.relatedItems)
    if (!relatedItems || !relatedItems.length) {
      return
    }
    const relProgramElm = root.ownerDocument.createElementNS("http://www.crossref.org/relations.xsd", "program")
    appendAttribute("name","relations",relProgramElm)
    for (var item of relatedItems) {
      const { description, relationType, identifierType, relatedItemIdentifier } = item
      var interRelElm
      const relItemElm = root.ownerDocument.createElement("related_item")
      appendElm("description", description, relItemElm)
      relProgramElm.appendChild(relItemElm)

      if (relationType || identifierType || relatedItemIdentifier) {
        interRelElm = root.ownerDocument.createElement("inter_work_relation")
        appendAttribute("relationship-type", relationType, interRelElm)
        appendAttribute("identifier-type", identifierType, interRelElm)
        interRelElm.textContent = relatedItemIdentifier
        relItemElm.appendChild(interRelElm)
      }
    }
    root.appendChild(relProgramElm)
  }
  function appendCollectionXML(el) {
    if (state.addInfo.similarityCheckURL === 'http://' || state.addInfo.similarityCheckURL.trim().length === 0) {
      return
    }
    const colElm = el.ownerDocument.createElement("collection")
    colElm.setAttribute("property", "crawler-based")
    const itemElm = el.ownerDocument.createElement("item")
    itemElm.setAttribute("crawler", "iParadigms")
    const resElm = el.ownerDocument.createElement("resource")
    resElm.textContent = state.addInfo.similarityCheckURL
    itemElm.appendChild(resElm)
    colElm.appendChild(itemElm)
    el.appendChild(colElm)
  }

  function appendPagesXML(rootElem) {
    if ((article.firstPage.trim().length > 0) || (article.lastPage.trim().length > 0)) {
      const pagesElm = rootElem.ownerDocument.createElement('pages')
      appendElm("first_page", article.firstPage, pagesElm)
      appendElm("last_page", article.lastPage, pagesElm)

      rootElem.appendChild(pagesElm)
    }
  }

  function appendPublisherItems(rootElem) {
    if (article.locationId.trim().length > 0) {
      var el = rootElem.ownerDocument.createElement("publisher_item")
      var el2 = appendElm("item_number", article.locationId.trim(), el)
      el2.setAttribute("item_number_type", "article_number")
      rootElem.appendChild(el)
    }
  }
  function appendCrossmarkXml(rootElem) {
    const JSform = reduxForm.toJS()
    const crossmarkForm = {}
    if (getSubItems(JSform[pubHist]).length) crossmarkForm[pubHist] = getSubItems(JSform[pubHist])
    if (getSubItems(JSform[peer]).length) crossmarkForm[peer] = getSubItems(JSform[peer])
    if (getSubItems(JSform[copyright]).length) crossmarkForm[copyright] = getSubItems(JSform[copyright])
    if (getSubItems(JSform[supp]).length) crossmarkForm[supp] = getSubItems(JSform[supp])
    if (getSubItems(JSform[other]).length) crossmarkForm[other] = getSubItems(JSform[other])
    if (getSubItems(JSform[clinical]).length) crossmarkForm[clinical] = getSubItems(JSform[clinical])
    if (getSubItems(JSform[update]).length) crossmarkForm[update] = getSubItems(JSform[update])

    const size = Object.keys(crossmarkForm).length

    if (!size) {
      // no crossmark, but do funders and license ref
      appendFunder(rootElem)
      appendLicenseElm(rootElem)
      return
    }
    var crossmarkElm = rootElem.ownerDocument.createElement("crossmark")
    rootElem.appendChild(crossmarkElm)
    var el = rootElem.ownerDocument.createElement("crossmark_policy")
    el.textContent = state.ownerPrefix + "/something"
    crossmarkElm.appendChild(el)
    el = rootElem.ownerDocument.createElement("crossmark_domains")  //TEMPORARY, Crossref team said they will be removing this requirement
    el2 = rootElem.ownerDocument.createElement("crossmark_domain")
    el.appendChild(el2)
    crossmarkElm.appendChild(el)
    el = rootElem.ownerDocument.createElement("domain")
    el.textContent = "psychoceramics.labs.crossref.org"
    el2.appendChild(el)
    appendUpdate(crossmarkElm, crossmarkForm[update])
    if (!crossmarkForm[update] || size > 1) {
      el = rootElem.ownerDocument.createElement("custom_metadata")
      appendOther(el, crossmarkForm[other])
      appendPubHist(el, crossmarkForm[pubHist])
      appendPeer(el, crossmarkForm[peer])
      appendSupp(el, crossmarkForm[supp])
      appendCopyright(el, crossmarkForm[copyright])
      appendClinical(el, crossmarkForm[clinical])
      appendFunder(el)
      appendLicenseElm(el)
      crossmarkElm.appendChild(el)
    }
  }

  function appendUpdate(el, card) {
    if (!card || ! Object.keys(card).length)
    return

    var elm = el.ownerDocument.createElement("updates")
    el.appendChild(elm)
    for (let number in card) {
      const { type, doi, day, month, year } = card[number]
      var el2 =  elm.ownerDocument.createElement("update")
      if(doi) el2.textContent = doi
      if(type) appendAttribute("type",type.toLowerCase().replace(/\s+/g, '_'),el2)
      
      if(year || month || day){
        appendAttribute("date", `${year || ''}-${month?month.length < 2 ? `0${month}` : month: ''}-${day?day.length < 2 ? `0${day}` : day: ''}` ,el2)
      }
      elm.appendChild(el2)
    }
  }
  function appendOther(el, card) {
    for (let number in card) {
      const { label, explanation, href } = card[number]
      var elm = el.ownerDocument.createElement("assertion")
      if (label) {
        elm.setAttribute("name", label.toLowerCase().replace(/\s+/g, '_'))
        elm.setAttribute("label", label)
      }
      if (explanation) elm.setAttribute("explanation", explanation)
      if (href) elm.setAttribute("href", href)
      if (number) elm.setAttribute("order", number)
      el.appendChild(elm)
    }
  }
  function appendPeer(el, card) {
    for (let number in card) {
      const { label, explanation, href } = card[number]
      var elm = el.ownerDocument.createElement("assertion")

      if (label) {
        elm.setAttribute("name", label.toLowerCase().replace(/\s+/g, '_'))
        elm.setAttribute("label", label)
      }
      elm.setAttribute("group_name", "peer_review")
      elm.setAttribute("group_label", "Peer review")
      if (explanation) elm.setAttribute("explanation", explanation)
      if (href) elm.setAttribute("href", href)
      if (number) elm.setAttribute("order", number)
      el.appendChild(elm)
    }
  }
  function appendPubHist(el, card) {
    for (let number in card) {
      const { label, day, month, year } = card[number]
      var elm = el.ownerDocument.createElement("assertion")
      if (label) {
        elm.setAttribute("name", label.toLowerCase().replace(/\s+/g, '_'))
        elm.setAttribute("label", label)
      }
      elm.setAttribute("group_name", "publication_history")
      elm.setAttribute("group_label", "Publication History")
      elm.setAttribute("order", number)
      if (year || month || day) elm.textContent = `${year || ''}-${month || ''}-${day || ''}`
      el.appendChild(elm)
    }
  }
  function appendSupp(el, card) {
    for (let number in card) {
      const { explanation, href } = card[number]
      var elm = el.ownerDocument.createElement("assertion")
      elm.setAttribute("name", "supplementary_Material")
      elm.setAttribute("label", "Supplementary Material")
      if (explanation) elm.setAttribute("explanation", explanation)
      if (href) elm.setAttribute("href", href)
      if (number) elm.setAttribute("order", number)
      el.appendChild(elm)
    }
  }
  function appendCopyright(el, card) {
    for (let number in card) {
      const { label, explanation, href } = card[number]
      var elm = el.ownerDocument.createElement("assertion")
      elm.setAttribute("group_name", "copyright_licensing")
      elm.setAttribute("group_label", "Copyright & Licensing")
      if (label) elm.setAttribute("label", label)
      if (explanation) elm.setAttribute("explanation", explanation)
      if (href) elm.setAttribute("href", href)
      if (number) elm.setAttribute("order", number)
      if (label === 'Copyright Statement') {
        elm.setAttribute("name", "copyright_statement")
      } else if (label === 'Licensing Information') {
        elm.setAttribute("name", "licensing")
      }
      el.appendChild(elm)
    }
  }

  function appendClinical(el, card) {
    const elm = el.ownerDocument.createElementNS("http://www.crossref.org/clinicaltrials.xsd", "program")
    el.appendChild(elm)
    for (let number in card) {
      const { registry, trialNumber, type } = card[number]
      var el2 = elm.ownerDocument.createElement("clinical-trial-number")
      if(trialNumber) el2.textContent = trialNumber
      if(registry) el2.setAttribute("registry", registryDois[registry])
      if(type) appendAttribute("type", lowerCaseFirst(type).replace(/-/g, ''),el2)
      elm.appendChild(el2)
    }
  }
}


