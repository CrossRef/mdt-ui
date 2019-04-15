import {Map, fromJS} from 'immutable'

import { getSubItems } from './getSubItems'
import {cardNames} from './crossmarkHelpers'
import {asyncCheckDupeDoi, isDOI, isURL, doiEntered, urlEntered, validDate, validOrcid} from './helpers'
import defaultArticleState from '../components/AddArticlePage/defaultState'
import * as api from '../actions/api'


export async function asyncValidateArticle (data, crossmark, publicationDOIPrefix, doiDisabled = false, articleDOIPrefix, publicationOwner) {
  const { title, doi, url, printDateYear, printDateMonth, printDateDay, onlineDateYear, onlineDateMonth, onlineDateDay, firstPage, lastPage, freetolicense, locationId } = data.article
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
    criticalErrors.doi = !doiEntered(doi, publicationDOIPrefix)
    criticalErrors.invaliddoi = criticalErrors.doi ? false : !isDOI(doi)
    criticalErrors.invalidDoiPrefix = criticalErrors.doi || criticalErrors.invaliddoi ? false : (articleDOIPrefix !== publicationDOIPrefix || publicationOwner ? publicationOwner !== articleDOIPrefix : false)
    criticalErrors.dupedoi = !criticalErrors.doi && !criticalErrors.invaliddoi && !criticalErrors.invalidDoiPrefix && await asyncCheckDupeDoi(doi)
  }

  criticalErrors.freetolicense = freetolicense === 'yes'


  const hasDate = !!(printDateYear || onlineDateYear)
  let warnings = {
    licenseUrl: false,
    licenseUrlInvalid: false,
    licenseDateIncomplete: false,
    licenseDateInvalid: false,

    contributorLastName: false,
    contributorSuffixLimit: false,
    affiliationLimit: false,
    contributorRole: false,
    contributorGroupName: false,
    contributorGroupRole: false,
    contributorOrcid: false,

    fundingName: false,

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
  warnings.firstPageLimit = firstPage.length > 32
  warnings.lastPageLimit = lastPage.length > 32
  warnings.lastPageLessFirst = lastPage && firstPage ? Number(lastPage) < Number(firstPage) : false
  warnings.locationIdLimit = locationId.length > 32
  warnings.simCheckUrlInvalid = urlEntered(data.addInfo.similarityCheckURL) && !isURL(data.addInfo.similarityCheckURL)


  const openSubItems = {}

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

  if(!licenses.length) {
    const defaultData = defaultArticleState.license[0]
    openSubItems.licenses = false
    licenses[0] = {...defaultData, errors: {...defaultData.errors}}
    licenses[0].errors.freetolicense = criticalErrors.freetolicense
  } else {
    openSubItems.licenses = true
  }


  //validate contributor subItems
  const contributors = getSubItems(data.contributors).map( contributor => {
    const {firstName, lastName, suffix, affiliation, orcid, role, groupAuthorName, groupAuthorRole} = contributor
    const errors = {
      contributorLastName: !!((firstName || suffix || affiliation || orcid || role) && !lastName),
      contributorSuffixLimit: suffix.length > 10,
      affiliationLimit: affiliation.length > 512,
      contributorRole: !!((lastName || firstName || suffix || affiliation || orcid) && !role),
      contributorGroupName: !!(groupAuthorRole && !groupAuthorName),
      contributorGroupRole: !!(groupAuthorName && !groupAuthorRole),
      contributorOrcid: orcid ? !validOrcid(orcid) : false
    }
    if(errors.contributorLastName) warnings.contributorLastName = true
    if(errors.contributorSuffixLimit) warnings.contributorSuffixLimit = true
    if(errors.affiliationLimit) warnings.affiliationLimit = true
    if(errors.contributorRole) warnings.contributorRole = true
    if(errors.contributorGroupName) warnings.contributorGroupName = true
    if(errors.contributorGroupRole) warnings.contributorGroupRole = true
    if(errors.contributorOrcid) warnings.contributorOrcid = true

    return {...contributor, errors}
  })

  if(!contributors.length) {
    const defaultData = defaultArticleState.contributors[0]
    openSubItems.contributors = false
    contributors[0] = {...defaultData, errors: {...defaultData.errors}}
  } else {
    openSubItems.contributors = true
  }


  //validate Funding subItems
  const funding = getSubItems(data.funding).map(funder => {
    const {funderName, grantNumbers} = funder
    const errors = {
      fundingName: !!((grantNumbers) && !funderName)
    }
    if(errors.fundingName) warnings.fundingName = true

    return {...funder, errors}
  })

  if(!funding.length) {
    const defaultData = defaultArticleState.funding[0]
    openSubItems.funding = false
    funding[0] = {...defaultData, errors: {...defaultData.errors}}
  } else {
    openSubItems.funding = true
  }


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

  if(!relatedItems.length) {
    const defaultData = defaultArticleState.relatedItems[0]
    openSubItems.relatedItems = false
    relatedItems[0] = {...defaultData, errors: {...defaultData.errors}}
  } else {
    openSubItems.relatedItems = true
  }


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

        const doi = attributes.get('doi')
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
          [`${update} date`]: yearError || monthError || dayError,
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

  return { criticalErrors, warnings, licenses, contributors, funding, relatedItems, openSubItems, newReduxForm }
}





export async function asyncValidateIssue ({issueData, optionalIssueInfo, ownerPrefix, publicationRecords, issueDoiDisabled, checkDuplicateId}) {
  const { issueDoi, issue, issueTitle, issueUrl, printDateYear, printDateMonth, printDateDay, onlineDateYear, onlineDateMonth, onlineDateDay, volume, volumeDoi, volumeUrl, specialIssueNumber } = issueData

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
    let result = await api.getItem(issueDoi).catch(e=>{})
    let dupDoi = false
    if (result){ // we have a response to the DOI, check contents
      if (!result.message.contains[0] || result.message.contains[0].type !== 'issue'){ // if no contains, then it's a publication, otherwise check type (issues and volumes are issue type)
        dupDoi=true
      } else{
        // got an issue, check contents
        const issueContent = result.message.contains[0]
        const issueTitle = JSON.stringify(issueContent.title)
        const storedOwnerPrefix= issueContent['owner-prefix']
        if (storedOwnerPrefix !== ownerPrefix){
          criticalErrors.invalidIssueDoiPrefix=true;
        }
      }
    }
    criticalErrors.dupeissuedoi = !criticalErrors.issuedoi && !criticalErrors.invalidissuedoi && !criticalErrors.invalidIssueDoiPrefix && dupDoi
  }
  const hasDate = !!(printDateYear || onlineDateYear)
  let warnings = {
    issueNumberLimit: issue.length > 32,
    issuedoi: issueUrlEntered && !issueDoiEntered,
    issueUrl: issueDoiEntered && !issueUrlEntered,
    invalidissueurl: false,

    printDateIncomplete: false,
    printDateInvalid: false,
    printDateYear: hasDate ? false : !printDateYear,
    onlineDateYear: hasDate ? false : !onlineDateYear,
    onlineDateIncomplete: false,
    onlineDateInvalid: false,

    specialNumberLimit: specialIssueNumber.length > 15,

    volumeNumberLimit: volume.length > 32,
    volumedoi: false,
    invalidvolumedoi: false,
    invalidVolumeDoiPrefix: false,
    dupevolumedoi: false,
    volumeUrl: false,
    invalidvolumeurl: false,
    dupeDois: false,

    contributorLastName: false,
    contributorSuffixLimit: false,
    affiliationLimit: false,
    contributorRole: false,
    contributorOrcid: false,

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
    let result = await api.getItem(volumeDoi).catch(e=>{})
    let dupVolDoi = false
    if (result){ // we have a response to the DOI, check contents
      if (!result.message.contains[0] || result.message.contains[0].type !== 'issue'){ // if no contains, then it's a publication, otherwise check type (issues and volumes are issue type)
        dupVolDoi=true
      } else{
        // got an volume, check contents
        const volContent = result.message.contains[0]
        const storedOwnerPrefix= volContent['owner-prefix']
        if (storedOwnerPrefix !== ownerPrefix){
          criticalErrors.invalidVolumeDoiPrefix=true;
        }
      }
    }
    warnings.dupevolumedoi = !warnings.volumedoi && !warnings.invalidvolumedoi && !warnings.invalidVolumeDoiPrefix && dupVolDoi
    warnings.volumeUrl = !volumeUrlEntered
    warnings.invalidvolumeurl = !warnings.volumeUrl && !isURL(volumeUrl)
  }

  const enableVolumeDoi = warnings.volumedoi || warnings.invalidvolumedoi || warnings.invalidVolumeDoiPrefix


  //validate contributor subItems
  const contributors = getSubItems(optionalIssueInfo).map( contributor => {
    const {firstName, lastName, suffix, affiliation, orcid, alternativeName, role} = contributor
    const errors = {
      contributorLastName: !!((firstName || suffix || affiliation || orcid || alternativeName || role) && !lastName),
      contributorSuffixLimit: suffix.length > 10,
      affiliationLimit: affiliation.length > 512,
      contributorRole: (lastName || firstName || suffix || affiliation || alternativeName || orcid) && !role,
      contributorOrcid: orcid ? !validOrcid(orcid) : false
    }
    if(errors.contributorLastName) warnings.contributorLastName = true
    if(errors.contributorSuffixLimit) warnings.contributorSuffixLimit = true
    if(errors.affiliationLimit) warnings.affiliationLimit = true
    if(errors.contributorRole) warnings.contributorRole = true
    if(errors.contributorOrcid) warnings.contributorOrcid = true

    return {...contributor, errors}
  })

  return { criticalErrors, warnings, contributors, issueDoiEntered, enableVolumeDoi }
}