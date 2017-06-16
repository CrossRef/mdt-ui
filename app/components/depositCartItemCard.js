import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import update from 'immutability-helper'
import Switch from 'react-toggle-switch'
import _ from 'lodash'

import { stateTrackerII } from 'my_decorators'
import checkDupeDOI from '../utilities/dupeDOI'
import isDOI from '../utilities/isDOI'
import isURL from '../utilities/isURL'
import objectSearch from '../utilities/objectSearch'
import xmldoc from '../utilities/xmldoc'

export default class DepositCartItemCard extends Component {
  static propTypes = {
    cartItem: is.object.isRequired,
    updateError: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    reduxControlModal: is.func.isRequired,
    reduxCart: is.array.isRequired,
    reduxRemoveFromCart: is.func.isRequired,
    publication: is.object.isRequired,
    index: is.number.isRequired,
    pubDoi: is.string.isRequired,
    pubIndex: is.number.isRequired,
    showError: is.bool.isRequired,
  };

  constructor (props) {
    super(props)
    const {publication} = this.props
    this.state = {
      error: false,
      errors: {
        articleTitle: false,
        printDate: false,
        onlineDate: false,
        articleUrl: false,
        invalidArticleUrl: false,
        doi: false,
        dupeDoi: false,
        invalidDoi: false,
        doiPrefix: false,
        lastPage: false, //only if there is a firstpage
        contributorLname: false, // only if first name is present
        validLicenseUrl: false,
        issueUrl: false,
        issueInvalidUrl: false,
        issuePrintDate: false,
        issueOnlineDate: false,
        issueDoi: false,
        dupeIssueDoi: false,
        invalidIssueDoi: false,
        doiIssuePrefix: false,
        volumeDoi: false,
        dupevolumeDoi: false,
        invalidvolumeDoi: false,
        doivolumePrefix: false,
        volumeUrl: false,
        volumeInvalidUrl: false,
        freetoreadLicenseStartDate: false,
        hasDate: false
      },
      errorStr: ''
    }
  }

  componentDidMount () {
    const { cartItem } = this.props
    const cartType = cartItem.type
    const parsed = xmldoc(cartItem.content)
    var errorMsg = ''
    if(cartType.toLowerCase() === 'article') {
      this.validateArticle (parsed)
    } else if(cartType.toLowerCase() === 'issue') {
      this.validateIssue (parsed)
    }
  }

  componentDidUpdate(nextProps, nextState) {
    if (this.state.errorStr !== nextState.errorStr) {
      if (this.state.errorStr.length > 0){
        this.props.updateError(nextProps.index, nextProps.pubDoi, nextProps.pubIndex)
      }
    }
  }


  validateArticle (parsedArticle, callback) {
    var errorStates = {
        articleTitle: {$set: false},
        printDate: {$set: false},
        onlineDate: {$set: false},
        articleUrl: {$set: false},
        invalidArticleUrl: {$set: false},
        doi: {$set: false},
        dupeDoi: {$set: false},
        invalidDoi: {$set: false},
        doiPrefix:  {$set: false},
        lastPage: {$set: false}, //only if there is a firstpage
        contributorLname: {$set: false}, // only if first name is present
        validLicenseUrl: {$set: false},
        issueUrl: {$set: false},
        issueInvalidUrl: {$set: false},
        issuePrintDate: {$set: false},
        issueOnlineDate: {$set: false},
        issueDoi: {$set: false},
        dupeIssueDoi: {$set: false},
        invalidIssueDoi: {$set: false},
        doiIssuePrefix: {$set: false},
        volumeDoi: {$set: false},
        dupevolumeDoi: {$set: false},
        invalidvolumeDoi: {$set: false},
        doivolumePrefix: {$set: false},
        volumeUrl: {$set: false},
        volumeInvalidUrl: {$set: false},
        freetoreadLicenseStartDate: {$set: false},
        hasDate: {$set: false}
    }

    var contributors = getContributors(parsedArticle)
    var licenses = getLicenses(parsedArticle)

    const freeToRead = objectSearch(parsedArticle, 'ai:free_to_read')

    const pages = objectSearch(parsedArticle, 'pages')

    var firstPage = ''
    var lastPage = ''
    if (pages) {
        firstPage = pages.first_page ? pages.first_page : ''
        lastPage = pages.last_page ? pages.last_page : ''
    }

    //preliminary checks should be done already!?

    const title = objectSearch(parsedArticle, 'title', '')

    errorStates.articleTitle = {$set: (title.length <= 0) }

    if (lastPage.length > 0) {
        errorStates.lastPage = {$set: (firstPage.length <= 0) }
    }

    let publication_date = objectSearch(parsedArticle, 'publication_date', []);
    if(!Array.isArray(publication_date)) publication_date = [publication_date];
    const onlinePubDate = _.find(publication_date, (pubDate) => {
        if (pubDate) {
            if (pubDate['-media_type'] === 'online') {
                return pubDate
            }
        }
        return []
    })

    const printPubDate = _.find(publication_date, (pubDate) => {
        if (pubDate) {
            if (pubDate['-media_type'] === 'print') {
                return pubDate
            }
        }
        return []
    })

    errorStates.printDate = {$set: printPubDate ? true : false }
    errorStates.onlineDate = {$set: onlinePubDate ? true : false }

    var hasPrintYear = false, hasOnlineYear = false, hasDate = false
    if (printPubDate || onlinePubDate) {
        hasDate = true
    }

    errorStates.hasDate = {$set: !hasDate }

    var doiData = objectSearch(parsedArticle, 'doi_data', {doi: '', resource: ''})
    const doi = doiData.doi
    const url = doiData.resource ? doiData.resource : ''
    errorStates.doi = {$set: (doi.length <= 0) }
    errorStates.articleUrl = {$set: (url.length <= 0) }
    errorStates.invalidArticleUrl = {$set: (url.length > 0) && (!isURL(url))}

    _.each(contributors, (contributor) => {
        var isThereFirstname = (contributor.firstName.length > 0)

        if(isThereFirstname) {
            errorStates.contributorLname = {$set: (contributor.lastName.length <= 0) }
            return;
        }
    })

    _.each(licenses, (license) => {
        var lUrl = license.licenseurl ? license.licenseurl : ''
        if(!isURL(lUrl)) {
            errorStates.validLicenseUrl = {$set: !isURL(lUrl) }
            return;
        }
    })

    _.each(licenses, (license) => {
        if(freeToRead === 'yes') { // only if free to read is ON
            var licAcceptedDate = licences['-start_date']
            errorStates.freetoreadLicenseStartDate = {$set: (licAcceptedDate ? licAcceptedDate : '').length === 0 }
            return;
        }
    })

    errorStates.doi = {$set: (doi.length <= 0) }

    if (doi.length > 0) {
        errorStates.invalidDoi = {$set: !isDOI(doi) }
    }


    // prefix check
    const pubPrefix = this.props.pubDoi.substring(0,this.props.pubDoi.indexOf('/'))
    const articlePrefix = doi.substring(0,doi.indexOf('/'))
    if ((pubPrefix !== articlePrefix) && (doi.length > 0)) {
        errorStates.doiPrefix = {$set: true }
    }

    if ((doi.length > 0) && (isDOI(doi))) { // if any of these 2 was errored, we want to show that error first
        checkDupeDOI(doi, (isDupe) => {
            isDupe = true // hard coding it to true because there is discussion on checking DOI on level 1 or level 2

            errorStates.dupeDoi = {$set: !isDupe }
            this.settingState(errorStates, undefined, 'article')
        })
    } else {
        this.settingState(errorStates, undefined, 'article')
    }

  }

  validateIssue (parsedIssue, callback) {
    var errorStates = {
        articleTitle: {$set: false},
        printDate: {$set: false},
        onlineDate: {$set: false},
        articleUrl: {$set: false},
        invalidArticleUrl: {$set: false},
        doi: {$set: false},
        dupeDoi: {$set: false},
        invalidDoi: {$set: false},
        doiPrefix:  {$set: false},
        lastPage: {$set: false}, //only if there is a firstpage
        contributorLname: {$set: false}, // only if first name is present
        validLicenseUrl: {$set: false},
        issueUrl: {$set: false},
        issueInvalidUrl: {$set: false},
        issuePrintDate: {$set: false},
        issueOnlineDate: {$set: false},
        issueDoi: {$set: false},
        dupeIssueDoi: {$set: false},
        invalidIssueDoi: {$set: false},
        doiIssuePrefix: {$set: false},
        volumeDoi: {$set: false},
        dupevolumeDoi: {$set: false},
        invalidvolumeDoi: {$set: false},
        doivolumePrefix: {$set: false},
        volumeUrl: {$set: false},
        volumeInvalidUrl: {$set: false},
        freetoreadLicenseStartDate: {$set: false},
        hasDate: {$set: false}
    }
    var checkDoi = []
    const resource = objectSearch(parsedIssue, 'resource', '')
    errorStates.issueUrl = {$set: resource.length <= 0 }
    if (resource.length > 0) {
        errorStates.issueInvalidUrl = {$set: !isURL(resource) }
    }

    let publication_date = objectSearch(parsedIssue, 'publication_date', []);
    if(!Array.isArray(publication_date)) publication_date = [publication_date];
    const onlinePubDate = _.find(publication_date, (pubDate) => {
        if (pubDate) {
            if (pubDate['-media_type'] === 'online') {
                return pubDate
            }
        }
        return []
    })

    const printPubDate = _.find(publication_date, (pubDate) => {
        if (pubDate) {
            if (pubDate['-media_type'] === 'print') {
                return pubDate
            }
        }
        return []
    })

    errorStates.issuePrintDate = {$set: printPubDate ? false : true }
    errorStates.issueOnlineDate = {$set: onlinePubDate ? false : true }

    var hasPrintYear = false, hasOnlineYear = false, hasDate = false
    if (printPubDate || onlinePubDate) {
        hasDate = true
    }

    errorStates.hasDate = {$set: !hasDate }

    var doiData = objectSearch(parsedIssue, 'doi_data', {doi: '', resource: ''})
    const doi = doiData.doi
    const url = doiData.resource
    errorStates.issueDoi = {$set: (doi.length <= 0) }
    if (doi.length > 0) {
        errorStates.invalidIssueDoi = {$set: !isDOI(doi) }
        if (isDOI(doi)){
            checkDoi.push(doi)
        }
    }
    // prefix check
    const pubPrefix = this.props.pubDoi.substring(0,this.props.pubDoi.indexOf('/'))
    const articlePrefix = doi.substring(0,doi.indexOf('/'))
    if ((pubPrefix !== articlePrefix) && (doi.length > 0)) {
        errorStates.doiIssuePrefix = {$set: true }
    }

    var VolumeDoiData = objectSearch(parsedIssue, 'journal_volume')
    if (VolumeDoiData) {
        // if exist
        var volumeDoiData = objectSearch(VolumeDoiData, 'doi_data', {doi: '', resource: ''})
        if (volumeDoiData) {
            const volumeDoi = volumeDoiData.doi
            const volumeUrl = volumeDoiData.resource

            if (volumeDoi.length > 0) {
                // check for valid and prefix
                errorStates.invalidvolumeDoi = {$set: !isDOI(volumeDoi) }
                if(isDOI(volumeDoi)) {
                    checkDoi.push(volumeDoi)
                    errorStates.invalidvolumeDoi = {$set: !isDOI(volumeDoi) }
                    const volumearticlePrefix = volumeDoi.substring(0,volumeDoi.indexOf('/'))
                    if ((pubPrefix !== volumearticlePrefix) && (volumeDoi.length > 0)) {
                        errorStates.doivolumePrefix = {$set: true }
                    }
                }

                // if a DOI is given, need to validate volume url
                if (volumeUrl.length <= 0) {
                    errorStates.volumeUrl = {$set: true}
                } else {
                    errorStates.volumeInvalidUrl = {$set: !isURL(volumeUrl)}
                }
            }
        }
    }


    if (checkDoi.length > 0) { // if any of these 2 was errored, we want to show that error first
        checkDupeDOI(checkDoi, (isDupe) => {
            // 0 is issue DOI
            // 1 is volume DOI

//            isDupe = true // hard coding it to true because there is discussion on checking DOI on level 1 or level 2

            errorStates.dupeIssueDoi = {$set: !isDupe[0] }
            if (checkDoi.length > 1) {
                errorStates.dupevolumeDoi = {$set: !isDupe[1] }
            }

            this.settingState(errorStates, undefined, 'issue')
        })
    } else {
        this.settingState(errorStates, undefined, 'issue')
    }

  }

  settingState (errorStates, callback, type) {
    this.setState({
      errors: update(this.state.errors, errorStates)
    }, ()=>{
      var allErrors = ''
      for(var key in this.state.errors) { // checking all the properties of errors to see if there is a true
        if (this.state.errors[key]) {
          //this.props.updateError()
          var errorMsg = ''
          switch (key) {
            case 'hasDate' : errorMsg = '<p><b>Required.</b> Please provide either a print or online date.</p>'; break;
            case 'lastPage' : errorMsg = '<p><b>Required.</b> Please provide a first page if last page value exists.</p>'; break;
            case 'contributorLname' : errorMsg = '<p><b>Required.</b> Please provide last name with first name.</p>'; break;
            case 'validLicenseUrl' : errorMsg = '<p><b>Invalid URL.</b> Please check your URL is correct.</p>'; break;
            case 'articleTitle' : errorMsg = '<p><b>Required.</b> Please provide required article title.</p>'; break;
            case 'articleUrl' : errorMsg = '<p><b>Required.</b> Please provide required article URL.</p>'; break;
            case 'invalidArticleUrl' : errorMsg = '<p><b>Invalid URL.</b> Please check your URL is correct.</p>'; break;
            case 'doiPrefix' : errorMsg = '<p><b>Invalid DOI.</b> DOI prefix needs to match journal DOI prefix.</p>'; break;
            case 'doi' : errorMsg = '<p><b>Required.</b> Please provide required article title.</p>'; break;
            case 'dupeDoi' : errorMsg = '<p><b>Duplicate DOI.</b> Registering a new DOI? This one already exists.</p>'; break;
            case 'invalidDoi' : errorMsg = '<p><b>Invalid DOI.</b> Please check your DOI (10.xxxx/xx...).</p>'; break;
            case 'issueUrl' : errorMsg = '<p><b>Required.</b> Please provide required article title.</p>'; break;
            case 'issueInvalidUrl' : errorMsg = '<p><b>Invalid URL.</b> Please check your URL is correct.</p>'; break;
            case 'issueDoi' : errorMsg = '<p><b>Required.</b> Please provide required article title.</p>'; break;
            case 'dupeIssueDoi' : errorMsg = '<p><b>Duplicate DOI.</b> Registering a new DOI? This one already exists.</p>'; break;
            case 'invalidIssueDoi' : errorMsg = '<p><b>Invalid DOI.</b> Please check your DOI (10.xxxx/xx...).</p>'; break;
            case 'doiIssuePrefix' : errorMsg = '<p><b>Invalid DOI.</b> DOI prefix needs to match journal DOI prefix.</p>'; break;
            case 'volumeDoi' : errorMsg = '<p><b>Required.</b> Please provide required article title.</p>'; break;
            case 'dupevolumeDoi' : errorMsg = '<p><b>Duplicate DOI.</b> Registering a new DOI? This one already exists.</p>'; break;
            case 'invalidvolumeDoi' : errorMsg = '<p><b>Invalid DOI.</b> Please check your DOI (10.xxxx/xx...).</p>'; break;
            case 'doivolumePrefix' : errorMsg = '<p><b>Invalid DOI.</b> DOI prefix needs to match journal DOI prefix.</p>'; break;
            case 'volumeUrl' : errorMsg = '<p><b>Required.</b> Please provide required article title.</p>'; break;
            case 'volumeInvalidUrl' : errorMsg = '<p><b>Invalid URL.</b> Please check your URL is correct.</p>'; break;
            case 'freetoreadLicenseStartDate' :  errorMsg = '<p><b>Required.</b> Please provide Start date if content is Free to Read.</p>'; break;
          }
          if(this.state.errors.hasDate && (['printDate','onlineDate','issuePrintDate','issueOnlineDate'].indexOf(key)>0)){
            allErrors += errorMsg
            }else if (['printDate','onlineDate','issuePrintDate','issueOnlineDate'].indexOf(key)<=-1){
            allErrors += errorMsg
          }
        }
      }
      this.setState({errorStr: allErrors})
      if (callback) callback(<div>{allErrors}</div>) // there is a true, return the true, means there is an error
    })
  }


  remove () {
    this.props.reduxRemoveFromCart(this.props.cartItem.doi)
  }

  displayError () {
    return (
        <div className='errorHolder talltooltip fullError'>
            <div className='toolTipHolder'>
            <a className="tooltips">
                <div className='toolmsgholder'>
                <div className='errormsgholder'>
                    <div className='errormsginnerholder'>
                    <div><img src='/images/AddArticle/Asset_Icons_White_Caution.svg' /></div>
                    <div dangerouslySetInnerHTML={{__html: this.state.errorStr}}></div>
                    </div>
                </div>
                </div>
            </a>
            </div>
        </div>
    )
  }

  displayItem () {
    const { cartItem } = this.props;
    const parsedArticle = cartItem.content ? xmldoc(cartItem.content) : ''
    const cartType = cartItem.type
    const status = cartItem.status
    console.log(cartItem.title);
    const title = cartItem.title.title ? cartItem.title.title.trim() : `Issue ${cartItem.title.issue || 'NA'}, Volume ${cartItem.title.volume || 'NA'}`
    return (
      <tr className='item'>
        <td className={'stateIcon' + (this.props.showError ? ' rowError' : '') + ((cartType === 'issue') ? ' issuerow' : '')}>
            {(this.state.errorStr.length > 0) ? <div className='iconHolder'><img src='/images/Deposit/Asset_Icons_Red_Caution.png' /></div> : ''}
        </td>
        <td className={'title' + (this.props.showError ? ' rowError' : '') + ((cartType === 'issue') ? ' issuerow' : '') + ((this.props.underIssue) ? ' articleUnderIssue' : '')}>
            {title}
        </td>
        <td className={'status' + (this.props.showError ? ' rowError' : '') + ((cartType === 'issue') ? ' issuerow' : '')}>
            {status}
        </td>
        <td className={'action' + (this.props.showError ? ' rowError' : '') + ((cartType === 'issue') ? ' issuerow' : '')}>
            {(cartType !== 'issue') && <a onClick={() => {this.remove()}}>remove</a>}
        </td>
        <td className='errorholder'>
            {
                (this.props.showError && this.state.errorStr.length > 0) ? this.displayError() : ''
            }
        </td>
      </tr>
    )
  }

  componentDidUpdate(nextProps, nextState) {
      if (this.state.errorStr !== nextState.errorStr) {
        if (this.state.errorStr.length > 0){
            this.props.updateError(nextProps.index, nextProps.pubDoi, nextProps.pubIndex)
        }
      }
  }

  componentDidMount () {
    const { cartItem } = this.props
    const cartType = cartItem.type
    const parsed = cartItem.content ? xmldoc(cartItem.content) : undefined
    var errorMsg = ''
    if (parsed) {
        if(cartType.toLowerCase() === 'article') {
            this.validateArticle (parsed)
        } else if(cartType.toLowerCase() === 'issue') {
            this.validateIssue (parsed)
        }
    }
  }

  render () {
    return (
       this.displayItem()
    )
  }
}




function getLicenses (parsedArticle) {
  // license loading
  const licences = objectSearch(parsedArticle, 'ai:license_ref')
  var lic = []
  // contributors are divied into 2 types
  // person_name and organization
  if (licences) {
    if (!Array.isArray(licences)) {
      const licAcceptedDate = licences['-start_date'].split('-')
      lic.push({
        acceptedDateDay: licAcceptedDate[2] ? licAcceptedDate[2] : '',
        acceptedDateMonth: licAcceptedDate[1] ? licAcceptedDate[1] : '',
        acceptedDateYear: licAcceptedDate[0] ? licAcceptedDate[0] : '',
        appliesto: licences['-applies_to'] ? licences['-applies_to'] : '',
        licenseurl: licences['#text'] ? licences['#text'] : ''
      })
    } else {
      for(var i = 0; i < licences.length; i++) {
        const licAcceptedDate = licences[i]['-start_date'].split('-')
        lic.push({
          acceptedDateDay: licAcceptedDate[2] ? licAcceptedDate[2] : '',
          acceptedDateMonth: licAcceptedDate[1] ? licAcceptedDate[1] : '',
          acceptedDateYear: licAcceptedDate[0] ? licAcceptedDate[0] : '',
          appliesto: licences[i]['-applies_to'] ? licences[i]['-applies_to'] : '',
          licenseurl: licences[i]['#text'] ? licences[i]['#text'] : ''
        })
      }
    }
  }
  return lic
}

function getContributors (parsedArticle) {
  // contributor loading
  var contributors = objectSearch(parsedArticle, 'contributors')
  var contributee = []
  // contributors are divied into 2 types
  // person_name and organization
  var person_name = undefined
  var organization = undefined
  if (contributors) {
    person_name = objectSearch(contributors, 'person_name')
    organization = objectSearch(contributors, 'organization')

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
            role: person_name['-contributor_role'] ? person_name['-contributor_role'] : '',
            groupAuthorName: '',
            groupAuthorRole: ''
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
              role: person['-contributor_role'] ? person['-contributor_role'] : '',
              groupAuthorName: '',
              groupAuthorRole: ''
            }
          )
        })
      }
    }
  }
  return contributee
}