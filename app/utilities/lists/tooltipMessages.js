import React from 'react'



export const articleTooltips = {
  articleSubtitle : <p>Additional title information</p>,
  alternateTitle : <p>Original language title for translated works only</p>,
  alternateSubtitle : <p>Original language subtitle for translated works only</p>,
  doi: <p>Identifer constructed of your organizational prefix and unique article suffix (10.xxxx/xx...)</p>,
  url: <p>Single location/landing page for article where DOI resolves</p>,
  printDate : <p>Date article was published in print</p>,
  onlineDate : <p>Date article was published online</p>,
  locationId : <p>Article number or eLocator ID if a page number is not used in online only titles</p>,
  abstract: <p>Short summary of article</p>,

  suffix: <p>Suffix of contributor name (Jr. or Sr.)</p>,
  affiliation: <p>Institution of the contributor</p>,
  role: <p>Role of contributor (author, editor, chair, translator)</p>,
  orcid : <p>ORCID author identifier</p>,
  groupAuthorName : <p>Organization name contributing to article</p>,
  groupAuthorRole : <p>Organization role contributing to article</p>,

  funderId : <p>Funder name taken from Open Funder Registry</p>,
  grantNumber : <p>Grant or other award number</p>,

  freeToLicense: <p>Status of whether article is licensed to be free to read</p>,
  licenseUrl : <p>Link to article license</p>,
  licenseDate: <p>Start date for license</p>,
  licenseAppliesTo: <p>License can apply to: version of record, accepted manuscript, or text & data mining version</p>,

  relatedItemId: <p>Unique identifier for the related item (more details)</p>,
  relatedItemIdType: <p>Type of identifier used for related item (more details)</p>,
  relatedItemDescription: <p>Description of related item (ex: title)</p>,
  relatedItemRelationType: <p>Type of relationship between the article and another content item (more details)</p>,

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
  issueTitle: <p>Title of issue (if any) that accompanies issue number</p>,
  issueNumber: <p>Issue number</p>,
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
  contributorOrcid: <p>ORCID author identifier (https://orcid.org/) for issue-level contributors</p>,
  contributerAlternativeName: <p>For issue-level contributors only</p>,
  contributorRole: <p>Role of issue-level contributor</p>,
  contributorGroupName: <p>Organization name contributing to issue</p>,
  contributorGroupRole: <p>For issue-level contributors only</p>
}