import _ from 'lodash'
import moment from 'moment'
import xmlent from 'xml-entities'
import { XMLSerializer, DOMParser } from 'xmldom'
import { getSubItems } from '../../utilities/getSubItems'
import { cardNames, registryDois } from '../../utilities/crossmarkHelpers'
const { pubHist, peer, copyright, supp, clinical, other, update } = cardNames



export default function (state, reduxForm) {
  const article = state.article
  const onlineYear = article.onlineDateYear, onlineMonth = article.onlineDateMonth, onlineDay = article.onlineDateDay,
    printYear = article.printDateYear, printMonth = article.printDateMonth, printDay = article.printDateDay
  const language = state.addInfo.language
  const publicationType = state.addInfo.publicationType

  const funderElement = getFunderXML()
  const licenseElement = getLicenseXML()
  const crossmarkElement = state.crossmark ? crossmarkXml() : ''
  var doc = new DOMParser().parseFromString('<journal_article></journal_article>')
  if (language.size > 0) {
    doc.documentElement.setAttribute('language', language)
  }

  if (publicationType.length > 0) {
    doc.documentElement.setAttribute('publication_type', publicationType)
  }
  var el = doc.createElement("titles")
  if (article.title.length > 0) {
    var el2 = doc.createElement("title")

    el2.textContent = article.title.trim()
    el.appendChild(el2)
  }
  if (article.subtitle.length > 0) {
    var el2 = doc.createElement(`subtitle`)
    el2.textContent = article.subtitle.trim()
    el.appendChild(el2)
  }
  if (article.originallanguagetitlesubtitle.length > 0) {
    var el2 = doc.createElement(`original_language_title`)
    el2.textContent = article.originallanguagetitlesubtitle.trim()
    el.appendChild(el2)
  }
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
    var el2;
    if (onlineMonth.length > 0) {
      el2 = doc.createElement('month')
      el2.textContent = onlineMonth
      el.appendChild(el2)
    }
    if (onlineDay.length > 0) {
      el2 = doc.createElement('day')
      el2.textContent = onlineDay
      el.appendChild(el2)
    }
    if (onlineYear.length > 0) {
      el2 = doc.createElement('year')
      el2.textContent = onlineYear
      el.appendChild(el2)
    }
    doc.documentElement.appendChild(el)
  }
  if (printYear || printMonth || printDay) {
    el = doc.createElement('publication_date')
    el.setAttribute('media_type', 'print')
    var el2;
    if (printMonth.length > 0) {
      el2 = doc.createElement('month')
      el2.textContent = printMonth
      el.appendChild(el2)
    }
    if (printDay.length > 0) {
      el2 = doc.createElement('day')
      el2.textContent = printDay
      el.appendChild(el2)
    }
    if (printYear.length > 0) {
      el2 = doc.createElement('year')
      el2.textContent = printYear
      el.appendChild(el2)
    }
    doc.documentElement.appendChild(el)

    appendPagesXML(doc.documentElement)
    appendPublisherItems(doc.documentElement)
    appendCrossmarkXml(doc.documentElement)
    appendRelatedItemsElm(doc.documentElement)
    if (state.addInfo.archiveLocation.trim().length > 0) {
      el = doc.createElement('archive_locations')
      el2 = doc.createElement("archive")
      el2.setAttribute("name", state.addInfo.archiveLocation)
      el.appendChild(el2)
      doc.appendChild(el)
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
  }
  console.info(new XMLSerializer().serializeToString(doc))

  const array = [
    `<journal_article`,
    `${(language.length > 0) ? ` language="${language}"` : ``}`,
    `${(publicationType.length > 0) ? ` publication_type="${publicationType}"` : ``}`,
    `>`,

    `<titles>`,
    `${article.title.length > 0 ? `<title>` + article.title.trim() + `</title>` : ``}`,
    `${article.subtitle.length > 0 ? `<subtitle>` + article.subtitle.trim() + `</subtitle>` : ``}`,
    `${article.originallanguagetitle.length > 0 ?
      `<original_language_title>` + article.originallanguagetitle.trim() + `</original_language_title>` : ``}`,
    `${article.originallanguagetitlesubtitle.length > 0 ? `<subtitle>` + article.originallanguagetitlesubtitle.trim() + `</subtitle>` : ``}`,
    `</titles>`,

    `${(getContributorXML().length > 0) ? getContributorXML() : ``}`,

    `${(article.abstract.trim().length > 0) ?
      `<jats:abstract xmlns:jats="http://www.ncbi.nlm.nih.gov/JATS1"><jats:p>${article.abstract.trim()}</jats:p></jats:abstract>` : ''}`,

    onlineYear || onlineMonth || onlineDay ? [
      `<publication_date media_type="online">`,
      `${onlineMonth.length > 0 ? `<month>${onlineMonth}</month>` : ``}`,
      `${onlineDay.length > 0 ? `<day>${onlineDay}</day>` : ``}`,
      `${onlineYear.length > 0 ? `<year>${onlineYear}</year>` : ``}`,
      `</publication_date>`
    ].join('') : '',

    printYear || printMonth || printDay ? [
      `<publication_date media_type="print">`,
      `${printMonth.length > 0 ? `<month>${printMonth}</month>` : ``}`,
      `${printDay.length > 0 ? `<day>${printDay}</day>` : ``}`,
      `${printYear.length > 0 ? `<year>${printYear}</year>` : ``}`,
      `</publication_date>`
    ].join('') : '',

    `${(getPagesXML().length > 0) ? getPagesXML() : ``}`,

    `${(getPublisherItems().length > 0) ? getPublisherItems() : ``}`,

    crossmarkElement,

    `${(!crossmarkElement && funderElement.length) ? funderElement : ``}`,

    `${(!crossmarkElement && licenseElement.length) ? licenseElement : ``}`,

    `${(getRelatedItemsXML().length > 0) ? getRelatedItemsXML() : ``}`,

    state.addInfo.archiveLocation.trim().length > 0 ?
      `<archive_locations><archive name="${state.addInfo.archiveLocation}"/></archive_locations>` : '',

    `<doi_data>`,
    `<doi>${article.doi}</doi>`,
    `${article.url ? `<resource>${article.url}</resource>` : ''}`,
    `${(getCollectionXML().length > 0) ? getCollectionXML() : ``}`,
    `</doi_data>`,

    `</journal_article>`
  ]
  return array.join('')

  function appendElm(elmName, val, appendToElm) {
    if (val && (val.trim().length > 0)) {
      var el = appendToElm.ownerDocument.createElement(elmName)
      el.textContent = val
      appendToElm.appendChild(el)
    }
    return el
  }
  function appendAttribute(attrName, val, appendToElm) {
    if (val && val.trim().length > 0) appendToElm.setAttribute(attrName, val)
  }
  function appendContributorElm(root) {
    var contributors = getSubItems(state.contributors)
    if (contributors.length == 0) return
    const contElm = root.ownerDocument.createElement("contributors")

    for (var i in contributors) {
      const contributor = contributors[i]
      //var attributes=_.filter( Object.keys(contributor),(key)=>{return  (contributor[key] && typeof contributor[key] === 'string' && contributor[key].trim().length>0)})

      const personElm = root.ownerDocument.createElement("person_name")
      personElm.setAttribute("sequence", i == 0 ? "first" : "additional")
      appendAttribute("contributor_role", contributor.role, personElm)
      appendElm("given_name", contributor.firstName, personElm)
      appendElm("surname", contributor.lastName, personElm)
      appendElm("suffix", contributor.suffix, personElm)
      appendElm("affiliation", contributor.affiliation, personElm)
      appendElm("ORCID", contributor.orcid, personElm)
      contElm.appendChild(personElm)

      if ((contributor.groupAuthorName && contributor.groupAuthorName.trim().length > 0) || (contributor.groupAuthorRole && contributor.groupAuthorRole.trim().length > 0)) {
        const orgElm = root.ownerDocument.createElement("organization")
        orgElm.setAttribute("sequence", i == 0 ? "first" : "additional")
        appendAttribute("contributor_role", contributor.groupAuthorRole, orgElm)
        orgElm.textContent = contributor.groupAuthorName
        contElm.appendChild(orgElm)
      }
    }
    root.appendChild(contElm)
  }
  function getContributorXML() {
    var contributors = getSubItems(state.contributors).map((contributor, i) => {
      // cause the type "ROLE" is shared name
      var attributes = [
        (contributor.firstName && (contributor.firstName.trim().length > 0)) ? `<given_name>${contributor.firstName}</given_name>` : undefined,
        (contributor.lastName && (contributor.lastName.trim().length > 0)) ? `<surname>${contributor.lastName}</surname>` : undefined,
        (contributor.suffix && (contributor.suffix.trim().length > 0)) ? `<suffix>${contributor.suffix}</suffix>` : undefined,
        (contributor.affiliation && (contributor.affiliation.trim().length > 0)) ? `<affiliation>${contributor.affiliation}</affiliation>` : undefined,
        (contributor.orcid && (contributor.orcid.trim().length > 0)) ? `<ORCID>${contributor.orcid}</ORCID>` : undefined,
      ]

      attributes = _.filter(attributes, (attribute) => { // filter all the undefined
        for (const key in attribute) { // checking all the properties of errors to see if there is a true
          if (attribute[key]) {
            return attribute
          }
        }
      })

      const org = ((contributor.groupAuthorName && (contributor.groupAuthorName.trim().length > 0)) || (contributor.groupAuthorRole && (contributor.groupAuthorRole.trim().length > 0))) ?
        `<organization sequence="${i === 0 ? 'first' : 'additional'}"${contributor.groupAuthorRole ? ` contributor_role="${contributor.groupAuthorRole}"` : ''}>${contributor.groupAuthorName}</organization>` : undefined

      const person = `<person_name sequence="${i === 0 ? 'first' : 'additional'}"${(contributor.role && (contributor.role.trim().length > 0)) ? ` contributor_role="${contributor.role}"` : ``}>${attributes.join('')}</person_name>`

      return org ? org : person
    })

    return contributors.length > 0 ? `<contributors>${contributors.join('')}</contributors>` : ``
  }
  function appendFunder(el) {
    var funders = getSubItems(state.funding)
    var programElm = el.ownerDocument.createElementNS("http://www.crossref.org/fundref.xsd", "fr:program")

    for (let funder of funders) {
      var funderName
      if (funder.fundername) {
        funderName = funder.fundername.trim().length > 0 ? funder.fundername : undefined
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
  function getFunderXML() {
    var funders = getSubItems(state.funding).map(funder => {
      let funderName
      if (funder.fundername) {
        funderName = funder.fundername.trim().length > 0 ? funder.fundername : undefined
      }

      let funder_identifier
      if (funder.funder_identifier) {
        funder_identifier = funder.funder_identifier.trim().length > 0 ? funder.funder_identifier : undefined
      }

      let grants = funder.grantNumbers ? funder.grantNumbers.map(awardNumber => {
        return (awardNumber && awardNumber.trim()) ? `<fr:assertion name="award_number">${awardNumber}</fr:assertion>` : ''
      }) : []

      grants = _.filter(grants, (grant) => {
        return grant !== ''
      })

      let attributes = ''

      if (funderName) {
        attributes = `<fr:assertion name="funder_name">${funderName}${funder_identifier ? `<fr:assertion name="funder_identifier">${funder_identifier}</fr:assertion>` : ``}</fr:assertion>`
      } else if (funder_identifier) {
        attributes = `<fr:assertion name="funder_identifier">${funder_identifier}</fr:assertion>`
      }

      return (attributes || grants.length) ? `<fr:assertion name="fundgroup">${attributes}${grants.join('')}</fr:assertion>` : undefined
    })

    funders = _.filter(funders, (funder) => {
      return typeof funder !== 'undefined'
    })

    return funders.length > 0 ? `<fr:program xmlns:fr="http://www.crossref.org/fundref.xsd">${funders.join('')}</fr:program>` : ``

  }
  function appendLicenseElm(root) {
    var licenses = getSubItems(state.license)
    if (!licenses) {
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
        dayHolder.push(month)
      }
      if (day) {
        dayHolder.push(day)
      }
      var el
      const isDate = dayHolder.length > 0
      if (isDate || license.licenseurl || license.appliesto) {
        const date = isDate ? moment(dayHolder.join('-')).format(`${year && 'YYYY'}-${month && 'MM'}-${day && 'DD'}`) : ''
        if (i == 0 && state.addInfo.freetolicense) {
          el = root.ownerDocument.createElement("ai:free_to_read")
          appendAttribute("start_date", date, el)
          licElm.appendChild(el)
        }
        el = root.ownerDocument.createElement("ai:license_ref")
        appendAttribute("applies_to", license.appliesto, el)
        appendAttribute("start_date", date, el)
        el.textContent = license.licenseurl
        licElm.appendChild(el)
      }
    }
    root.appendChild(licElm)
  }
  function getLicenseXML() {
    var licenses = getSubItems(state.license).map((license, i) => {
      const year = license.acceptedDateYear, month = license.acceptedDateMonth, day = license.acceptedDateDay
      const dayHolder = []
      if (year) {
        dayHolder.push(year)
      }
      if (month) {
        dayHolder.push(month)
      }
      if (day) {
        dayHolder.push(day)
      }

      let attributes = ``
      const isDate = dayHolder.length > 0
      if (isDate || license.licenseurl || license.appliesto) {
        const date = isDate ? moment(dayHolder.join('-')).format(`${year && 'YYYY'}-${month && 'MM'}-${day && 'DD'}`) : ''
        let freetolicense = ``
        if (i === 0 && state.addInfo.freetolicense) {
          freetolicense = `<ai:free_to_read${isDate ? ` start_date="${date}"` : ''}/>`
        }

        attributes = `${freetolicense}<ai:license_ref${license.appliesto ? ` applies_to="${license.appliesto}"` : ''}${isDate ? ` start_date="${date}"` : ''}>${license.licenseurl}</ai:license_ref>`
      }
      return attributes
    })
    return licenses.length > 0 ? `<ai:program xmlns:ai="http://www.crossref.org/AccessIndicators.xsd" name="AccessIndicators">${licenses.join('')}</ai:program>` : ``
  }
  function appendRelatedItemsElm(root) {
    const relatedItems = getSubItems(state.relatedItems)
    if (!relatedItems) {
      return
    }
    const relProgramElm = root.ownerDocument.createElementNS("http://www.crossref.org/relations.xsd", "rel:program")

    for (var item of relatedItems) {
      const { description, relationType, identifierType, relatedItemIdentifier } = item
      var interRelElm
      const relItemElm = root.ownerDocument.createElement("rel:related_item")
      appendElm("description", description, relItemElm)

      if (relationType || identifierType || relatedItemIdentifier) {
        interRelElm = root.ownerDocument.createElement("inter_work_relation")
        appendAttribute("relationship-type", relationType, interRelElm)
        appendAttribute("identifier-type", identifier - type, interRelElm)
        interRelElm.textContent = relatedItemIdentifier
        relItemElm.appendChild(interRelElm)
      }
    }
  }
  function getRelatedItemsXML() {
    const relatedItems = getSubItems(state.relatedItems).map(({ description, relationType, identifierType, relatedItemIdentifier }) => {

      const interWorkRelation = (relationType || identifierType || relatedItemIdentifier) ?
        `<inter_work_relation${relationType ? ` relationship-type="${relationType}"` : ''}${identifierType ? ` identifier-type="${identifierType}"` : ''}>${relatedItemIdentifier || ''}</inter_work_relation>`
        : ''

      return `<related_item xmlns="http://www.crossref.org/relations.xsd">${description ? `<description>${description}</description>` : ``}${interWorkRelation}</related_item>`
    })
    return relatedItems.length > 0 ? `<rel:program xmlns:rel="http://www.crossref.org/relations.xsd">${relatedItems.join('')}</rel:program>` : ``
  }

  function getCollectionXML() {
    // similarity check
    if (state.addInfo.similarityCheckURL === 'http://' || state.addInfo.similarityCheckURL.trim().length === 0) {
      return ''
    } else {
      return `<collection property="crawler-based"><item crawler="iParadigms"><resource>${state.addInfo.similarityCheckURL}</resource></item></collection>`

    }
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

  function getPagesXML() {
    return ((article.firstPage.trim().length > 0) || (article.lastPage.trim().length > 0)) ? `<pages>${(article.firstPage.trim().length > 0) ? `<first_page>${article.firstPage}</first_page>` : ``}${(article.lastPage.trim().length > 0) ? `<last_page>${article.lastPage}</last_page>` : ``}</pages>` : ``
  }

  function appendPagesXML(rootElem) {
    if ((article.firstPage.trim().length > 0) || (article.lastPage.trim().length > 0)) {
      const pagesElm = rootElem.ownerDocument.createElement('pages')
      appendElm("first_page", article.firstPage, pagesElm)
      appendElm("last_page", article.lastPage, pagesElm)

      rootElem.appendChild(pagesElm)
    }
  }

  function getPublisherItems() {
    return (article.locationId.trim().length > 0) ? `<publisher_item><item_number item_number_type="article_number">${article.locationId.trim()}</item_number></publisher_item>` : ``
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
    if (JSform[pubHist]) crossmarkForm[pubHist] = JSform[pubHist]
    if (JSform[peer]) crossmarkForm[peer] = JSform[peer]
    if (JSform[copyright]) crossmarkForm[copyright] = JSform[copyright]
    if (JSform[supp]) crossmarkForm[supp] = JSform[supp]
    if (JSform[other]) crossmarkForm[other] = JSform[other]
    if (JSform[clinical]) crossmarkForm[clinical] = JSform[clinical]
    if (JSform[update]) crossmarkForm[update] = JSform[update]

    const size = Object.keys(crossmarkForm).length

    if (!size) {
      // no crossmark, but do funders and license ref
      appendFunder(rootElem)
      appendLicenseElm(rootElem)
      return
    }
    var crossmarkElm = rootElem.ownerDocument.createElement("crossmark")
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
  function crossmarkXml() {
    const JSform = reduxForm.toJS()
    const crossmarkForm = {}
    if (JSform[pubHist]) crossmarkForm[pubHist] = JSform[pubHist]
    if (JSform[peer]) crossmarkForm[peer] = JSform[peer]
    if (JSform[copyright]) crossmarkForm[copyright] = JSform[copyright]
    if (JSform[supp]) crossmarkForm[supp] = JSform[supp]
    if (JSform[other]) crossmarkForm[other] = JSform[other]
    if (JSform[clinical]) crossmarkForm[clinical] = JSform[clinical]
    if (JSform[update]) crossmarkForm[update] = JSform[update]

    const size = Object.keys(crossmarkForm).length

    if (!size) return ''

    const customMetadata = (!crossmarkForm[update] || size > 1) ?
      [
        `<custom_metadata>`,

        crossmarkForm[other] ? generateOther(crossmarkForm[other]) : '',

        crossmarkForm[pubHist] ? generatePubHist(crossmarkForm[pubHist]) : '',

        crossmarkForm[peer] ? generatePeer(crossmarkForm[peer]) : '',

        crossmarkForm[supp] ? generateSupp(crossmarkForm[supp]) : '',

        crossmarkForm[copyright] ? generateCopyright(crossmarkForm[copyright]) : '',

        crossmarkForm[clinical] ? generateClinical(crossmarkForm[clinical]) : '',

        funderElement.length ? funderElement : '',

        licenseElement.length ? licenseElement : '',

        `</custom_metadata>`
      ].join('')
      : null

    return [
      `<crossmark>`, `<crossmark_policy>${state.ownerPrefix}/something</crossmark_policy>`, //TODO Needs to be looked at

      `<crossmark_domains><crossmark_domain><domain>psychoceramics.labs.crossref.org</domain></crossmark_domain></crossmark_domains>`, //TEMPORARY, Crossref team said they will be removing this requirement

      crossmarkForm[update] ? generateUpdate(crossmarkForm[update]) : '',

      customMetadata ? customMetadata : '',
      `</crossmark>`
    ].join('')


    function generateUpdate(card) {
      let array = [`<updates>`]
      for (let number in card) {
        const { type, DOI, day, month, year } = card[number]
        const date = `${year || ''}-${month || ''}-${day || ''}`
        array.push(`<update${type ? ` type="${type.toLowerCase().replace(/\s+/g, '_')}"` : ''}${year || month || day ? ` date="${date}"` : ''}>${DOI ? DOI : ''}</update>`)
      }
      array.push(`</updates>`)
      return array.join('')
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
        const date = `${year || ''}-${month || ''}-${day || ''}`
        var elm = el.ownerDocument.createElement("assertion")
        if (label) {
          elm.setAttribute("name", label.toLowerCase().replace(/\s+/g, '_'))
          elm.setAttribute("label", label)
        }
        elm.setAttribute("group_name", "publication_history")
        elm.setAttribute("group_label", "Publication History")
        elm.setAttribute("order", number)
        elm.textContent = date
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
      for (let number in card) {
        const { explanation, href } = card[number]
        var elm = el.ownerDocument.createElementNS("http://www.crossref.org/clinicaltrials.xsd", "program")

        for (let number in card) {
          const { registry, trialNumber, type } = card[number]
          var el2 = el.ownerDocument.createElement("clinical-trial-number")
          el2.setAttribute("registry", registryDois[registry])
          if (type) el2.setAttribute("type", lowerCaseFirst(type).replace(/-/g, ''))
          el2.textContent = trialNumber;
        }
        elm.appendChild(el2)
      }
      el.appendChild(el)

    }
    function generateOther(card) {
      let array = []
      for (let number in card) {
        const { label, explanation, href } = card[number]
        array.push(`<assertion${label ? ` name="${label.toLowerCase().replace(/\s+/g, '_')}" label="${label}"` : ''}${explanation ? ` explanation="${explanation}"` : ''}${href ? ` href="${href}"` : ''}${number ? ` order="${number}"` : ''}/>`)
      } return array.join('')
    }

    function generatePubHist(card) {
      let array = []
      for (let number in card) {
        const { label, day, month, year } = card[number]
        const date = `${year || ''}-${month || ''}-${day || ''}`
        array.push(`<assertion${label ? ` name="${label.toLowerCase().replace(/\s+/g, '_')}" label="${label}"` : ''} group_name="publication_history" group_label="Publication History"${number ? ` order="${number}"` : ''}>${year || month || day ? date : ''}</assertion>`)
      } return array.join('')
    }

    function generatePeer(card) {
      let array = []
      for (let number in card) {
        const { label, explanation, href } = card[number]
        array.push(`<assertion${label ? ` name="${label.toLowerCase().replace(/\s+/g, '_')}" label="${label}"` : ''} group_name="peer_review" group_label="Peer review"${explanation ? ` explanation="${explanation}"` : ''}${href ? ` href="${href}"` : ''}${number ? ` order="${number}"` : ''}/>`)
      } return array.join('')
    }

    function generateSupp(card) {
      let array = []
      for (let number in card) {
        const { explanation, href } = card[number]
        array.push(`<assertion name="supplementary_Material" label="Supplementary Material"${explanation ? ` explanation="${explanation}"` : ''}${href ? ` href="${href}"` : ''}${number ? ` order="${number}"` : ''}/>`)
      } return array.join('')
    }

    function generateCopyright(card) {
      let array = []
      for (let number in card) {
        const { label, explanation, href } = card[number]
        if (label === 'Copyright Statement') {
          array.push(`<assertion name="copyright_statement"${label ? ` label="${label}"` : ''} group_name="copyright_licensing" group_label="Copyright $amp; Licensing"${explanation ? ` explanation="${explanation}"` : ''}${href ? ` href="${href}"` : ''}${number ? ` order="${number}"` : ''}/>`)
        } else if (label === 'Licensing Information') {
          array.push(`<assertion name="licensing"${label ? ` label="${label}"` : ''} group_name="copyright_licensing" group_label="Copyright $amp; Licensing"${explanation ? ` explanation="${explanation}"` : ''}${href ? ` href="${href}"` : ''}${number ? ` order="${number}"` : ''}/>`)
        } else {
          array.push(`<assertion group_name="copyright_licensing" group_label="Copyright $amp; Licensing"${explanation ? ` explanation="${explanation}"` : ''}${href ? ` href="${href}"` : ''}${number ? ` order="${number}"` : ''}/>`)
        }

      } return array.join('')
    }

    function generateClinical(card) {
      let array = [`<program xmlns="http://www.crossref.org/clinicaltrials.xsd">`]
      for (let number in card) {
        const { registry, trialNumber, type } = card[number]
        array.push(`<clinical-trial-number${registry ? ` registry="${registryDois[registry]}"` : ''}${type ? ` type="${lowerCaseFirst(type).replace(/-/g, '')}"` : ''}>${trialNumber ? trialNumber : ''}</clinical-trial-number>`)
      }
      array.push(`</program>`)
      return array.join('')
    }
  }
}

