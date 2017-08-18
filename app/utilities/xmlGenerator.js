import _ from 'lodash'
import moment from 'moment'

import { getContributor, getSubmitSubItems } from './getSubItems'


export const crossmarkXml = (form, crossmarkPrefix) => {

  function generateUpdate (card) {
    let array = [`<updates>`];
    for (var number in card) {
      const { type, DOI, day, month, year } = card[number];
      const date = `${year || ''}-${month || ''}-${day || ''}`;
      array.push(`<update${type ? `type="${type.toLowerCase().replace(/\s+/g, '_')}"`:''} ${year || month || day ? `date="${date}"`:''}>${DOI ? DOI:''}</update>`)
    }
    array.push(`</updates>`)
    return array.join('')
  }

  function generateOther (card) {
    let array = [];
    for (var number in card) {
      const { label, explanation, href } = card[number];
      array.push(`<assertion name="${(label || '').toLowerCase().replace(/\s+/g, '_')}" ${label ? `label="${label}"`:''} ${explanation ? `explanation="${explanation}"`:''} ${href ? `href="${href}"`:''} ${number ? `order="${number}"`:''}/>`)
    } return array.join('')
  }

  function generatePubHist (card) {
    let array = [];
    for (var number in card) {
      const { label, day, month, year } = card[number];
      const date = `${year || ''}-${month || ''}-${day || ''}`;
      array.push(`<assertion name="${(label || '').toLowerCase().replace(/\s+/g, '_')}" ${label ? `label="${label}"`:''} group_name="publication_history" group_label="Publication History" ${number ? `order="${number}"`:''}>${year || month || day ? date : ''}</assertion>`)
    } return array.join('')
  }

  function generatePeer (card) {
    let array = [];
    for (var number in card) {
      const { label, explanation, href } = card[number];
      array.push(`<assertion name="${(label || '').toLowerCase().replace(/\s+/g, '_')}" ${label ? `label="${label}"`:''} group_name="peer_review" group_label="Peer review" ${explanation ? `explanation="${explanation}"`:''} ${href ? `href="${href}"`:''} ${number ? `order="${number}"`:''}/>`)
    } return array.join('')
  }

  function generateSupp (card) {
    let array = [];
    for (var number in card) {
      const { explanation, href } = card[number];
      array.push(`<assertion name="supplementary_Material" label="Supplementary Material" ${explanation ? `explanation="${explanation}"`:''} ${href ? `href="${href}"`:''} ${number ? `order="${number}"`:''}/>`)
    } return array.join('')
  }

  function generateCopyright (card) {
    let array = [];
    for (var number in card) {
      const { label, explanation, href } = card[number];
      if(label === 'Copyright Statement')
        array.push(`<assertion name="copyright_statement" ${label ? `label="${label}"`:''} group_name="copyright_licensing" group_label="Copyright $amp; Licensing" ${explanation ? `explanation="${explanation}"`:''} ${href ? `href="${href}"`:''} ${number ? `order="${number}"`:''}/>`);
      if(label === 'Licensing Information')
        array.push(`<assertion name="licensing" ${label ? `label="${label}"`:''} group_name="copyright_licensing" group_label="Copyright $amp; Licensing" ${explanation ? `explanation="${explanation}"`:''} ${href ? `href="${href}"`:''} ${number ? `order="${number}"`:''} ${number ? `order="${number}"`:''}/>`);
    } return array.join('')
  }

  function generateClinical (card) {
    let array = [`<program xmlns="http://www.crossref.org/clinicaltrials.xsd">`];
    for (var number in card) {
      const { registry, trialNumber, type } = card[number];
      array.push(`<clinical-trial-number ${registry ? `registry="${registryDois[registry]}"`:''} ${type ? `type="${lowerCaseFirst(type).replace(/-/g, '')}"`:''}>${trialNumber ? trialNumber : ''}</clinical-trial-number>`)
    };
    array.push(`</program>`);
    return array.join('')
  }


  let data = {};
  for (var key in form) {
    if(!key.includes('_')) continue;
    const [ card, number, field ] = key.split('_');
    if(!data[card]) data[card] = {};
    if(!data[card][number]) data[card][number] = {};
    data[card][number][field] = form[key];
  }

  if(!Object.keys(data).length) return undefined;


  return [
    `<crossmark>`,
      `<crossmark_policy>${crossmarkPrefix}/something</crossmark_policy>`, //TODO Needs to be looked at

      `<crossmark_domains><crossmark_domain><domain>psychoceramics.labs.crossref.org</domain></crossmark_domain></crossmark_domains>`, //TEMPORARY, Crossref team said they will be removing this requirement

      data.update ? generateUpdate(data.update) : '',

      `<custom_metadata>`,

        data.other ? generateOther(data.other) : '',

        data.pubHist ? generatePubHist(data.pubHist) : '',

        data.peer ? generatePeer(data.peer) : '',

        data.supp ? generateSupp(data.supp) : '',

        data.copyright ? generateCopyright(data.copyright) : '',

        data.clinical ? generateClinical(data.clinical) : '',

      `</custom_metadata>`,
    `</crossmark>`
  ].join('')

}




export const journalArticleXml = (component, crossmark) => {
  const state = component.state;
  const article = state.article;
  const onlineYear = article.onlineDateYear, onlineMonth = article.onlineDateMonth, onlineDay = article.onlineDateDay,
    printYear = article.printDateYear, printMonth = article.printDateMonth, printDay = article.printDateDay;
  const language = state.addInfo.language;
  const publicationType = state.addInfo.publicationType;

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

      `${getAcceptanceDateXML()}`,

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

      `${(getFunderXML().length > 0) ? getFunderXML() : ``}`,

      `${(getLicenseXML().length > 0) ? getLicenseXML() : ``}`,

      `${(getRelatedItemsXML().length > 0) ? getRelatedItemsXML() : ``}`,

      state.addInfo.archiveLocation.trim().length > 0 ?
        `<archive_locations><archive name="${state.addInfo.archiveLocation}"/></archive_locations>` : '',

      crossmark ? crossmark : '',

      `<doi_data>`,
        `<doi>${article.doi}</doi>`,
        `<resource>${article.url}</resource>`,
        `${(getCollectionXML().length > 0) ? getCollectionXML() : ``}`,
      `</doi_data>`,

    `</journal_article>`
  ];
  return array.join('')




  function getContributorXML () {
    var contributors = getSubmitSubItems(state.contributors).map((contributor, i) => {
      // cause the type "ROLE" is shared name
      var attributes = [
        (contributor.firstName && (contributor.firstName.trim().length>0)) ? `<given_name>${contributor.firstName}</given_name>` : undefined,
        (contributor.lastName && (contributor.lastName.trim().length>0)) ? `<surname>${contributor.lastName}</surname>` : undefined,
        (contributor.suffix && (contributor.suffix.trim().length>0)) ? `<suffix>${contributor.suffix}</suffix>` : undefined,
        (contributor.affiliation && (contributor.affiliation.trim().length>0)) ? `<affiliation>${contributor.affiliation}</affiliation>` : undefined,
        (contributor.orcid && (contributor.orcid.trim().length>0)) ? `<ORCID>${contributor.orcid}</ORCID>` : undefined,
      ]

      attributes = _.filter(attributes, (attribute) => { // filter all the undefined
        for(var key in attribute) { // checking all the properties of errors to see if there is a true
          if (attribute[key]) {
            return attribute
          }
        }
      })

      var org = ((contributor.groupAuthorName && (contributor.groupAuthorName.trim().length>0)) && (contributor.groupAuthorRole && (contributor.groupAuthorRole.trim().length>0))) ? `<organization sequence="${i===0 ? 'first' : 'additional'}" contributor_role="${contributor.groupAuthorRole}">${contributor.groupAuthorName}</organization>` : undefined

      var person = `<person_name sequence="${i===0 ? 'first' : 'additional'}"${(contributor.role && (contributor.role.trim().length>0)) ? ` contributor_role="${contributor.role}"` : ``}>${attributes.join('')}</person_name>`

      return org ? org : person
    })

    return contributors.length > 0 ? `<contributors>${contributors.join('')}</contributors>` : ``
  }

  function getFunderXML () {
    var funders = getSubmitSubItems(state.funding).map((funder, i) => {
      var funderName = undefined
      if (funder.fundername) {
        funderName = funder.fundername.trim().length > 0 ? funder.fundername : undefined
      }

      var funder_identifier = undefined
      if (funder.funder_identifier) {
        funder_identifier = funder.funder_identifier.trim().length > 0 ? funder.funder_identifier : undefined
      }

      var attributes = ``
      if (funderName || funder_identifier) { //if an of these exist
        attributes = `<fr:assertion name="funder_name">${funderName}${funder_identifier ? `<fr:assertion name="funder_identifier">${funder_identifier}</fr:assertion>` : ``}</fr:assertion>`
        var grants = funder.grantNumbers.map((awardNumber, i) => {
          return `<fr:assertion name="award_number">${awardNumber}</fr:assertion>`
        });

        var fundgroup = `<fr:assertion name="fundgroup">${attributes}${grants.join('')}</fr:assertion>`
        return fundgroup
      }
    })

    funders = _.filter(funders, (funder) => {
      return typeof funder !== 'undefined'
    })

    return funders.length > 0 ? `<fr:program xmlns:fr="http://www.crossref.org/fundref.xsd">${funders.join('')}</fr:program>` : ``

  }

  function getLicenseXML () {
    var licenses = getSubmitSubItems(state.license).map((license, i) => {
      const year = license.acceptedDateYear, month = license.acceptedDateMonth, day = license.acceptedDateDay;
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
      const isDate = dayHolder.length > 0;
      if (isDate || license.licenseurl || license.appliesto) {
        const date = isDate ? moment(dayHolder.join('-')).format(`${year && 'YYYY'}-${month && 'MM'}-${day && 'DD'}`) : '';
        let freetolicense = ``
        if (state.addInfo.freetolicense === 'yes') {
          freetolicense = `<ai:free_to_read start_date="${date}"/>`
        }

        attributes = `${freetolicense}<ai:license_ref${license.appliesto && ` applies_to="${license.appliesto}"`} ${isDate && `start_date="${date}"`}>${license.licenseurl}</ai:license_ref>`
      }
      return attributes
    })
    return licenses.length > 0 ? `<ai:program xmlns:ai="http://www.crossref.org/AccessIndicators.xsd" name="AccessIndicators">${licenses.join('')}</ai:program>` : ``
  }

  function getRelatedItemsXML () {
    var relatedItems = getSubmitSubItems(state.relatedItems).map((relatedItem, i) => {
      var attributes = `<related_item>${(relatedItem.description.length > 0) ? `<description>${relatedItem.description}</description>` : ``}<inter_work_relation relationship-type="${relatedItem.relationType}" identifier-type="${relatedItem.identifierType}">${relatedItem.relatedItemIdentifier}</inter_work_relation></related_item>`

      return attributes
    })
    return relatedItems.length > 0 ? `<program xlmns="http://www.crossref.org/relations.xsd">${relatedItems.join('')}</program>` : ``
  }

  function getCollectionXML () {
    // similarity check
    const similarityCheck = state.addInfo.similarityCheckURL.trim().length > 0 ? `<item crawler="iParadigms"><resource>${state.addInfo.similarityCheckURL}</resource></item>` : ``
    return similarityCheck
  }

  function getPagesXML () {
    return ((article.firstPage.trim().length > 0) || (article.lastPage.trim().length > 0)) ? `<pages>${(article.firstPage.trim().length > 0) ? `<first_page>${article.firstPage}</first_page>` : ``}${(article.lastPage.trim().length > 0) ? `<last_page>${article.lastPage}</last_page>` : ``}</pages>`: ``
  }

  function getPublisherItems () {
    return (article.locationId.trim().length > 0) ? `<publisher_item><item_number item_number_type="article_number">${article.locationId.trim()}</item_number></publisher_item>` : ``
  }

  function getAcceptanceDateXML () {
    var retStr = ``
    if ((article.acceptedDateYear.length > 0) || (article.acceptedDateMonth.length > 0) || (article.acceptedDateDay.length > 0)) {
      retStr = retStr + ((article.acceptedDateYear.length > 0) ? `<year>${article.acceptedDateYear}</year>` : ``)
      retStr = retStr + ((article.acceptedDateMonth.length > 0) ? `<month>${article.acceptedDateMonth}</month>` : ``)
      retStr = retStr + ((article.acceptedDateDay.length > 0) ? `<day>${article.acceptedDateDay}</day>` : ``)
      retStr = `<acceptance_date>${retStr}</acceptance_date>`
    }

    return retStr
  }
}




export const publicationXml = (form) => {
  const xmlArray = [
    `<Journal xmlns="http://www.crossref.org/xschema/1.1">`,

      `<journal_metadata${form.language ? ` language="${form.language}"` : '' }>`,

        `<full_title>${form.title}</full_title>`,

        form.abbreviation ? `<abbrev_title>${form.abbreviation}</abbrev_title>` : '',

        `<issn media_type="electronic">${form.electISSN}</issn>`,

        `<doi_data>`,
          `<doi>${form.DOI}</doi>`,
          `<resource>${form.url}</resource>`,
        `</doi_data>`,

      `</journal_metadata>`,

      form.archivelocation ? `<archive_locations><archive name="${form.archivelocation}"/></archive_locations>` : ``,
    `</Journal>`
  ]
  return xmlArray.join('')
}




export const getIssueXml = (issueObj) => {
    // the title
    const titles = issueObj.issue.issueTitle.trim().length > 0 ? `<titles><title>${issueObj.issue.issueTitle.trim()}</title></titles>` : ``

    // special numbering
    const specialNumbering = issueObj.issue.specialIssueNumber.trim().length > 0 ? `<special_numbering>${issueObj.issue.specialIssueNumber.trim()}</special_numbering>` : ``

    // special numbering
    const issue = issueObj.issue.issue.trim().length > 0 ? `<issue>${issueObj.issue.issue.trim()}</issue>` : ``

    // the online date
    var publicationOnlineDate = ''
    if (issueObj.issue.onlineDateYear.length > 0 || issueObj.issue.onlineDateDay.length > 0 || issueObj.issue.onlineDateMonth.length > 0) {
      publicationOnlineDate += (issueObj.issue.onlineDateYear.length > 0 ? `<year>${issueObj.issue.onlineDateYear}</year>` : ``)
      publicationOnlineDate += (issueObj.issue.onlineDateMonth.length > 0 ? `<month>${issueObj.issue.onlineDateMonth}</month>` : ``)
      publicationOnlineDate += (issueObj.issue.onlineDateDay.length > 0 ? `<day>${issueObj.issue.onlineDateDay}</day>` : ``)

      publicationOnlineDate = `<publication_date media_type="online">${publicationOnlineDate}</publication_date>`
    }

    // the print date
    var publicationPrintDate = ''
    if (issueObj.issue.printDateYear.length > 0 || issueObj.issue.printDateDay.length > 0 || issueObj.issue.printDateMonth.length > 0) {
      publicationPrintDate += (issueObj.issue.printDateYear.length > 0 ? `<year>${issueObj.issue.printDateYear}</year>` : ``)
      publicationPrintDate += (issueObj.issue.printDateMonth.length > 0 ? `<month>${issueObj.issue.printDateMonth}</month>` : ``)
      publicationPrintDate += (issueObj.issue.printDateDay.length > 0 ? `<day>${issueObj.issue.printDateDay}</day>` : ``)

      publicationPrintDate = `<publication_date media_type="print">${publicationPrintDate}</publication_date>`
    }

    //doi_data
    var doiData = ''
    if (issueObj.issue.issueDoi.trim().length > 0 || issueObj.issue.issueUrl.trim().length > 0 ) {
      doiData += (issueObj.issue.issueDoi.trim().length > 0 ? `<doi>${issueObj.issue.issueDoi}</doi>` : ``)
      doiData += (issueObj.issue.issueUrl.trim().length > 0 ? `<resource>${issueObj.issue.issueUrl}</resource>` : ``)
      doiData = `<doi_data>${doiData}</doi_data>`
    }

    // volume
    var volume = ''
    if ((issueObj.issue.volumeDoi ? issueObj.issue.volumeDoi : '').trim().length > 0 || (issueObj.issue.volumeUrl ? issueObj.issue.volumeUrl : '').trim().length > 0 || (issueObj.issue.volume ? issueObj.issue.volume : '').trim().length > 0) {
      volume += ((issueObj.issue.volume ? issueObj.issue.volume : '').trim().length > 0 ? `<volume>${issueObj.issue.volume}</volume>` : ``)

      var volumeDoiData = ''
      if ((issueObj.issue.volumeDoi ? issueObj.issue.volumeDoi : '').trim().length > 0 || (issueObj.issue.volumeUrl ? issueObj.issue.volumeUrl : '').trim().length > 0 ) {
        volumeDoiData += ((issueObj.issue.volumeDoi ? issueObj.issue.volumeDoi : '').trim().length > 0 ? `<doi>${issueObj.issue.volumeDoi}</doi>` : ``)
        volumeDoiData += ((issueObj.issue.volumeUrl ? issueObj.issue.volumeUrl : '').trim().length > 0 ? `<resource>${issueObj.issue.volumeUrl}</resource>` : ``)
        volumeDoiData = `<doi_data>${volumeDoiData}</doi_data>`
      }

      volume = `<journal_volume>${volume}${volumeDoiData}</journal_volume>`
    }

    // archive locations
    var archiveLocation = ''
    if (issueObj.issue.archiveLocation.trim().length > 0) {
      archiveLocation = `<archive_locations><archive name="${issueObj.issue.archiveLocation}"/></archive_locations>`
    }

    return `<?xml version="1.0" encoding="UTF-8"?><crossref xmlns="http://www.crossref.org/xschema/1.1"><journal_issue>${getContributor(issueObj.optionalIssueInfo)}${titles}${publicationOnlineDate}${publicationPrintDate}${volume}${issue}${specialNumbering}${archiveLocation}${doiData}</journal_issue></crossref>`
    //took out xsi:schemaLocation="http://www.crossref.org/xschema/1.1 http://doi.crossref.org/schemas/unixref1.1.xsd" per Mikes request
}



function lowerCaseFirst (string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}
