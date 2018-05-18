import React from 'react'



export const articleTooltips = {
  articleSubtitle : <p>Additional title information</p>,
  alternateTitle : <p>Original language title for translated works only</p>,
  alternateSubtitle : <p>Original language subtitle for translated works only</p>,
  doi: <p>Identifer constructed of your <a target="_blank" href="https://www.crossref.org/get-started/content-registration/">organizational prefix and unique article suffix (10.xxxx/xx...)</a></p>,
  url: <p>Single location/landing page for article where DOI resolves</p>,
  printDate : <p>Date article was published in print</p>,
  onlineDate : <p>Date article was published online</p>,
  locationId : <p><a target="_blank" href="https://support.crossref.org/hc/en-us/articles/115000434843-Article-numbers-IDs">Article number or eLocator ID</a> if a page number is not used in online only titles</p>,
  abstract: <p>Short summary of article</p>,

  suffix: <p>Suffix of contributor name (Jr. or Sr.)</p>,
  affiliation: <p>Institution of the contributor</p>,
  role: <p>Role of contributor (author, editor, chair, translator)</p>,
  orcid : <p><a target="_blank" href="https://orcid.org/">ORCID</a> author identifier</p>,
  groupAuthorName : <p>Organization name contributing to article</p>,
  groupAuthorRole : <p>Organization role contributing to article</p>,

  funderId : <p>Funder name taken from <a target="_blank" href="https://www.crossref.org/services/funder-registry/">Crossref Funder Registry</a></p>,
  grantNumber : <p>Grant or other award number</p>,

  freeToLicense: <p>Status of whether article is licensed to be <a target="_blank" href="https://support.crossref.org/hc/en-us/articles/214572423-License-metadata-Access-Indicators-">free to read</a></p>,
  licenseUrl : <p>Link to <a target="_blank" href="https://support.crossref.org/hc/en-us/articles/214572423-License-metadata-Access-Indicators-">article license</a></p>,
  licenseDate: <p>Start date for <a target="_blank" href="https://support.crossref.org/hc/en-us/articles/214572423-License-metadata-Access-Indicators-">license</a></p>,
  licenseAppliesTo: <p><a target="_blank" href="https://support.crossref.org/hc/en-us/articles/214572423-License-metadata-Access-Indicators-">License can apply to</a>: version of record, accepted manuscript, or text & data mining version</p>,

  relatedItemId: <p>Unique identifier for the related item (<a target="_blank" href="https://support.crossref.org/hc/en-us/articles/214357426-Relationships-between-DOIs-and-other-objects">more details</a>)</p>,
  relatedItemIdType: <p>Type of identifier used for related item (<a target="_blank" href="https://support.crossref.org/hc/en-us/articles/115001907486-Internal-and-other-identifiers">more details</a>)</p>,
  relatedItemDescription: <p>Description of related item (ex: title)</p>,
  relatedItemRelationType: <p>Type of relationship between the article and another content item (<a target="_blank" href="https://support.crossref.org/hc/en-us/articles/214357426-Relationships-between-DOIs-and-other-objects">more details</a>)</p>,

  archiveLocation: <p>Designated archiving organization for your content</p>,
  similarityCheckURL: <p>Crawler-friendly link to index content for Similarity Check</p>,
  language: <p>Primary language for your article</p>,

  publicationHistoryLabel: <p>Dates when article was received, accepted and published.</p>,
  peerReviewLabel: <p>Whether the article has been peer-reviewed and the type of peer review used (single-blind, open, etc)</p>,
  copyrightLicensingUrl: <p>This URL is for additional information or context. (License URLs should be deposited in the main licenses section.)</p>,
  otherLabel: <p>Any additional information you want to display in the Crossmark box</p>,
  updateType: <p>Only complete this section if the DOI you are depositing is an update (e.g. correction or retraction notice) to another DOI</p>,
  updateDate: <p>The date of publication for the correction or retraction notice</p>,
  updateDoi: <p>DOI of the piece of content that has been corrected or retracted</p>,
  suppDescription: <p>Links to any related materials.</p>,
  clinicalTrialNumber: <p>Registered number of the clinical trial that this article reports on</p>,
  clinicalTrialRegistry: <p>The place where the clinical trial has been registered</p>,
  clinicalRelationship: <p>The stage of the trial that article reports on</p>
}



export const issueTooltips = {
  issueTitle: <p>Used for a special issue title</p>,
  issueNumber: <p>Can be a number or a descriptor (Spring, Fall) for issue</p>,
  printDate: <p>Date the issue was published (print)</p>,
  onlineDate: <p>Date the issue was published online</p>,
  specialNumber: <p>For supplements or special issues. Text defining the type of special issue (e.g. "suppl") may be included in this element along with the number.</p>,
  archiveLocation: <p>Designated archiving organization</p>,
  issueDoi: <p>Identifer assigned to a specific issue, constructed of organizational prefix and unique suffix (10.xxxx/xx...)</p>,
  issueUrl: <p>URL for issue</p>,
  volumeNumber: <p>Volume number</p>,
  volumeDoi: <p>Identifer assigned to a specific volume, constructed of organizational prefix and unique suffix (10.xxxx/xx...)</p>,
  volumeUrl: <p>URL for volume</p>,
  contributorFirstName: <p>First name for issue-level contributors only</p>,
  contributorLastName: <p>Last name for issue-level contributors only</p>,
  contributorSuffix: <p>Suffix (Jr., Sr.) for issue-level contributors only</p>,
  contritbutorAffiliation: <p>Institution of the issue-level contributor</p>,
  contributorOrcid: <p><a target="_blank" href="https://orcid.org/">ORCID</a> author identifier (https://orcid.org/) for issue-level contributors</p>,
  contributerAlternativeName: <p>For issue-level contributors only</p>,
  contributorRole: <p>Role of issue-level contributor</p>,
  contributorGroupName: <p>Organization name contributing to issue</p>,
  contributorGroupRole: <p>For issue-level contributors only</p>
}