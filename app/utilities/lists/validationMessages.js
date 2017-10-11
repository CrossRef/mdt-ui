import {cardNames} from '../crossmarkHelpers'
const {pubHist, peer, update, clinical, copyright, other, supp} = cardNames


export const IssueMessages = {
  issue: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide issue number.'
  },

  issuedoi: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide issue doi.'
  },
  invalidissuedoi: {
    type: 'invalid',
    bold:'Invalid Issue DOI',
    message: 'Please check your issue DOI.'
  },
  invalidIssueDoiPrefix: {
    type: 'invalid',
    bold: 'Invalid DOI Prefix',
    message: 'Issue DOI prefix must match journal prefix.'
  },
  dupeissuedoi: {
    type: 'dupe',
    bold: 'Duplicate Issue DOI',
    message: 'Registering a new DOI? This one already exists.'
  },
  dupeDois: {
    type: 'dupe',
    bold: 'Duplicate DOIs',
    message: 'Issue and Volume DOIs cannot be the same.'
  },

  issueUrl: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide issue URL.'
  },
  invalidissueurl: {
    type: 'invalid',
    bold: 'Invalid Issue URL',
    message: 'Please check your URL format.'
  },

  printDateYear: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide either a print or online date.'
  },
  printDateIncomplete: {
    type: 'required',
    bold: 'Incomplete Print Date',
    message: 'Please provide year with month and/or day.'
  },
  printDateInvalid: {
    type: 'invalid',
    bold: 'Invalid Print Date',
    message: 'Please verify date.'
  },

  onlineDateYear: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide either a print or online date.'
  },

  onlineDateIncomplete: {
    type: 'required',
    bold: 'Incomplete Online Date',
    message: 'Please provide year with month and/or day.'
  },
  onlineDateInvalid: {
    type: 'invalid',
    bold: 'Invalid Online Date',
    message: 'Please verify date.'
  },

  volume: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide volume number.'
  },

  volumeUrl: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide volume URL.'
  },
  invalidvolumeurl: {
    type: 'invalid',
    bold: 'Invalid Volume URL',
    message: 'Please check your URL format.'
  },

  volumedoi: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide volume DOI.'
  },
  invalidvolumedoi: {
    type: 'invalid',
    bold: 'Invalid Volume DOI',
    message: 'Please check your Volume DOI.'
  },
  invalidVolumeDoiPrefix: {
    type: 'invalid',
    bold: 'Invalid DOI Prefix',
    message: 'Volume DOI prefix must match journal prefix.'
  },
  dupevolumedoi: {
    type: 'dupe',
    bold: 'Duplicate Volume DOI',
    message: 'Registering a new DOI? This one already exists.'
  },

  contributorLastName: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide contributor last name with first name.'
  },
  contributorRole: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide contributor role.'
  },
}




export const ArticleMessages = {
  title: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide article title.'
  },

  doi: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide Article DOI.'
  },
  invaliddoi: {
    type: 'invalid',
    bold: 'Invalid Article DOI',
    message: 'Please check your article DOI.'
  },
  invalidDoiPrefix: {
    type: 'invalid',
    bold: 'Invalid DOI Prefix',
    message: 'Article DOI prefix must match journal prefix.'
  },
  dupedoi: {
    type: 'dupe',
    bold: 'Duplicate Article DOI',
    message: 'Registering a new DOI? This one already exists.'
  },
  url: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide article URL.'
  },
  invalidurl: {
    type: 'invalid',
    bold: 'Invalid Article URL',
    message: 'Please check your article URL.'
  },

  printDateYear: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide either a print or online date.'
  },
  printDateIncomplete: {
    type: 'required',
    bold: 'Incomplete Print Date',
    message: 'Please provide year with month and/or day.'
  },
  printDateInvalid: {
    type: 'invalid',
    bold: 'Invalid Print Date',
    message: 'Please check your print date.'
  },

  onlineDateYear: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide either a print or online date.'
  },
  onlineDateIncomplete: {
    type: 'required',
    bold: 'Required',
    message: 'Online date incomplete.'
  },
  onlineDateInvalid: {
    type: 'invalid',
    bold: 'Invalid Online Date',
    message: 'Please check your online date.'
  },

  firstPage: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide article first page with last page.'
  },

  contributorLastName: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide contributor last name with first name.'
  },
  contributorRole: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide contributor role.'
  },
  contributorGroupRole: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide contributor group role.'
  },
  contributorGroupName: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide contributor group name.'
  },

  licenseFreeToRead: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide license URL if content is Free to Read.'
  },
  licenseDateIncomplete: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide license month, day, and year.'
  },
  licenseDateInvalid: {
    type: 'invalid',
    bold: 'Invalid License Date',
    message: 'Please check your license date.'
  },
  licenseUrl: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide license URL.'
  },
  licenseUrlInvalid: {
    type: 'invalid',
    bold: 'Invalid License URL',
    message: 'Please check your license URL.'
  },

  relatedItemDoiInvalid: {
    type: 'invalid',
    bold: 'Invalid Related Item DOI',
    message: 'Please provide a registered DOI.'
  },
  relatedItemIdType: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide Related Item identifier type.'
  },
  relatedItemRelType: {
    type: 'required',
    bold: 'Required',
    message: 'Please provide Related Item relation type.'
  },

  simCheckUrlInvalid: {
    type: 'invalid',
    bold: 'Invalid Similarity Check URL.',
    message: 'Please check your URL format.'
  },

  [`${pubHist} Label`]: {
    type: 'required',
    bold: 'Required Crossmark Field',
    message: 'Please provide Publication History label.'
  },
  [`${peer} Label`]: {
    type: 'required',
    bold: 'Required Crossmark Field',
    message: 'Please provide Peer Review label.'
  },
  [`${peer} Href`]: {
    type: 'invalid',
    bold: 'Invalid Crossmark URL',
    message: 'Please check your Peer Review URL format.'
  },
  [`${copyright} Label`]: {
    type: 'required',
    bold: 'Required Crossmark Field',
    message: 'Please provide Copyright & Licensing label.'
  },
  [`${copyright} Href`]: {
    type: 'invalid',
    bold: 'Invalid Crossmark URL',
    message: 'Please check your Copyright & Licensing URL format.'
  },
  [`${other} Label`]: {
    type: 'required',
    bold: 'Required Crossmark Field',
    message: 'Please provide Other label.'
  },
  [`${other} Href`]: {
    type: 'invalid',
    bold: 'Invalid Crossmark URL',
    message: 'Please check your Other URL format.'
  },
  [`${supp} Href`]: {
    type: 'invalid',
    bold: 'Invalid Crossmark URL',
    message: 'Please check your Supplementary Material URL format.'
  },
  [`${update} Type`]: {
    type: 'required',
    bold: 'Required Crossmark Field',
    message: 'Please provide Status Update type.'
  },
  [`${update} Date`]: {
    type: 'required',
    bold: 'Required Crossmark Field',
    message: 'Please provide Status Update date.'
  },
  [`${update} DOI`]: {
    type: 'required',
    bold: 'Required Crossmark Field',
    message: 'Please provide Status Update DOI.'
  },
  [`${update} DOIinvalid`]: {
    type: 'invalid',
    bold: 'Invalid Crossmark DOI',
    message: 'Please check your Status Update DOI.'
  },
  [`${clinical} Registry`]: {
    type: 'required',
    bold: 'Required Crossmark Field',
    message: 'Please provide Linked Clinical Trials registry.'
  },
  [`${clinical} TrialNumber`]: {
    type: 'required',
    bold: 'Required Crossmark Field',
    message: 'Please provide Linked Clinical Trials trial number.'
  },
}