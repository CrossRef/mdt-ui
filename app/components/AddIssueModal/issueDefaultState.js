

export default {
  menuOpen: false,
  validating: false,
  timeOut: '',
  confirmationPayload: {
    status: '',
    message: ''
  },
  showSection: false,
  showIssueDoiReq: false,
  showHelper: true,
  error: false,
  version: '1',
  errors: {
    issueUrl: false,
    printDateYear: false,
    onlineDateYear: false,
    invalidissueurl: false,
    dupeissuedoi: false,
    invalidissuedoi: false,
    invalidIssueDoiPrefix: false,
    issuedoi: false,
    volumeUrl: false,
    invalidvolumeurl: false,
    dupevolumedoi: false,
    invalidvolumedoi: false,
    invalidVolumeDoiPrefix: false,
    volumedoi: false,
    dupeDois: false
  },
  issue: {
    issue: '',
    issueTitle: '',
    issueDoi: '',
    issueUrl: 'http://',
    printDateYear: '',
    printDateMonth: '',
    printDateDay: '',
    onlineDateYear: '',
    onlineDateMonth: '',
    onlineDateDay: '',
    archiveLocation: '',
    specialIssueNumber: '',
    volume: '',
    volumeDoi: '',
    volumeUrl: 'http://'
  },
  optionalIssueInfo: [{
    firstName: '',
    lastName: '',
    suffix: '',
    affiliation: '',
    orcid: '',
    alternativeName: '',
    role: '',
    errors: {
      contributorLastName: false,
      contributorRole: false
    }
  }]
}