import { getContributor } from '../../utilities/getSubItems'
import {doiEntered, urlEntered} from '../../utilities/helpers'



export default function (issueObj) {
  const {issue, optionalIssueInfo, ownerPrefix} = issueObj
  // the title
  const titles = issue.issueTitle.trim().length > 0 ? `<titles><title>${issue.issueTitle.trim()}</title></titles>` : ``

  // special numbering
  const specialNumbering = issue.specialIssueNumber.trim().length > 0 ? `<special_numbering>${issue.specialIssueNumber.trim()}</special_numbering>` : ``

  // special numbering
  const issueNumber = issue.issue.trim().length > 0 ? `<issue>${issue.issue.trim()}</issue>` : ``

  // the online date
  var publicationOnlineDate = ''
  if (issue.onlineDateYear.length > 0 || issue.onlineDateDay.length > 0 || issue.onlineDateMonth.length > 0) {
    publicationOnlineDate += (issue.onlineDateMonth.length > 0 ? `<month>${issue.onlineDateMonth}</month>` : ``)
    publicationOnlineDate += (issue.onlineDateDay.length > 0 ? `<day>${issue.onlineDateDay}</day>` : ``)
    publicationOnlineDate += (issue.onlineDateYear.length > 0 ? `<year>${issue.onlineDateYear}</year>` : ``)

    publicationOnlineDate = `<publication_date media_type="online">${publicationOnlineDate}</publication_date>`
  }

  // the print date
  var publicationPrintDate = ''
  if (issue.printDateYear.length > 0 || issue.printDateDay.length > 0 || issue.printDateMonth.length > 0) {
    publicationPrintDate += (issue.printDateMonth.length > 0 ? `<month>${issue.printDateMonth}</month>` : ``)
    publicationPrintDate += (issue.printDateDay.length > 0 ? `<day>${issue.printDateDay}</day>` : ``)
    publicationPrintDate += (issue.printDateYear.length > 0 ? `<year>${issue.printDateYear}</year>` : ``)

    publicationPrintDate = `<publication_date media_type="print">${publicationPrintDate}</publication_date>`
  }

  //doi_data
  var doiData = ''
  const issueDoiEntered = doiEntered(issue.issueDoi, ownerPrefix)
  const issueUrlEntered = urlEntered(issue.issueUrl)
  if (issueUrlEntered || issueDoiEntered) {
    doiData += (issueDoiEntered ? `<doi>${issue.issueDoi}</doi>` : ``)
    doiData += ( issueUrlEntered ? `<resource>${issue.issueUrl}</resource>` : ``)
    doiData = `<doi_data>${doiData}</doi_data>`
  }

  // volume
  var volumeXml = ((issue.volume ? issue.volume : '').trim().length > 0 ? `<volume>${issue.volume}</volume>` : ``)
  const volumeDoiEntered = doiEntered(issue.volumeDoi, ownerPrefix)
  const volumeUrlEntered = urlEntered(issue.volumeUrl)

  var volumeDoiData = ''
  if (volumeDoiEntered && volumeUrlEntered) {
    volumeDoiData += `<doi>${issue.volumeDoi}</doi>`
    volumeDoiData += `<resource>${issue.volumeUrl}</resource>`
    volumeDoiData = `<doi_data>${volumeDoiData}</doi_data>`
  }

  volumeXml = volumeXml ? `<journal_volume>${volumeXml}${volumeDoiData}</journal_volume>` : ''

  // archive locations
  var archiveLocation = ''
  if (issue.archiveLocation.trim().length > 0) {
    archiveLocation = `<archive_locations><archive name="${issue.archiveLocation}"/></archive_locations>`
  }
  return `<?xml version="1.0" encoding="UTF-8"?><crossref xmlns="http://www.crossref.org/xschema/1.1"><journal_issue>${getContributor(optionalIssueInfo)}${titles}${publicationOnlineDate}${publicationPrintDate}${volumeXml}${issueNumber}${specialNumbering}${archiveLocation}${doiData}</journal_issue></crossref>`
  //took out xsi:schemaLocation="http://www.crossref.org/xschema/1.1 http://doi.crossref.org/schemas/unixref1.1.xsd" per Mikes request
}