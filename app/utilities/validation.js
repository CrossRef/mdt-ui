import {Map, fromJS} from 'immutable'

import { getSubItems } from './getSubItems'
import {cardNames} from './crossmarkHelpers'
import { validDate } from './date'
import {asyncCheckDupeDoi, isDOI, isURL, doiEntered, urlEntered} from './helpers'
import defaultArticleState from '../components/AddArticlePage/defaultState'



export async function asyncValidateArticle (data, crossmark, ownerPrefix, doiDisabled = false) {
  const { title, doi, url, printDateYear, printDateMonth, printDateDay, onlineDateYear, onlineDateMonth, onlineDateDay, firstPage, lastPage, freetolicense } = data.article
  const {pubHist, peer, copyright, supp, other, clinical, update} = cardNames

  let criticalErrors = {
    title: !title,
    doi: false,
    invaliddoi: false,
    invalidDoiPrefix: false,
    freetolicense: false,
    dupedoi: false
  }

  if(!doiDisabled) {
    criticalErrors.doi = !doiEntered(doi, ownerPrefix)
    criticalErrors.invaliddoi = criticalErrors.doi ? false : !isDOI(doi)
    criticalErrors.invalidDoiPrefix = criticalErrors.doi || criticalErrors.invaliddoi ? false : (doi.split('/')[0] !== ownerPrefix)
    criticalErrors.dupedoi = !criticalErrors.doi && !criticalErrors.invaliddoi && !criticalErrors.invalidDoiPrefix && await asyncCheckDupeDoi(doi)
  }

  if (freetolicense === 'yes'){
    criticalErrors.freetolicense = true
  }

  const hasDate = !!(printDateYear || onlineDateYear)
  let warnings = {
    licenseUrl: false,
    licenseUrlInvalid: false,
    licenseDateIncomplete: false,
    licenseDateInvalid: false,

    contributorLastName: false,
    contributorRole: false,
    contributorGroupName: false,
    contributorGroupRole: false,

    relatedItemIdType: false,
    relatedItemRelType: false,
    relatedItemDoiInvalid: false,

    // crossmark errors
    [`${pubHist} label`]: false,

    [`${peer} label`]: false,
    [`${peer} href`]: false,

    [`${copyright} label`]: false,
    [`${copyright} href`]: false,

    [`${other} label`]: false,
    [`${other} href`]: false,

    [`${supp} href`]: false,

    [`${update} type`]: false,
    [`${update} doi`]: false,
    [`${update} doiInvalid`]: false,
    [`${update} doiNotExist`]: false,
    [`${update} date`]: false,

    [`${clinical} registry`]: false,
    [`${clinical} trialNumber`]: false
  }
  warnings.url = !urlEntered(url)
  warnings.invalidurl = !warnings.url && !isURL(url)

  warnings.printDateYear = hasDate ? false : !printDateYear
  warnings.printDateIncomplete = !!(!printDateYear && (printDateMonth || printDateDay)) || !!(printDateYear && printDateDay && !printDateMonth)
  warnings.printDateInvalid = warnings.printDateIncomplete ? false : !validDate(printDateYear, printDateMonth, printDateDay)

  warnings.onlineDateYear = hasDate ? false : !onlineDateYear
  warnings.onlineDateIncomplete = !!(!onlineDateYear && (onlineDateMonth || onlineDateDay)) || !!(onlineDateYear && onlineDateDay && !onlineDateMonth)
  warnings.onlineDateInvalid = warnings.onlineDateIncomplete ? false : !validDate(onlineDateYear, onlineDateMonth, onlineDateDay)

  warnings.firstPage = !!lastPage && !firstPage
  warnings.simCheckUrlInvalid = urlEntered(data.addInfo.similarityCheckURL) && !isURL(data.addInfo.similarityCheckURL)


  //validate License subItems
  const licenses = getSubItems(data.license).map((license, i) => {
    const {acceptedDateYear, acceptedDateMonth, acceptedDateDay, appliesto, licenseurl} = license
    const licenseUrlEntered = urlEntered(licenseurl)
    if(licenseUrlEntered && i === 0) {
      criticalErrors.freetolicense = false
    }

    const errors = {
      freetolicense: i===0 && criticalErrors.freetolicense,
      licenseUrl: false,
      licenseUrlInvalid: false,
      licenseDateIncomplete: false,
      licenseDateInvalid: false,
      licenseYear: false,
      licenseMonth: false,
      licenseDay: false
    }

    const thereIsDate = !!(acceptedDateDay || acceptedDateMonth || acceptedDateYear)
    if(thereIsDate) {
      if(!(acceptedDateDay && acceptedDateMonth && acceptedDateYear)) {
        errors.licenseDateIncomplete = true
        errors.licenseYear = !acceptedDateYear
        errors.licenseMonth = !acceptedDateMonth
        errors.licenseDay = !acceptedDateDay
        warnings.licenseDateIncomplete = true
      }
    }

    if(!errors.licenseDateIncomplete && !validDate(acceptedDateYear, acceptedDateMonth, acceptedDateDay)) {
      errors.licenseDateInvalid = true
      errors.licenseYear = true
      errors.licenseMonth = true
      errors.licenseDay = true
      warnings.licenseDateInvalid = true
    }

    if(!errors.freetolicense && !licenseUrlEntered && (thereIsDate || appliesto)) {
      errors.licenseUrl = true
      warnings.licenseUrl = true
    }

    if(!errors.licenseUrl && licenseUrlEntered) {
      const urlInvalid = !isURL(licenseurl)
      errors.licenseUrlInvalid = urlInvalid
      warnings.licenseUrlInvalid = urlInvalid
    }

    return {...license, errors}
  })

  if(criticalErrors.freetolicense) {
    if(!licenses.length) {
      licenses[0] = defaultArticleState.license[0]
      licenses[0].errors.freetolicense = true
    }
  }


  //validate contributor subItems
  const contributors = getSubItems(data.contributors).map( contributor => {
    const {firstName, lastName, suffix, affiliation, orcid, role, groupAuthorName, groupAuthorRole} = contributor
    const errors = {
      contributorLastName: !!(firstName && !lastName),
      contributorRole: !!((lastName || firstName || suffix || affiliation || orcid) && !role),
      contributorGroupName: !!(groupAuthorRole && !groupAuthorName),
      contributorGroupRole: !!(groupAuthorName && !groupAuthorRole)
    }
    if(errors.contributorLastName) warnings.contributorLastName = true
    if(errors.contributorRole) warnings.contributorRole = true
    if(errors.contributorGroupName) warnings.contributorGroupName = true
    if(errors.contributorGroupRole) warnings.contributorGroupRole = true

    return {...contributor, errors}
  })

  //validate relatedItem subItems
  const relatedItems = getSubItems(data.relatedItems).map( item => {
    const errors = {
      relatedItemIdType: !item.identifierType,
      relatedItemRelType: !item.relationType,
      relatedItemDoiInvalid: item.identifierType === 'doi' ? !isDOI(item.relatedItemIdentifier) : false
    }
    if(errors.relatedItemIdType) warnings.relatedItemIdType = true
    if(errors.relatedItemRelType) warnings.relatedItemRelType = true
    if(errors.relatedItemDoiInvalid) warnings.relatedItemDoiInvalid = true

    return {...item, errors}
  })

  // crossmark validation
  let newReduxForm
  if(crossmark && Map.isMap(crossmark)) {
    newReduxForm = crossmark
  } else {
    newReduxForm = crossmark ? fromJS(crossmark) : undefined
  }
  if(newReduxForm && newReduxForm.size) {
    const allErrors = []

    function validateLabelHref (card) {
      const map = newReduxForm.get(card)
      if(map) {
        map.entrySeq().forEach(([i, attributes])=>{
          const errors = {
            [`${card} label`]: !attributes.get('label'),
            [`${card} href`]: (()=>{
              const href = attributes.get('href')
              return href ? !isURL(href) : false
            })()
          }


          if(errors[[`${card} label`]]) {
            warnings[`${card} label`] = true
          }

          if(errors[`${card} href`]) {
            warnings[`${card} href`] = true
          }

          const keyPath = [card, i, 'errors']
          allErrors.push([keyPath, errors])
        })
      }
    }

    validateLabelHref(pubHist)
    validateLabelHref(peer)
    validateLabelHref(copyright)
    validateLabelHref(other)
    validateLabelHref(supp)

    const updateMap = newReduxForm.get(update)
    if(updateMap) {
      const entries = Array.from(updateMap.values())

      for (var i in entries){
        const attributes = entries[i]
        
        const doi = attributes.get('DOI')
        const doiInvalid = !!doi && !isDOI(doi)
        const doiNotExist = !!doi && !doiInvalid && !await asyncCheckDupeDoi(doi)

        const yearError = !attributes.get('year')
        const monthError = !attributes.get('month')
        const dayError = !attributes.get('day')

        const errors = {
          [`${update} type`]: !attributes.get('type'),
          [`${update} doi`]: !doi,
          [`${update} doiInvalid`]: doiInvalid,
          [`${update} doiNotExist`]: doiNotExist,
          [`${update} Date`]: yearError || monthError || dayError,
          year: yearError,
          month: monthError,
          day: dayError
        }
        if(errors[`${update} type`]) {
          warnings[`${update} type`] = true
        }

        if(errors[`${update} doi`]) {
          warnings[`${update} doi`] = true
        }

        if(errors[`${update} doiInvalid`]){
          warnings[`${update} doiInvalid`] = true
        }

        if (errors[`${update} doiNotExist`]) {
          warnings[`${update} doiNotExist`] = true
        }

        if(errors[`${update} date`]) {
          warnings[`${update} date`] = true
        }

        const keyPath = [update, i, 'errors']
        allErrors.push([keyPath, errors])
      }
    }

    const clinicalMap =newReduxForm.get(clinical)
    if(clinicalMap) {
      clinicalMap.entrySeq().forEach(([i, attributes])=>{
        const errors = {
          [`${clinical} registry`]: !attributes.get('registry'),
          [`${clinical} trialNumber`]: !attributes.get('trialNumber')
        }

        if(errors[`${clinical} registry`]) {
          warnings[`${clinical} registry`] = true
        }

        if(errors[`${clinical} trialNumber`]) {
          warnings[`${clinical} trialNumber`] = true
        }

        const keyPath = [clinical, i, 'errors']
        allErrors.push([keyPath, errors])
      })
    }

    // withMutations is a performant way of making multiple changes to immutable objects, instead of making a new copy for each change
    newReduxForm = newReduxForm.withMutations(map => {
      for (const errorData of allErrors) {
        const [keyPath, errors] = errorData

        //check if only errors and no fields
        const rowKeyPath = [keyPath[0], keyPath[1]]
        if(map.getIn(rowKeyPath).size === 1 && map.getIn(keyPath) ) {
          return map.deleteIn(rowKeyPath)
        }
        map.setIn(keyPath, errors)
      }
    })
  }

  return { criticalErrors, warnings, licenses, contributors, relatedItems, newReduxForm }
}





export async function asyncValidateIssue ({issueData, optionalIssueInfo, ownerPrefix, publicationRecords, issueDoiDisabled, checkDuplicateId}) {
  const { issueDoi, issue, issueTitle, issueUrl, printDateYear, printDateMonth, printDateDay, onlineDateYear, onlineDateMonth, onlineDateDay, volume, volumeDoi, volumeUrl } = issueData

  const issueDoiEntered = doiEntered(issueDoi, ownerPrefix)
  const issueUrlEntered = urlEntered(issueUrl)
  const volumeDoiEntered = doiEntered(volumeDoi, ownerPrefix)
  const volumeUrlEntered = urlEntered(volumeUrl)

  let criticalErrors = {
    issueVolume: !volume && !issue,
    volumeIssue: !volume && !issue,
    dupTitleIdIssue: false,
    dupTitleIdVolume: false,

    invalidissuedoi: false,
    invalidIssueDoiPrefix: false,
    dupeissuedoi: false,

    volume: false
  }

  if(checkDuplicateId) {
    criticalErrors.dupTitleIdIssue = !!publicationRecords[JSON.stringify({issue, volume, title: issueTitle})]
    criticalErrors.dupTitleIdVolume = criticalErrors.dupTitleIdIssue
  }

  if(!issueDoiDisabled && issueDoiEntered) {
    criticalErrors.invalidissuedoi = !isDOI(issueDoi)
    criticalErrors.invalidIssueDoiPrefix = !criticalErrors.issuedoi && !criticalErrors.invalidissuedoi && issueDoi.split('/')[0] !== ownerPrefix
    criticalErrors.dupeissuedoi = !criticalErrors.issuedoi && !criticalErrors.invalidissuedoi && !criticalErrors.invalidIssueDoiPrefix && await asyncCheckDupeDoi(issueDoi)
  }

  const hasDate = !!(printDateYear || onlineDateYear)
  let warnings = {
    issuedoi: issueUrlEntered && !issueDoiEntered,
    issueUrl: issueDoiEntered && !issueUrlEntered,
    invalidissueurl: false,

    printDateIncomplete: false,
    printDateInvalid: false,
    printDateYear: hasDate ? false : !printDateYear,
    onlineDateYear: hasDate ? false : !onlineDateYear,
    onlineDateIncomplete: false,
    onlineDateInvalid: false,

    volumedoi: false,
    invalidvolumedoi: false,
    invalidVolumeDoiPrefix: false,
    dupevolumedoi: false,
    volumeUrl: false,
    invalidvolumeurl: false,
    dupeDois: false,

    contributorLastName: false,
    contributorRole: false
  }

  warnings.invalidissueurl = issueUrlEntered && !isURL(issueUrl)
  warnings.printDateIncomplete = !warnings.printDateYear && !!((printDateMonth || printDateDay) && !printDateYear)
  warnings.printDateInvalid = !warnings.printDateYear && !warnings.printDateIncomplete && !validDate(printDateYear, printDateMonth, printDateDay)
  warnings.onlineDateIncomplete = !warnings.onlineDateYear && !!((onlineDateMonth || onlineDateDay) && !onlineDateYear)
  warnings.onlineDateInvalid = !warnings.onlineDateYear && !warnings.onlineDateIncomplete && !validDate(onlineDateYear, onlineDateMonth, onlineDateDay)
  warnings.dupeDois = issueDoiEntered && issueDoi === volumeDoi

  if(volumeDoiEntered || volumeUrlEntered) {
    criticalErrors.volume = !criticalErrors.issueVolume && !volume
    warnings.volumedoi = !volumeDoiEntered
    warnings.invalidvolumedoi = !warnings.volumedoi && !isDOI(volumeDoi)
    warnings.invalidVolumeDoiPrefix = !warnings.volumedoi && !warnings.invalidvolumedoi && volumeDoi.split('/')[0] !== ownerPrefix
    warnings.dupevolumedoi = !warnings.volumedoi && !warnings.invalidvolumedoi && !warnings.invalidVolumeDoiPrefix && await asyncCheckDupeDoi(volumeDoi)
    warnings.volumeUrl = !volumeDoiEntered
    warnings.invalidvolumeurl = !warnings.volumeUrl && !isURL(volumeUrl)
  }

  const enableVolumeDoi = warnings.volumedoi || warnings.invalidvolumedoi || warnings.invalidVolumeDoiPrefix


  //validate contributor subItems
  const contributors = getSubItems(optionalIssueInfo).map( contributor => {
    const {firstName, lastName, suffix, affiliation, orcid, alternativeName, role} = contributor
    const errors = {
      contributorLastName: firstName && !lastName,
      contributorRole: (lastName || firstName || suffix || affiliation || alternativeName || orcid) && !role,
    }
    if(errors.contributorLastName) warnings.contributorLastName = true
    if(errors.contributorRole) warnings.contributorRole = true

    return {...contributor, errors}
  })

  return { criticalErrors, warnings, contributors, issueDoiEntered, enableVolumeDoi }
}