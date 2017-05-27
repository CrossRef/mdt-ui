import React, { Component } from 'react'
import _ from 'lodash'

const Languages = require('./language.json')
import { ArchiveLocations } from './archiveLocations'
const PublicationTypes = require('./publicationTypes.json')
const AppliesTo = require('./appliesTo.json')
const IdentifierTypes = require('./identifierTypes.json')
import xmldoc from './xmldoc'
import objectSearch from './objectSearch'

const parseXMLIssue = function (xml) {
    var retObj = {}
    const parsedIssue = xmldoc(xml)

    // article loading
    const issueTitle = objectSearch(parsedIssue, 'title') ? objectSearch(parsedIssue, 'title') : ''
    const issue = objectSearch(parsedIssue, 'issue') ? objectSearch(parsedIssue, 'issue') : ''
    const issueDoi = objectSearch(parsedIssue, 'doi') ? objectSearch(parsedIssue, 'doi') : ''
    const issueUrl = objectSearch(parsedIssue, 'resource') ? objectSearch(parsedIssue, 'resource') : ''
    const special_numbering = objectSearch(parsedIssue, 'special_numbering') ? objectSearch(parsedIssue, 'special_numbering') : ''
    const publication_date = objectSearch(parsedIssue, 'publication_date')
    var onlinePubDate = undefined
    var printPubDate = undefined

    if (publication_date) {
        if (Array.isArray(publication_date)) {
            onlinePubDate = _.find(publication_date, (pubDate) => {
                if (pubDate) {
                    if (pubDate['-media_type'] === 'online') {
                        return pubDate
                    }
                }
            })

            printPubDate = _.find(publication_date, (pubDate) => {
                if (pubDate) {
                    if (pubDate['-media_type'] === 'print') {
                        return pubDate
                    }
                }
            })
        } else {
            if(publication_date['-media_type'] === 'print') {
                printPubDate = publication_date
            } else if(publication_date['-media_type'] === 'online') {
                onlinePubDate = publication_date
            }
        }
    }

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

    const journal_volume = objectSearch(parsedIssue, 'journal_volume')
    if (journal_volume) {
    var theVolume = objectSearch(journal_volume, 'volume') ? objectSearch(journal_volume, 'volume') : ''
    var volumeDoiData = objectSearch(journal_volume, 'doi_data') ? objectSearch(journal_volume, 'doi_data') : ''
    var volumeDoi = objectSearch(volumeDoiData, 'doi') ? objectSearch(volumeDoiData, 'doi') : ''
    var volumeUrl = objectSearch(volumeDoiData, 'resource') ? objectSearch(volumeDoiData, 'resource') : ''

    }

    const setIssue = {
    issue: issue,
    issueTitle: issueTitle,
    issueDoi: issueDoi,
    issueUrl: issueUrl,
    printDateYear: printDateYear,
    printDateMonth: printDateMonth,
    printDateDay: printDateDay,
    onlineDateYear: onlineDateYear,
    onlineDateMonth: onlineDateMonth,
    onlineDateDay: onlineDateDay,
    archiveLocation: archive,
    specialIssueNumber: special_numbering,
    volume: theVolume,
    volumeDoi: volumeDoi,
    volumeUrl: volumeUrl
    }

    // contributor loading
    const contributors = objectSearch(parsedIssue, 'contributors')
    var contributee = []
    // contributors are divied into 2 types
    // person_name and organization
    var person_name = undefined
    if (contributors) {
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
            role: person_name['-contributor_role'] ? person_name['-contributor_role'] : ''
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
                role: person['-contributor_role'] ? person['-contributor_role'] : ''
            }
            )
        })
        }
    }
    }

    if (contributee.length <= 0) {
    contributee.push(
        {
        firstName: '',
        lastName: '',
        suffix: '',
        affiliation: '',
        orcid: '',
        role: '',
        alternativeName: ''
        }
    )
    }

    var issueDoiDisabled = false
    if (issueDoi) {
    issueDoiDisabled = issueDoi.length > 0 ? true : false
    }

    var volumeDoiDisabled = false
    if (volumeDoi) {
    volumeDoiDisabled = volumeDoi.length > 0 ? true : false
    }

    retObj = _.extend(retObj, {
        issue: setIssue,
        optionalIssueInfo: contributee
    })

    return retObj
}
export default parseXMLIssue