import React from 'react'
import _ from 'lodash'
import { deParseCrossmark } from './crossmarkHelpers'

import xmldoc from './xmldoc'
import objectSearch from './objectSearch'

const parseXMLArticle = function (articleXML) {
    var retObj = {}
    const parsedArticle = xmldoc(articleXML)
    // article loading
    let publication_date = objectSearch(parsedArticle, 'publication_date');
    if(publication_date && !Array.isArray(publication_date)) publication_date = [publication_date];

    const onlinePubDate = publication_date ? _.find(publication_date, (pubDate) => {
        if (pubDate['-media_type'] === 'online') {
        return pubDate
        }
    }) : null;

    const printPubDate = publication_date ? _.find(publication_date, (pubDate) => {
        if (pubDate['-media_type'] === 'print') {
        return pubDate
        }
    }) : null;

    var printDateYear = ''
    var printDateMonth = ''
    var printDateDay = ''
    if (printPubDate) {
        printDateYear = printPubDate['year'] ? printPubDate['year'] : ''
        printDateMonth = printPubDate['month'] ? printPubDate['month'] : ''
        printDateDay = printPubDate['day'] ? printPubDate['day'] : ''
    }

    var onlineDateYear = ''
    var onlineDateMonth = ''
    var onlineDateDay = ''
    if (onlinePubDate) {
        onlineDateYear = onlinePubDate['year'] ? onlinePubDate['year'] : ''
        onlineDateMonth = onlinePubDate['month'] ? onlinePubDate['month'] : ''
        onlineDateDay = onlinePubDate['day'] ? onlinePubDate['day'] : ''
    }

    const acceptedPubDate = objectSearch(parsedArticle, 'acceptance_date')

    var acceptedDateYear = ''
    var acceptedDateMonth = ''
    var acceptedDateDay = ''
    if (acceptedPubDate) {
        acceptedDateYear = acceptedPubDate['year'] ? acceptedPubDate['year'] : ''
        acceptedDateMonth = acceptedPubDate['month'] ? acceptedPubDate['month'] : ''
        acceptedDateDay = acceptedPubDate['day'] ? acceptedPubDate['day'] : ''
    }

    const titles = objectSearch(parsedArticle, 'titles')
    const title = titles.title.trim()

    var originallanguagetitle = ''
    if (titles.original_language_title) {
        originallanguagetitle = (titles.original_language_title.trim().length > 0) ? titles.original_language_title.trim() : ''
    }
    // 0 is subtitle, 1 is original language subtitle
    var subtitle = ''
    var originallanguagetitlesubtitle = ''

    if (titles.subtitle) {
        if (titles.subtitle[0]) {
        subtitle = (titles.subtitle[0].trim().length > 0) ? titles.subtitle[0].trim() : ''
        }
        if (titles.subtitle[1]) {
        originallanguagetitlesubtitle = (titles.subtitle[1].trim().length > 0) ? titles.subtitle[1].trim() : ''
        }
    }

    const pages = objectSearch(parsedArticle, 'pages')

    var firstPage = ''
    var lastPage = ''
    if (pages) {
        firstPage = pages.first_page ? pages.first_page : ''
        lastPage = pages.last_page ? pages.last_page : ''
    }

    const abstractHolder = objectSearch(parsedArticle, 'jats:abstract')
    var abstract = ''
    if (abstractHolder) {
        abstract = objectSearch(abstractHolder, 'jats:p')
    }
    var doiData = objectSearch(parsedArticle, 'doi_data')
    const doi = doiData.doi
    const url = doiData.resource

    const publisherItem = objectSearch(parsedArticle, 'publisher_item')
    var locationId = ''
    if (publisherItem) {
        locationId = objectSearch(publisherItem, '#text')
    }

    var article = {
        title:title,
        doi: doi,
        subtitle: subtitle,
        originallanguagetitle: originallanguagetitle,
        originallanguagetitlesubtitle: originallanguagetitlesubtitle,
        url: url,
        printDateYear: printDateYear,
        printDateMonth: printDateMonth,
        printDateDay: printDateDay,
        onlineDateYear: onlineDateYear,
        onlineDateMonth: onlineDateMonth,
        onlineDateDay: onlineDateDay,
        acceptedDateYear: acceptedDateYear,
        acceptedDateMonth: acceptedDateMonth,
        acceptedDateDay: acceptedDateDay,
        firstPage: firstPage,
        lastPage: lastPage,
        locationId: locationId,
        abstract: abstract
    }

    retObj = _.extend(retObj, {
        article: article
    })

    // additional info loading
    const publicationType = objectSearch(parsedArticle, '-publication_type')
    const archiveLocations = objectSearch(parsedArticle, 'archive_locations')
    var archive = ''
    if (archiveLocations) {
        archive = archiveLocations.archive['-name']
    }
    const item = objectSearch(doiData, 'item')
    var similarityCheckURL = ''
    if (item) {
        similarityCheckURL = objectSearch(item, 'resource')
    }
    const language = objectSearch(parsedArticle, '-language')

    const freeToRead = objectSearch(parsedArticle, 'ai:free_to_read')

    const addInfo = {
        archiveLocation: archive,
        language: language ? language : '',
        publicationType: publicationType ? publicationType : '',
        similarityCheckURL: similarityCheckURL ? similarityCheckURL : '',
        freetolicense: freeToRead ? 'yes' : 'no'
    }

    retObj = _.extend(retObj, {
        addInfo: addInfo
    })

    retObj.openItems={}
    retObj.openItems.addInfo = !!(archiveLocations || language || publicationType || similarityCheckURL || freeToRead);

    // contributor loading
    const getOrganization = true;
    var contributee = getContributors(parsedArticle, getOrganization);

    const thereAreContributors = contributee.length > 0;
    if (!thereAreContributors) {
        contributee.push({
            firstName: '',
            lastName: '',
            suffix: '',
            affiliation: '',
            orcid: '',
            role: '',
            groupAuthorName: '',
            groupAuthorRole: ''
        })
    }

    retObj.openItems.Contributors = thereAreContributors;

    retObj = _.extend(retObj, {
        contributors: contributee
    })

    // fundings loading
    const fundings = objectSearch(parsedArticle, 'fr:assertion')
    var funders = []
    retObj.openItems.Funding=!!fundings

    if (fundings) {
        if (!Array.isArray(fundings)) {
            // only 1 funder
            // 0 is the actual funder data
            // 1 is the grantnumbers
            const thefunder = objectSearch(fundings, 'fr:assertion')
            var funderName = ''
            var funderRegId = ''
            var funderIdent = ''
            var grants = []
            // because I don't know what is returned back from backend cause there is no validation, I need to loop
            for(var i = 0; i < thefunder.length; i++) {
              if (thefunder[i]['-name'] === 'funder_name'){
                  funderName = thefunder[i]['#text'].trim()
                  // within hte name, there is the funder ID
                  const thefunderReg = objectSearch(thefunder[i], 'fr:assertion')
                  if (thefunderReg) {
                      funderIdent = thefunderReg['#text']
                      funderRegId = funderIdent.substr(funderIdent.lastIndexOf('/')+1, funderIdent.length -1)
                  }

              } else if (thefunder[i]['-name'] === 'award_number'){
                  grants.push(thefunder[i]['#text'])
              }
            }
            funders.push({
              fundername: funderName,
              funderRegistryID: funderRegId,
              funder_identifier: funderIdent,
              grantNumbers: grants.length > 0 ? grants : ['']
            })
        } else {
            _.each(fundings, (fund) => {
              const thefunder = objectSearch(fund, 'fr:assertion')
              var funderName = ''
              var funderRegId = ''
              var funderIdent = ''
              var grants = []
              // because I don't know what is returned back from backend cause there is no validation, I need to loop
              for(var i = 0; i < thefunder.length; i++) {
                  if (thefunder[i]['-name'] === 'funder_name'){
                    funderName = thefunder[i]['#text'].trim()
                    // within hte name, there is the funder ID
                    const thefunderReg = objectSearch(thefunder[i], 'fr:assertion')
                    if (thefunderReg) {
                        funderIdent = thefunderReg['#text']
                        funderRegId = funderIdent.substr(funderIdent.lastIndexOf('/')+1, funderIdent.length -1)
                    }
                  } else if (thefunder[i]['-name'] === 'award_number'){
                    grants.push(thefunder[i]['#text'])
                  }
              }
              funders.push({
                  fundername: funderName,
                  funderRegistryID: funderRegId,
                  funder_identifier: funderIdent,
                  grantNumbers: grants.length > 0 ? grants : ['']
              })
            })
        }
    }

    if (funders.length <= 0) {
        funders.push({
            fundername: '',
            funderRegistryID: '',
            funder_identifier: '',
            grantNumbers: ['']
        })
    }

    retObj = _.extend(retObj, {
        funding: funders
    })

    // license loading
    var lic = getLicenses(parsedArticle, retObj)

    const thereAreLicenses = lic.length > 0;

    if (!thereAreLicenses) {
        lic.push({
            acceptedDateDay: '',
            acceptedDateMonth: '',
            acceptedDateYear: '',
            appliesto: '',
            licenseurl: ''
        })
    }

    retObj.openItems.Licenses = thereAreLicenses;
    retObj = _.extend(retObj, {
        license: lic
    })

    // related items
    const relatedItems = objectSearch(parsedArticle, 'related_item')
    retObj.openItems.relatedItems= !!relatedItems;
    var relItem = []

    if (relatedItems) {
        if (!Array.isArray(relatedItems)) {
          const inter_work_relation = objectSearch(relatedItems, 'inter_work_relation')
          relItem.push({
              description: relatedItems['description'] ? relatedItems['description'] : '',
              identifierType: inter_work_relation['-identifier-type'] ? inter_work_relation['-identifier-type'] : '',
              relatedItemIdentifier: inter_work_relation['#text'] ? inter_work_relation['#text'] : '',
              relationType: inter_work_relation['-relationship-type'] ? inter_work_relation['-relationship-type'] : ''
          })
        } else {
          for(var i = 0; i < relatedItems.length; i++) {
            const inter_work_relation = objectSearch(relatedItems[i], 'inter_work_relation')
            relItem.push({
              description: relatedItems[i]['description'] ? relatedItems[i]['description'] : '',
              identifierType: inter_work_relation['-identifier-type'] ? inter_work_relation['-identifier-type'] : '',
              relatedItemIdentifier: inter_work_relation['#text'] ? inter_work_relation['#text'] : '',
              relationType: inter_work_relation['-relationship-type'] ? inter_work_relation['-relationship-type'] : ''
            })
          }
        }
    }

    if (relItem.length <= 0) {
        relItem.push({
            description: '',
            identifierType: '',
            relatedItemIdentifier: '',
            relationType: ''
        })
    }

    retObj = _.extend(retObj, {
        relatedItems: relItem
    })

    if(parsedArticle.crossref) {
      if(parsedArticle.crossref.journal.journal_article.crossmark) {
        const {reduxForm, showCards} = deParseCrossmark(parsedArticle.crossref.journal.journal_article.crossmark);
        if(reduxForm && showCards) {
          retObj.crossmark = {reduxForm, showCards};
        }
      }
    }

    retObj.openItems.apiReturned = true;
    return retObj
}
export default parseXMLArticle




export function getLicenses (parsedArticle) {
  // license loading
  const licences = objectSearch(parsedArticle, 'ai:license_ref')

  var lic = []

  if (licences) {
    if (!Array.isArray(licences)) {
      const licAcceptedDate = licences['-start_date'].split('-')
      lic.push({
        acceptedDateDay: licAcceptedDate[2] ? licAcceptedDate[2] : '',
        acceptedDateMonth: licAcceptedDate[1] ? licAcceptedDate[1] : '',
        acceptedDateYear: licAcceptedDate[0] ? licAcceptedDate[0] : '',
        appliesto: licences['-applies_to'] ? licences['-applies_to'] : '',
        licenseurl: licences['#text'] ? licences['#text'] : ''
      })
    } else {
      for(var i = 0; i < licences.length; i++) {
        const licAcceptedDate = licences[i]['-start_date'].split('-')
        lic.push({
          acceptedDateDay: licAcceptedDate[2] ? licAcceptedDate[2] : '',
          acceptedDateMonth: licAcceptedDate[1] ? licAcceptedDate[1] : '',
          acceptedDateYear: licAcceptedDate[0] ? licAcceptedDate[0] : '',
          appliesto: licences[i]['-applies_to'] ? licences[i]['-applies_to'] : '',
          licenseurl: licences[i]['#text'] ? licences[i]['#text'] : ''
        })
      }
    }
  }
  return lic
}


export function getContributors (parsedArticle, getOrganization) {
  // contributor loading
  var contributors = objectSearch(parsedArticle, 'contributors');

  var contributee = []
  // contributors are divied into 2 types
  // person_name and organization
  var person_name = undefined
  var organization = undefined
  if (contributors) {
    person_name = objectSearch(contributors, 'person_name')
    if (getOrganization) organization = objectSearch(contributors, 'organization')

    if (person_name) { // if exist
      if (!Array.isArray(person_name)) {
        // there is ONE funder
        contributee.push(
          {
            firstName: person_name.given_name ? person_name.given_name : '',
            lastName: person_name.surname ? person_name.surname : '',
            suffix: person_name.suffix ? person_name.suffix : '',
            affiliation: person_name.affiliation ? person_name.affiliation : '',
            orcid: person_name.ORCID ? person_name.ORCID : '',
            role: person_name['-contributor_role'] ? person_name['-contributor_role'] : '',
            groupAuthorName: '',
            groupAuthorRole: ''
          }
        )
      } else { // its an array
        _.each(person_name, (person) => {
          contributee.push(
            {
              firstName: person.given_name ? person.given_name : '',
              lastName: person.surname ? person.surname : '',
              suffix: person.suffix ? person.suffix : '',
              affiliation: person.affiliation ? person.affiliation : '',
              orcid: person.ORCID ? person.ORCID : '',
              role: person['-contributor_role'] ? person['-contributor_role'] : '',
              groupAuthorName: '',
              groupAuthorRole: ''
            }
          )
        })
      }
    }

    if (organization) {

      if (!Array.isArray(organization)) {
        // there is ONE organization
        contributee.push(
          {
            firstName: '',
            lastName: '',
            suffix: '',
            affiliation: '',
            orcid: '',
            role: '',
            groupAuthorName: organization['#text'] ? organization['#text'] : '',
            groupAuthorRole: organization['-contributor_role'] ? organization['-contributor_role'] : ''
          }
        )
      } else { // its an array
        _.each(organization, (org) => {
          contributee.push(
            {
              firstName: '',
              lastName: '',
              suffix: '',
              affiliation: '',
              orcid: '',
              role: '',
              groupAuthorName: org['#text'] ? org['#text'] : '',
              groupAuthorRole: org['-contributor_role'] ? org['-contributor_role'] : ''
            }
          )
        })
      }
    }
  }
  return contributee
}