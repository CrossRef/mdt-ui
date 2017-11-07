

export default {
  saving: false,
  inCart: undefined,
  validating: false,
  crossmark: false,
  showCards: {},
  showOptionalTitleData: false,
  showContributor: false,
  showFunding: false,
  showRelatedItems: false,
  showAdditionalInformation: false,
  showHelper: false,
  error: false,
  doiDisabled: false,
  version: '1',
  criticalErrors: {},
  errors: {
    title: false,

    doi: false,
    invaliddoi: false,
    invalidDoiPrefix: false,
    dupedoi: false,

    url: false,
    invalidurl: false,

    printDateYear: false,
    printDateIncomplete: false,
    printDateInvalid: false,
    onlineDateYear: false,
    onlineDateIncomplete: false,
    onlineDateInvalid: false,

    firstPage: false,

    contributorLastName: false,
    contributorRole: false,
    contributorGroupName: false,
    contributorGroupRole: false,

    licenseUrl: false,
    licenseUrlInvalid: false,
    licenseDateInvalid: false,
    licenseDateIncomplete: false,

    relatedItemIdType: false,
    relatedItemRelType: false,
    relatedItemDoiInvalid: false,

    simCheckUrlInvalid: false
  },
  article: {
    title: '',
    doi: '',
    subtitle: '',
    originallanguagetitle: '',
    originallanguagetitlesubtitle: '',
    url: 'http://',
    printDateYear: '',
    printDateMonth: '',
    printDateDay: '',
    onlineDateYear: '',
    onlineDateMonth: '',
    onlineDateDay: '',
    firstPage: '',
    lastPage: '',
    locationId: '',
    abstract: '',
    freetolicense: ''
  },
  contributors: [
    {
      firstName: '',
      lastName: '',
      suffix: '',
      affiliation: '',
      orcid: '',
      role: '',
      groupAuthorName: '',
      groupAuthorRole: '',
      errors: {
        contributorLastName: false,
        contributorRole: false,
        contributorGroupName: false,
        contributorGroupRole: false
      }
    }
  ],
  funding: [
    {
      funderName: '',
      funder_identifier: '',
      grantNumbers: ['']
    }
  ],
  license: [
    {
      acceptedDateDay:'',
      acceptedDateMonth:'',
      acceptedDateYear:'',
      appliesto:'',
      licenseurl:'http://',
      errors: {
        licenseUrl: false,
        licenseUrlInvalid: false,
        licenseDateInvalid: false,
        licenseDateIncomplete: false
      }
    }
  ],
  relatedItems: [
    {
      relatedItemIdentifier: '',
      identifierType: '',
      description: '',
      relationType: '',
      errors: {
        relatedItemIdType: false,
        relatedItemRelType: false,
        relatedItemDoiInvalid: false
      }
    }
  ],
  addInfo: {
    archiveLocation:'',
    language:'',
    publicationType:'',
    similarityCheckURL:'http://',
  },
  openItems: {
    Contributors:false,
    Funding:false,
    Licenses:false,
    relatedItems:false,
    addInfo:false
  }
}