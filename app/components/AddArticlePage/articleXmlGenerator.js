import _ from 'lodash'
import moment from 'moment'

import { getSubItems } from '../../utilities/getSubItems'
import {cardNames, registryDois} from '../../utilities/crossmarkHelpers'
const { pubHist, peer, copyright, supp, clinical, other, update} = cardNames



export default function (state, reduxForm) {
  const article = state.article
  const onlineYear = article.onlineDateYear, onlineMonth = article.onlineDateMonth, onlineDay = article.onlineDateDay,
    printYear = article.printDateYear, printMonth = article.printDateMonth, printDay = article.printDateDay
  const language = state.addInfo.language
  const publicationType = state.addInfo.publicationType

  const funderElement = getFunderXML()
  const licenseElement = getLicenseXML()
  const crossmarkElement = state.crossmark ? crossmarkXml() : ''

  const array = [
    `<journal_article`,
    `${(language.length > 0) ? ` language="${language}"`:``}`,
    `${(publicationType.length > 0) ? ` publication_type="${publicationType}"`:``}`,
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
      `${onlineMonth.length > 0 ? `<month>${onlineMonth}</month>`:``}`,
      `${onlineDay.length > 0 ? `<day>${onlineDay}</day>`:``}`,
      `${onlineYear.length > 0 ? `<year>${onlineYear}</year>`:``}`,
      `</publication_date>`
    ].join('') : '',

    printYear || printMonth || printDay ? [
      `<publication_date media_type="print">`,
      `${printMonth.length > 0 ? `<month>${printMonth}</month>`:``}`,
      `${printDay.length > 0 ? `<day>${printDay}</day>`:``}`,
      `${printYear.length > 0 ? `<year>${printYear}</year>`:``}`,
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




  function getContributorXML () {
    var contributors = getSubItems(state.contributors).map((contributor, i) => {
      // cause the type "ROLE" is shared name
      var attributes = [
        (contributor.firstName && (contributor.firstName.trim().length>0)) ? `<given_name>${contributor.firstName}</given_name>` : undefined,
        (contributor.lastName && (contributor.lastName.trim().length>0)) ? `<surname>${contributor.lastName}</surname>` : undefined,
        (contributor.suffix && (contributor.suffix.trim().length>0)) ? `<suffix>${contributor.suffix}</suffix>` : undefined,
        (contributor.affiliation && (contributor.affiliation.trim().length>0)) ? `<affiliation>${contributor.affiliation}</affiliation>` : undefined,
        (contributor.orcid && (contributor.orcid.trim().length>0)) ? `<ORCID>${contributor.orcid}</ORCID>` : undefined,
      ]

      attributes = _.filter(attributes, (attribute) => { // filter all the undefined
        for(const key in attribute) { // checking all the properties of errors to see if there is a true
          if (attribute[key]) {
            return attribute
          }
        }
      })

      const org = ((contributor.groupAuthorName && (contributor.groupAuthorName.trim().length>0)) || (contributor.groupAuthorRole && (contributor.groupAuthorRole.trim().length>0))) ?
        `<organization sequence="${i===0 ? 'first' : 'additional'}"${contributor.groupAuthorRole ? ` contributor_role="${contributor.groupAuthorRole}"`:''}>${contributor.groupAuthorName}</organization>` : undefined

      const person = `<person_name sequence="${i===0 ? 'first' : 'additional'}"${(contributor.role && (contributor.role.trim().length>0)) ? ` contributor_role="${contributor.role}"` : ``}>${attributes.join('')}</person_name>`

      return org ? org : person
    })

    return contributors.length > 0 ? `<contributors>${contributors.join('')}</contributors>` : ``
  }

  function getFunderXML () {
    var funders = getSubItems(state.funding).map( funder => {
      let funderName
      if (funder.funderName) {
        funderName = funder.funderName.trim().length > 0 ? funder.funderName : undefined
      }

      let funder_identifier
      if (funder.funder_identifier) {
        funder_identifier = funder.funder_identifier.trim().length > 0 ? funder.funder_identifier : undefined
      }

      let grants = funder.grantNumbers ? funder.grantNumbers.map( awardNumber => {
        return (awardNumber && awardNumber.trim()) ? `<fr:assertion name="award_number">${awardNumber}</fr:assertion>` : ''
      }) : []

      grants = _.filter(grants, (grant) => {
        return grant !== ''
      })

      let attributes = ''

      if (funderName) {
        attributes = `<fr:assertion name="funder_name">${funderName}${funder_identifier ? `<fr:assertion name="funder_identifier">${funder_identifier}</fr:assertion>` : ``}</fr:assertion>`
      } else if(funder_identifier) {
        attributes = `<fr:assertion name="funder_identifier">${funder_identifier}</fr:assertion>`
      }

      return ( attributes || grants.length ) ? `<fr:assertion name="fundgroup">${attributes}${grants.join('')}</fr:assertion>` : undefined
    })

    funders = _.filter(funders, (funder) => {
      return typeof funder !== 'undefined'
    })

    return funders.length > 0 ? `<fr:program xmlns:fr="http://www.crossref.org/fundref.xsd">${funders.join('')}</fr:program>` : ``

  }

  function getLicenseXML () {
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
        if (i===0 && article.freetolicense === 'yes') {
          freetolicense = `<ai:free_to_read${isDate ? ` start_date="${date}"` : ''}/>`
        }

        attributes = `${freetolicense}<ai:license_ref${license.appliesto ? ` applies_to="${license.appliesto}"`:''}${isDate ? ` start_date="${date}"`:''}>${license.licenseurl}</ai:license_ref>`
      }
      return attributes
    })
    return licenses.length > 0 ? `<ai:program xmlns:ai="http://www.crossref.org/AccessIndicators.xsd" name="AccessIndicators">${licenses.join('')}</ai:program>` : ``
  }

  function getRelatedItemsXML () {
    const relatedItems = getSubItems(state.relatedItems).map(({description, relationType, identifierType, relatedItemIdentifier}) => {

      const interWorkRelation = (relationType || identifierType || relatedItemIdentifier) ?
        `<inter_work_relation${relationType ? ` relationship-type="${relationType}"`:''}${identifierType ? ` identifier-type="${identifierType}"`:''}>${relatedItemIdentifier || ''}</inter_work_relation>`
        : ''

      return `<related_item xmlns="http://www.crossref.org/relations.xsd">${description ? `<description>${description}</description>` : ``}${interWorkRelation}</related_item>`
    })
    return relatedItems.length > 0 ? `<rel:program xmlns:rel="http://www.crossref.org/relations.xsd">${relatedItems.join('')}</rel:program>` : ``
  }

  function getCollectionXML () {
    // similarity check
    if(state.addInfo.similarityCheckURL === 'http://' || state.addInfo.similarityCheckURL.trim().length === 0) {
      return ''
    } else {
      return `<collection property="crawler-based"><item crawler="iParadigms"><resource>${state.addInfo.similarityCheckURL}</resource></item></collection>`

    }
  }

  function getPagesXML () {
    return ((article.firstPage.trim().length > 0) || (article.lastPage.trim().length > 0)) ? `<pages>${(article.firstPage.trim().length > 0) ? `<first_page>${article.firstPage}</first_page>` : ``}${(article.lastPage.trim().length > 0) ? `<last_page>${article.lastPage}</last_page>` : ``}</pages>`: ``
  }

  function getPublisherItems () {
    return (article.locationId.trim().length > 0) ? `<publisher_item><item_number item_number_type="article_number">${article.locationId.trim()}</item_number></publisher_item>` : ``
  }

  function crossmarkXml () {
    const JSform = reduxForm.toJS()
    const crossmarkForm = {}
    if(JSform[pubHist]) crossmarkForm[pubHist] = JSform[pubHist]
    if(JSform[peer]) crossmarkForm[peer] = JSform[peer]
    if(JSform[copyright]) crossmarkForm[copyright] = JSform[copyright]
    if(JSform[supp]) crossmarkForm[supp] = JSform[supp]
    if(JSform[other]) crossmarkForm[other] = JSform[other]
    if(JSform[clinical]) crossmarkForm[clinical] = JSform[clinical]
    if(JSform[update]) crossmarkForm[update] = JSform[update]

    const size = Object.keys(crossmarkForm).length

    if(!size) return ''

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


    function generateUpdate (card) {
      let array = [`<updates>`]
      for (let number in card) {
        const { type, DOI, day, month, year } = card[number]
        const date = `${year || ''}-${month || ''}-${day || ''}`
        array.push(`<update${type ? ` type="${type.toLowerCase().replace(/\s+/g, '_')}"`:''}${year || month || day ? ` date="${date}"`:''}>${DOI ? DOI:''}</update>`)
      }
      array.push(`</updates>`)
      return array.join('')
    }

    function generateOther (card) {
      let array = []
      for (let number in card) {
        const { label, explanation, href } = card[number]
        array.push(`<assertion${label ? ` name="${label.toLowerCase().replace(/\s+/g, '_')}" label="${label}"` : ''}${explanation ? ` explanation="${explanation}"`:''}${href ? ` href="${href}"`:''}${number ? ` order="${number}"`:''}/>`)
      } return array.join('')
    }

    function generatePubHist (card) {
      let array = []
      for (let number in card) {
        const { label, day, month, year } = card[number]
        const date = `${year || ''}-${month || ''}-${day || ''}`
        array.push(`<assertion${label ? ` name="${label.toLowerCase().replace(/\s+/g, '_')}" label="${label}"` : ''} group_name="publication_history" group_label="Publication History"${number ? ` order="${number}"`:''}>${year || month || day ? date : ''}</assertion>`)
      } return array.join('')
    }

    function generatePeer (card) {
      let array = []
      for (let number in card) {
        const { label, explanation, href } = card[number]
        array.push(`<assertion${label ? ` name="${label.toLowerCase().replace(/\s+/g, '_')}" label="${label}"` : ''} group_name="peer_review" group_label="Peer review"${explanation ? ` explanation="${explanation}"`:''}${href ? ` href="${href}"`:''}${number ? ` order="${number}"`:''}/>`)
      } return array.join('')
    }

    function generateSupp (card) {
      let array = []
      for (let number in card) {
        const { explanation, href } = card[number]
        array.push(`<assertion name="supplementary_Material" label="Supplementary Material"${explanation ? ` explanation="${explanation}"`:''}${href ? ` href="${href}"`:''}${number ? ` order="${number}"`:''}/>`)
      } return array.join('')
    }

    function generateCopyright (card) {
      let array = []
      for (let number in card) {
        const { label, explanation, href } = card[number]
        if (label === 'Copyright Statement') {
          array.push(`<assertion name="copyright_statement"${label ? ` label="${label}"` : ''} group_name="copyright_licensing" group_label="Copyright $amp; Licensing"${explanation ? ` explanation="${explanation}"` : ''}${href ? ` href="${href}"` : ''}${number ? ` order="${number}"` : ''}/>`)
        } else if (label === 'Licensing Information') {
          array.push(`<assertion name="licensing"${label ? ` label="${label}"`:''} group_name="copyright_licensing" group_label="Copyright $amp; Licensing"${explanation ? ` explanation="${explanation}"`:''}${href ? ` href="${href}"`:''}${number ? ` order="${number}"`:''}/>`)
        } else {
          array.push(`<assertion group_name="copyright_licensing" group_label="Copyright $amp; Licensing"${explanation ? ` explanation="${explanation}"`:''}${href ? ` href="${href}"`:''}${number ? ` order="${number}"`:''}/>`)
        }

      } return array.join('')
    }

    function generateClinical (card) {
      let array = [`<program xmlns="http://www.crossref.org/clinicaltrials.xsd">`]
      for (let number in card) {
        const { registry, trialNumber, type } = card[number]
        array.push(`<clinical-trial-number${registry ? ` registry="${registryDois[registry]}"`:''}${type ? ` type="${lowerCaseFirst(type).replace(/-/g, '')}"`:''}>${trialNumber ? trialNumber : ''}</clinical-trial-number>`)
      }
      array.push(`</program>`)
      return array.join('')
    }
  }
}

