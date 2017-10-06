import {Map, fromJS} from 'immutable'

import { getSubItems } from './getSubItems'
import {cardNames} from './crossmarkHelpers'
import { validDate } from './date'
import {asyncCheckDupeDoi, isDOI, isURL} from './helpers'



export async function asyncValidateArticle (data, crossmark, ownerPrefix, doiDisabled = false) {
  const { title, doi, url, printDateYear, printDateMonth, printDateDay, onlineDateYear, onlineDateMonth, onlineDateDay, firstPage, lastPage } = data.article
  const {pubHist, peer, copyright, supp, other, clinical, update} = cardNames

  let criticalErrors = {
    title: !title,
    doi: false,
    invaliddoi: false,
    invalidDoiPrefix: false,
    licenseFreeToRead: false,
    dupedoi: false
  }

  if(!doiDisabled) {
    criticalErrors.doi = !doi
    criticalErrors.invaliddoi = criticalErrors.doi ? false : !isDOI(doi)
    criticalErrors.invalidDoiPrefix = criticalErrors.doi || criticalErrors.invaliddoi ? false : (doi.split('/')[0] !== ownerPrefix)
    criticalErrors.dupedoi = !criticalErrors.doi && !criticalErrors.invaliddoi && !criticalErrors.invalidDoiPrefix && await asyncCheckDupeDoi(doi)
  }

  if (data.addInfo.freetolicense){
    criticalErrors.licenseFreeToRead = true
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
    [`${pubHist} Label`]: false,

    [`${peer} Label`]: false,
    [`${peer} Href`]: false,

    [`${copyright} Label`]: false,
    [`${copyright} Href`]: false,

    [`${other} Label`]: false,
    [`${other} Href`]: false,

    [`${supp} Href`]: false,

    [`${update} Type`]: false,
    [`${update} DOI`]: false,
    [`${update} DOIinvalid`]: false,
    [`${update} Date`]: false,

    [`${clinical} Registry`]: false,
    [`${clinical} TrialNumber`]: false
  }
  warnings.url = !url||url==='http://'
  warnings.invalidurl = !!(!warnings.url && !isURL(url))

  warnings.printDateYear = hasDate ? false : !printDateYear
  warnings.printDateIncomplete = !!(!printDateYear && (printDateMonth || printDateDay))
  warnings.printDateInvalid = warnings.printDateIncomplete ? false : !validDate(printDateYear, printDateMonth, printDateDay)

  warnings.onlineDateYear = hasDate ? false : !onlineDateYear
  warnings.onlineDateIncomplete = !!(!onlineDateYear && (onlineDateMonth || onlineDateDay))
  warnings.onlineDateInvalid = warnings.onlineDateIncomplete ? false : !validDate(onlineDateYear, onlineDateMonth, onlineDateDay)

  warnings.firstPage = !!(lastPage && !firstPage)
  warnings.simCheckUrlInvalid = !!(data.addInfo.similarityCheckURL !== 'http://' && data.addInfo.similarityCheckURL && !isURL(data.addInfo.similarityCheckURL))


  //validate License subItems
  const licenses = getSubItems(data.license).map((license, i) => {
    const {acceptedDateYear, acceptedDateMonth, acceptedDateDay, appliesto, licenseurl} = license
    if((licenseurl&&licenseurl!=='http://')) criticalErrors.licenseFreeToRead = false

    const errors = {
      licenseUrl: criticalErrors.licenseFreeToRead,
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

    if((!licenseurl||licenseurl==='http://') && (thereIsDate || appliesto)) {
      errors.licenseUrl = true
      warnings.licenseUrl = true
    }

    if(!errors.licenseUrl) {
      const urlInvalid = !isURL(licenseurl)
      errors.licenseUrlInvalid = urlInvalid
      warnings.licenseUrlInvalid = urlInvalid
    }

    return {...license, errors}
  })

  if(criticalErrors.licenseFreeToRead) {  // if no licenses have a date and free to license is on, make first license require a date
    if(!licenses.length) {
      licenses[0] = {
        errors: {}
      }
    }
    licenses[0].errors.licenseUrl = true
  }

  //validate contributor subItems
  const contributors = getSubItems(data.contributors).map( contributor => {
    const {firstName, lastName, suffix, affiliation, orcid, role, groupAuthorName, groupAuthorRole} = contributor
    const errors = {
      contributorLastName: firstName && !lastName,
      contributorRole: (lastName || firstName || suffix || affiliation || orcid) && !role,
      contributorGroupName: groupAuthorRole && !groupAuthorName,
      contributorGroupRole: groupAuthorName && !groupAuthorRole
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
            label: !attributes.get('label'),
            href: (()=>{
              const href = attributes.get('href')
              return href ? !isURL(href) : false
            })()
          }

          if(errors.label) warnings[`${card} Label`] = true
          if(errors.href) warnings[`${card} Href`] = true

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
      updateMap.entrySeq().forEach(([i, attributes])=>{
        const doi = attributes.get('DOI')
        const errors = {
          type: !attributes.get('type'),
          DOI: !doi || !isDOI((doi)),
          year: !attributes.get('year'),
          month: !attributes.get('month'),
          day: !attributes.get('day')
        }
        if(errors.type) warnings[`${update} Type`] = true
        if(errors.DOI) !doi ? warnings[`${update} DOI`] = true : warnings[`${update} DOIinvalid`] = true
        if(errors.year || errors.month || errors.day) warnings[`${update} Date`] = true

        const keyPath = [update, i, 'errors']
        allErrors.push([keyPath, errors])
      })
    }

    const clinicalMap =newReduxForm.get(clinical)
    if(clinicalMap) {
      clinicalMap.entrySeq().forEach(([i, attributes])=>{
        const errors = {
          registry: !attributes.get('registry'),
          trialNumber: !attributes.get('trialNumber')
        }
        if(errors.registry) warnings[`${clinical} Registry`] = true
        if(errors.trialNumber) warnings[`${clinical} TrialNumber`] = true

        const keyPath = [clinical, i, 'errors']
        allErrors.push([keyPath, errors])
      })
    }

    // withMutations is a performant way of making multiple changes to immutable objects, instead of making a new copy for each change
    newReduxForm = newReduxForm.withMutations(map => {
      for (const errorData of allErrors) {
        const [keyPath, errors] = errorData
        map.setIn(keyPath, errors)
      }
    })
  }

  return { criticalErrors, warnings, licenses, contributors, relatedItems, newReduxForm }
}





export async function asyncValidateIssue (issueData, optionalIssueInfo, ownerPrefix, issueDoiDisabled = false) {
  const { issueDoi, issue, issueUrl, printDateYear, printDateMonth, printDateDay, onlineDateYear, onlineDateMonth, onlineDateDay, volume, volumeDoi, volumeUrl } = issueData

  function doiUnchanged (doi) {
    return doi.length <= `${ownerPrefix}/`.length
  }
  const issueDoiEntered = !doiUnchanged(issueDoi)

  let criticalErrors = {
    issueVolume: !volume && !issue,

    invalidissuedoi: false,
    invalidIssueDoiPrefix: false,
    dupeissuedoi: false,
  }

  if(!issueDoiDisabled && issueDoiEntered) {
    criticalErrors.invalidissuedoi = !isDOI(issueDoi)
    criticalErrors.invalidIssueDoiPrefix = !criticalErrors.issuedoi && !criticalErrors.invalidissuedoi && issueDoi.split('/')[0] !== ownerPrefix
    criticalErrors.dupeissuedoi = !criticalErrors.issuedoi && !criticalErrors.invalidissuedoi && !criticalErrors.invalidIssueDoiPrefix && await asyncCheckDupeDoi(issueDoi)
  }

  const hasDate = !!(printDateYear || onlineDateYear)
  let warnings = {
    //issuedoi: !issueDoi || doiUnchanged(issueDoi),
    issueUrl: !issueUrl || issueUrl === 'http://',
    invalidissueurl: !criticalErrors.issueUrl && !isURL(issueUrl),

    printDateYear: hasDate ? false : !printDateYear,
    onlineDateYear: hasDate ? false : !onlineDateYear,

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



  warnings.printDateIncomplete = !warnings.printDateYear && !!((printDateMonth || printDateDay) && !printDateYear)
  warnings.printDateInvalid = !warnings.printDateYear && !warnings.printDateIncomplete && !validDate(printDateYear, printDateMonth, printDateDay)

  warnings.onlineDateIncomplete = !warnings.onlineDateYear && !!((onlineDateMonth || onlineDateDay) && !onlineDateYear)
  warnings.onlineDateInvalid = !warnings.onlineDateYear && !warnings.onlineDateIncomplete && !validDate(onlineDateYear, onlineDateMonth, onlineDateDay)
  warnings.dupeDois = issueDoi === volumeDoi

  if(volume || (volumeDoi && !doiUnchanged(volumeDoi)) || (volumeUrl && volumeUrl !== 'http://')) {
    warnings.volumedoi = !volumeDoi || doiUnchanged(volumeDoi)
    warnings.invalidvolumedoi = !warnings.volumedoi && !isDOI(volumeDoi)
    warnings.invalidVolumeDoiPrefix = !warnings.volumedoi && !warnings.invalidvolumedoi && volumeDoi.split('/')[0] !== ownerPrefix
    warnings.dupevolumedoi = !warnings.volumedoi && !warnings.invalidvolumedoi && !warnings.invalidVolumeDoiPrefix && await asyncCheckDupeDoi(volumeDoi)
    warnings.volumeUrl = !volumeUrl || volumeUrl === 'http://'
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