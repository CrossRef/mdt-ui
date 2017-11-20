import React from 'react'
import _ from 'lodash'

import {objectSearch, xmldoc} from './helpers'


const parseXMLIssue = function (xml, duplicate = false, ownerPrefix = '') {
  let retObj = {showSection: false}


  const parsedIssue = xmldoc(xml)
  const journal_issue = objectSearch(parsedIssue, 'journal_issue')
  const journal_volume = objectSearch(parsedIssue, 'journal_volume')

  if (journal_volume) {
    delete journal_issue['journal_volume']
    var theVolume = objectSearch(journal_volume, 'volume') || ''
    var volumeDoiData = objectSearch(journal_volume, 'doi_data') || ''
    var volumeDoi = objectSearch(volumeDoiData, 'doi') || ''
    var volumeUrl = objectSearch(volumeDoiData, 'resource') || 'http://'
  }

  const issueTitle = objectSearch(journal_issue, 'title') || ''
  const issue = objectSearch(journal_issue, 'issue') || ''
  const issueDoi = objectSearch(journal_issue, 'doi') || ''
  const issueUrl = objectSearch(journal_issue, 'resource') || 'http://'
  const special_numbering = objectSearch(parsedIssue, 'special_numbering') || ''
  let publication_date = objectSearch(journal_issue, 'publication_date')

  if(!Array.isArray(publication_date)) publication_date = [publication_date] //Code below wants array of values, but if we accept only 1 date, we get only 1 object, so we transform into array

  const onlinePubDate = _.find(publication_date, (pubDate) => {
    if (pubDate) {
      if (pubDate['-media_type'] === 'online') {
        return pubDate
      }
    }
  })

  const printPubDate = _.find(publication_date, (pubDate) => {
    if (pubDate) {
      if (pubDate['-media_type'] === 'print') {
        return pubDate
      }
    }
  })
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

  const archiveLocations = objectSearch(parsedIssue, 'archive_locations')
  var archive = ''
  if (archiveLocations) {
    archive = archiveLocations.archive['-name']
  }

  const setIssue = {
    issue: issue,
    issueTitle: issueTitle,
    issueDoi: duplicate ? ownerPrefix + '/' : issueDoi,
    issueUrl: duplicate ?  'http://' : issueUrl,
    printDateYear: printDateYear,
    printDateMonth: printDateMonth,
    printDateDay: printDateDay,
    onlineDateYear: onlineDateYear,
    onlineDateMonth: onlineDateMonth,
    onlineDateDay: onlineDateDay,
    archiveLocation: archive,
    specialIssueNumber: special_numbering,
    volume: theVolume || '',
    volumeDoi: duplicate ? ownerPrefix + '/' : (volumeDoi || ''),
    volumeUrl: volumeUrl || 'http://'
  }

  // contributor loading
  const contributors = objectSearch(parsedIssue, 'contributors')
  var contributee = []
  // contributors are divied into 2 types
  // person_name and organization
  var person_name = undefined
  if (contributors) {
    retObj.showSection = true
    person_name = objectSearch(contributors, 'person_name')

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
            alternativeName: person_name['alt-name'] ? person_name['alt-name'] : '',
            role: person_name['-contributor_role'] ? person_name['-contributor_role'] : '',
            errors: {}
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
              alternativeName: person['alt-name'] ? person['alt-name'] : '',
              role: person['-contributor_role'] ? person['-contributor_role'] : '',
              errors: {}
            }
          )
        })
      }
    }
  }

  if (contributee.length <= 0) {
    retObj.showSection = false
    contributee.push(
      {
        firstName: '',
        lastName: '',
        suffix: '',
        affiliation: '',
        orcid: '',
        role: '',
        alternativeName: '',
        errors: {}
      }
    )
  }

  retObj = _.extend(retObj, {
      issue: setIssue,
      optionalIssueInfo: contributee
  })

  return retObj
}
export default parseXMLIssue