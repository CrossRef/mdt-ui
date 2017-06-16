import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import update from 'immutability-helper'
import _ from 'lodash'
import Switch from 'react-toggle-switch'
import { stateTrackerII } from 'my_decorators'
import $ from 'jquery'

import {makeDateDropDown} from  '../utilities/date'
import SubItem from './SubItems/subItem'
import fetch from '../utilities/fetch'
import checkDupeDOI from '../utilities/dupeDOI'
import isDOI from '../utilities/isDOI'
import isURL from '../utilities/isURL'
import xmldoc from '../utilities/xmldoc'
import JSesc from '../utilities/jsesc'
import objectSearch from '../utilities/objectSearch'
import { getContributor } from '../utilities/getSubItems'
import { displayArchiveLocations } from '../utilities/archiveLocations'
import { getIssueXml } from '../utilities/xmlGenerator'



const defaultState = {
  showIssueDoiReq: false,
  showHelper: false,
  on: false,
  error: false,
  version: '0',
  errors: {
    issueUrl: false,
    printDateYear: false,
    onlineDateYear: false,
    invalidissueurl: false,
    dupeissuedoi: false,
    invalidissuedoi: false,
    issuedoi: false,
    volumeUrl: false,
    invalidvolumeurl: false,
    dupevolumedoi: false,
    invalidvolumedoi: false,
    volumedoi: false
  },
  issue: {
    issue: '',
    issueTitle: '',
    issueDoi: '',
    issueUrl: '',
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
    volumeUrl: ''
  },
  optionalIssueInfo: [{
    firstName: '',
    lastName: '',
    suffix: '',
    affiliation: '',
    orcid: '',
    alternativeName: '',
    role: ''
  }]
}

export default class AddIssueCard extends Component {
  constructor (props) {
    super(props);
    this.state = defaultState;
    this.state.issue.issueDoi = props.ownerPrefix + '/'
  }

  componentDidMount () {
    if(this.props.mode === 'edit') {
      this.modalShown()
    }
  }

  optionalIssueInfoHandler (index, OptIssueInfo) {
    var optIssueInfo = {}
    for(var i in OptIssueInfo.refs){
      if(OptIssueInfo.refs[i]){
        optIssueInfo[i] = OptIssueInfo.refs[i].value
      }
    }

    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
      optionalIssueInfo: update(this.state.optionalIssueInfo, {[index]: {$set: optIssueInfo }})
    })
  }

  addOptionalIssueInfo () {
    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
     optionalIssueInfo: update(this.state.optionalIssueInfo, {$push:
      [{
        firstName: '',
        lastName: '',
        suffix: '',
        affiliation: '',
        orcid: '',
        alternativeName: '',
        role: ''
      }]
     })
    })
  }

  removeOptionalIssueInfo (index) {
    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
      optionalIssueInfo: update(this.state.optionalIssueInfo, {$splice: [[index, 1]] })
    })
  }

  handler = (e) => {
    const name = e.currentTarget.name.substr(e.currentTarget.name.indexOf('.') + 1, e.currentTarget.name.length-1)

    if (name === 'issueUrl') {
      (e.currentTarget.value.trim().length > 0) ? this.setState({showIssueDoiReq:true}) : this.setState({showIssueDoiReq:false})
    }

    this.setState({
      issue: update(this.state.issue, {[name]: {$set: e.currentTarget.value ? e.currentTarget.value : '' }})
    })
  }

  validation (callback) {
    var errorStates = {
      issue: {$set: false},
      issueUrl: {$set: false },
      printDateYear: {$set: false },
      onlineDateYear: {$set: false },
      invalidissueurl: {$set: false },
      dupeissuedoi: {$set: false },
      invalidissuedoi: {$set: false },
      issuedoi: {$set: false },
      volumeUrl: {$set: false},
      invalidvolumeurl: {$set: false },
      dupevolumedoi: {$set: false },
      invalidvolumedoi: {$set: false },
      volumedoi: {$set: false}
    }
    this.setState({
      error: false,
      errors: update(this.state.errors, errorStates)
    })

    return checkDupeDOI([this.state.issue.issueDoi, this.state.issue.volumeDoi], (isDupe , isValid) => {

        var hasPrintYear = false, hasOnlineYear = false
        if ((this.state.issue.printDateYear.length > 0) || (this.state.issue.onlineDateYear.length > 0)) {
          //hasDate = true
          if ((this.state.issue.printDateYear.length > 0)) {
            hasPrintYear = true
          }
          if ((this.state.issue.onlineDateYear.length > 0)) {
            hasOnlineYear = true
          }
        }

        const validateOwnerPrefix = () => {
          if(isDOI(this.state.issue.issueDoi) && this.state.issue.issueDoi.split('/')[0] === this.props.ownerPrefix) return true;
          else return false
        }

        errorStates = {
          issue: {$set: (this.state.issue.issue.length === 0) },
          issueUrl: {$set: (this.state.issue.issueUrl.length === 0) },
          printDateYear: {$set: (this.state.issue.printDateYear.length === 0) },
          onlineDateYear: {$set: (this.state.issue.onlineDateYear.length === 0) },
          invalidissueurl: {$set: !isURL(this.state.issue.issueUrl) },
          dupeissuedoi: {$set: (this.state.issue.issueDoi.length > 0) ? isDupe[0] : false }, // we only care IF there is a DOI
          issuedoi: {$set: ((this.state.issue.issueDoi.length === 0) && (isURL(this.state.issue.issueUrl))) }, // we only care IF there is a DOI
          invalidissuedoi: {$set: ((this.state.issue.issueDoi.length > 0) && (isURL(this.state.issue.issueUrl))) ? !validateOwnerPrefix() : false } // we only care IF there is a DOI
        }

        if (hasPrintYear) { // has print year, don't care if there is a online year
          errorStates.onlineDateYear = {$set: false}
        }
        if (hasOnlineYear) { // has online year, don't care if there is a print year
          errorStates.printDateYear = {$set: false}
        }

        errorStates.dupeissuedoi = (this.state.issueDoiDisabled) ? {$set: false} : errorStates.dupeissuedoi

        if (((this.state.issue.volume ? this.state.issue.volume : '').length > 0) || ((this.state.issue.volumeDoi ? this.state.issue.volumeDoi : '').length > 0) || ((this.state.issue.volumeUrl ? this.state.issue.volumeUrl : '').length > 0)) {
          errorStates.dupevolumedoi = {$set: ((this.state.issue.volumeDoi ? this.state.issue.volumeDoi : '').length > 0) ? (isDupe[1] ? isDupe[1] : false) : false }, // we only care IF there is a DOI
          errorStates.invalidvolumedoi = {$set: (((this.state.issue.volumeDoi ? this.state.issue.volumeDoi : '').length > 0) && (!isDOI(this.state.issue.volumeDoi))) }, // we only care IF there is a DOI
          errorStates.invalidvolumeurl = {$set: ((this.state.issue.volumeUrl ? this.state.issue.volumeUrl: '').length > 0) ? !isURL(this.state.issue.volumeUrl) : false  }

          errorStates.dupevolumedoi = (this.state.volumeDoiDisabled) ? {$set: false} : errorStates.dupevolumedoi
        }

        this.setState({
          errors: update(this.state.errors, errorStates)
        }, ()=>{
          var errors = ['issuedoi','invalidissuedoi','dupeissuedoi', 'issueTitle']

          for(var key in this.state.errors) { // checking all the properties of errors to see if there is a true
              if (this.state.errors[key]) { // only return there is error and prevent from saving if there is no title + doi
                this.setState({error: true})
                return (errors.indexOf(key) > -1) ? callback(this.state.errors[key]) : callback(false)
              }
          }
          return callback(false) // iterated the entire object, no true, returning a false, no error
        })
    })
  }


  onSubmit = (e) => {
    e.preventDefault()

    this.validation((valid) => { // need it to be a callback because setting state does not happen right away
      if (!valid) {
        const props = this.props
        var publication = props.publication
        const state = this.state

        const issueXML = getIssueXml(this.state)

        var version = this.state.version

        if (props.mode === 'edit') {
          version = String(parseInt(this.state.version) + 1)
        }

        const title = JSesc(this.state.issue.issueTitle)

        const newRecord = {
          'title': {'title': title},
          'doi': this.state.issue.issueDoi,
          'owner-prefix': this.state.issue.issueDoi.split('/')[0],
          'type': 'issue',
          'mdt-version': version,
          'status': 'draft',
          'content': issueXML.replace(/(\r\n|\n|\r)/gm,'')
        }

        publication.message.contains = [newRecord]

        this.props.postIssue(publication, () => {
          this.props.handle(publication.message.doi)
          this.setState({version: version})
          if (!this.state.error) {
            this.closeModal()
          }
        })
      }
    })
  }

  closeModal () {
    this.setState(defaultState);
    this.props.reduxControlModal({showModal:false})
  }

  modalShown () {
    const { doi } = this.props.issue
    // if doi is not required, then how is UI suppose to find a issue?
    this.props.fetchIssue(doi, (Publication) => {
      const message = Publication.message
      const Issue = message.contains[0]
      const version = Issue['mdt-version']

      const parsedIssue = xmldoc(Issue.content)
      const issueTitle = objectSearch(parsedIssue, 'title') ? objectSearch(parsedIssue, 'title') : ''
      const issue = objectSearch(parsedIssue, 'issue') ? objectSearch(parsedIssue, 'issue') : ''
      const issueDoi = objectSearch(parsedIssue, 'doi') ? objectSearch(parsedIssue, 'doi') : ''
      const issueUrl = objectSearch(parsedIssue, 'resource') ? objectSearch(parsedIssue, 'resource') : ''
      const special_numbering = objectSearch(parsedIssue, 'special_numbering') ? objectSearch(parsedIssue, 'special_numbering') : ''
      let publication_date = objectSearch(parsedIssue, 'publication_date');

      if(!Array.isArray(publication_date)) publication_date = [publication_date]; //Code below wants array of values, but if we accept only 1 date, we get only 1 object, so we transform into array

      const onlinePubDate = _.find(publication_date, (pubDate) => {
        if (pubDate) {
          if (pubDate['-media_type'] === 'online') {
            return pubDate
          }
        }
      })

      const printPubDate = _.find(publication_date, (pubDate) => {
        if (pubDate) {
          if (pubDate['-media_type'] === 'print') {
            return pubDate
          }
        }
      })
      var printDateYear = ''
      var printDateMonth = ''
      var printDateDay = ''
      if (printPubDate) {
        printDateYear = printPubDate['year'] ? printPubDate['year'] : ''
        printDateMonth = printPubDate['month'] ? printPubDate['month'] : ''
        printDateDay = printPubDate['day'] ? printPubDate['day'] : ''
      }

      var onlineDateYear = ''
      var onlineDateMonth = ''
      var onlineDateDay = ''
      if (onlinePubDate) {
        onlineDateYear = onlinePubDate['year'] ? onlinePubDate['year'] : ''
        onlineDateMonth = onlinePubDate['month'] ? onlinePubDate['month'] : ''
        onlineDateDay = onlinePubDate['day'] ? onlinePubDate['day'] : ''
      }

      const archiveLocations = objectSearch(parsedIssue, 'archive_locations')
      var archive = ''
      if (archiveLocations) {
        archive = archiveLocations.archive['-name']
      }

      const journal_volume = objectSearch(parsedIssue, 'journal_volume')
      if (journal_volume) {
        var theVolume = objectSearch(journal_volume, 'volume') ? objectSearch(journal_volume, 'volume') : ''
        var volumeDoiData = objectSearch(journal_volume, 'doi_data') ? objectSearch(journal_volume, 'doi_data') : ''
        var volumeDoi = objectSearch(volumeDoiData, 'doi') ? objectSearch(volumeDoiData, 'doi') : ''
        var volumeUrl = objectSearch(volumeDoiData, 'resource') ? objectSearch(volumeDoiData, 'resource') : ''

      }

      const setIssue = {
        issue: issue,
        issueTitle: issueTitle,
        issueDoi: this.props.duplicate ? this.props.ownerPrefix + '/' : issueDoi,
        issueUrl: this.props.duplicate ?  '' : issueUrl,
        printDateYear: printDateYear,
        printDateMonth: printDateMonth,
        printDateDay: printDateDay,
        onlineDateYear: onlineDateYear,
        onlineDateMonth: onlineDateMonth,
        onlineDateDay: onlineDateDay,
        archiveLocation: archive,
        specialIssueNumber: special_numbering,
        volume: theVolume,
        volumeDoi: volumeDoi,
        volumeUrl: volumeUrl
      }

      // contributor loading
      const contributors = objectSearch(parsedIssue, 'contributors')
      var contributee = []
      // contributors are divied into 2 types
      // person_name and organization
      var person_name = undefined
      if (contributors) {
        person_name = objectSearch(contributors, 'person_name')

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
                alternativeName: person_name['alt-name'] ? person_name['alt-name'] : '',
                role: person_name['-contributor_role'] ? person_name['-contributor_role'] : ''
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
                  alternativeName: person['alt-name'] ? person['alt-name'] : '',
                  role: person['-contributor_role'] ? person['-contributor_role'] : ''
                }
              )
            })
          }
        }
      }

      if (contributee.length <= 0) {
        contributee.push(
          {
            firstName: '',
            lastName: '',
            suffix: '',
            affiliation: '',
            orcid: '',
            role: '',
            alternativeName: ''
          }
        )
      }

      var issueDoiDisabled = false
      if (issueDoi) {
        issueDoiDisabled = (issueDoi.length > 0 && this.props.issue.status !== 'draft') ? true : false
      }

      var volumeDoiDisabled = false
      if (volumeDoi) {
        volumeDoiDisabled = (volumeDoi.length > 0 && this.props.issue.status !== 'draft') ? true : false
      }

      this.setState({
        version: version,
        issueDoiDisabled: issueDoiDisabled,
        volumeDoiDisabled: volumeDoiDisabled,
        issue:  update(this.state.issue, {$set: setIssue }),
        optionalIssueInfo: update(this.state.optionalIssueInfo, {$set: contributee })
      })
    })
  }

  componentDidUpdate() {
    var firstError = $(".fieldError").first()
    if (firstError.length > 0) {
      $('.fullError').find('.tooltips').css({
        'top': ((firstError.offset().top + (firstError.position().top - (firstError.position().top * .5)) - ($('.switchLicense').first().position().top + 15) - ($('.switchLicense').first().offset().top + 15))) + 15
      })
    }
  }


  render () {
    return (
      <div className='addIssueCard'>
        <div>
          <form onSubmit={this.onSubmit} className='addIssues'>
            <div className='articleInnerForm'>
              <div className='body'>
                <div className='row infohelper'>
                  <div className='errorHolder'>
                    <div className='switchOuterHolder'>
                        <div className='switchInnerHolder'>
                            <div className='switchLicense'>
                                <div className='switchLabel'><span>Show Help</span></div>
                                <Switch
                                    ref='showHelper'
                                    onClick={() => {
                                        this.setState({on: !this.state.on}, ()=>{
                                          this.setState({showHelper: this.state.on})
                                        })
                                    }}
                                    on={this.state.on}
                                />
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='fieldHolder'>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Issue</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder'>
                          <div className='required height32'>
                            <span>*</span>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className='height32'
                              type='text'
                              name='issue.issue'
                              onChange={this.handler}
                              value={this.state.issue.issue}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Issue Title</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder norequire'>
                          <div className='required height32'>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className='height32'
                              type='text'
                              onChange={this.handler}
                              value={this.state.issue.issueTitle}
                              name='issue.issueTitle'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {(!this.state.error && this.state.showHelper) &&
                    <div className='errorHolder talltooltip helpers'>
                      <div className='toolTipHolder'>
                        <a className="tooltips">
                          <div className='toolmsgholder'>
                            <div className='errormsgholder'>
                              <div className='errormsginnerholder'>
                                <img src='/images/AddArticle/Asset_Icons_White_Help.svg' />
                                Please provide a Title that fully describes your Issue
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  }
                  {(this.state.error) &&
                    <div className='errorHolder talltooltip fullError'>
                      <div className='toolTipHolder'>
                        <a className="tooltips">
                          <div className='toolmsgholder'>
                            <div className='errormsgholder'>
                              <div className='errormsginnerholder'>
                                <div><img src='/images/AddArticle/Asset_Icons_White_Help.svg' /></div>
                                {(
                                  this.state.errors.issue ||
                                  this.state.errors.issuedoi ||
                                  this.state.errors.issueUrl ||
                                  this.state.errors.printDateYear ||
                                  this.state.errors.onlineDateYear
                                ) &&
                                  <div><b>Required.</b><br />Please provide required informaton.</div>
                                }
                                {(this.state.errors.invalidissuedoi || this.state.errors.invalidvolumedoi) &&
                                  <div><b>Invalid DOI.</b><br />Please check your DOI (10.xxxx/xx...). Record prefix (10.xxxx) must match publication prefix.</div>
                                }
                                {(this.state.errors.invalidissueurl) &&
                                  <div><b>Invalid URL.</b><br />Please check your URL.</div>
                                }
                                {(this.state.errors.dupeissuedoi) &&
                                  <div><b>Duplicate DOI.</b><br />Registering a new DOI? This one already exists.</div>
                                }
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  }
                </div>
                <div className='row'>
                  <div className='fieldHolder'>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Issue DOI</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className={
                          'requiredholder' + (this.state.showIssueDoiReq ? '' : ' norequire')
                        }>
                          <div className='required height32'>
                            {(this.state.showIssueDoiReq) ? <span>*</span> : ''}
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className={'height32' + ((this.state.errors.dupedoi || this.state.errors.invaliddoi) ? ' fieldError': '')}
                              type='text'
                              name='issue.issueDoi'
                              onChange={this.handler}
                              value={this.state.issue.issueDoi}
                              disabled={this.state.issueDoiDisabled && !this.props.duplicate}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Issue URL (Required)</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder'>
                          <div className='required height32'>
                            <span>*</span>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className={'height32' + ((this.state.errors.issueUrl || this.state.errors.invalidissueurl) ? ' fieldError': '')}
                              type='text'
                              name='issue.issueUrl'
                              value={this.state.issue.issueUrl}
                              onChange={this.handler}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='fieldHolder'>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Print Date</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className={'requiredholder' + (((this.state.issue.onlineDateYear ? this.state.issue.onlineDateYear : '').length === 0)? ' dateselectrequire':' norequire')}>
                          <div className='required height32'>
                            {((this.state.issue.onlineDateYear ? this.state.issue.onlineDateYear : '').length === 0 ? <span>*</span> : <span></span>)}
                          </div>
                        </div>
                        <div className='field'>
                          <div className='datepickerholder'>
                            <div className='dateselectholder'>
                              <div>Year {((this.state.issue.onlineDateYear ? this.state.issue.onlineDateYear : '').length === 0 ? '(*)' : '')}</div>
                              <div>{makeDateDropDown(this.handler, 'issue.printDateYear', 'y', this.state.issue.printDateYear, this.state.errors.printDateYear)}</div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Month</div>
                              <div>
                                {makeDateDropDown(this.handler, 'issue.printDateMonth', 'm', this.state.issue.printDateMonth, false)}
                              </div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Day</div>
                              <div>
                                {makeDateDropDown(this.handler, 'issue.printDateDay', 'd', this.state.issue.printDateDay, false)}
                              </div>
                            </div>
                            <div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Online Date</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className={'requiredholder' + (((this.state.issue.printDateYear ? this.state.issue.printDateYear : '').length === 0)? ' dateselectrequire':' norequire')}>
                          <div className='required height32'>
                            {((this.state.issue.printDateYear ? this.state.issue.printDateYear : '').length === 0 ? <span>*</span> : <span></span>)}
                          </div>
                        </div>
                        <div className='field'>
                          <div className='datepickerholder'>
                            <div className='dateselectholder'>
                              <div>Year {((this.state.issue.printDateYear ? this.state.issue.printDateYear : '').length === 0 ? '(*)' : '')}</div>
                              <div>{makeDateDropDown(this.handler, 'issue.onlineDateYear', 'y', this.state.issue.onlineDateYear, this.state.errors.onlineDateYear)}</div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Month</div>
                              <div>
                                {makeDateDropDown(this.handler, 'issue.onlineDateMonth', 'm', this.state.issue.onlineDateMonth, false)}
                              </div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Day</div>
                              <div>
                                {makeDateDropDown(this.handler, 'issue.onlineDateDay', 'd', this.state.issue.onlineDateDay, false)}
                              </div>
                            </div>
                            <div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='fieldHolder'>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Archive Location</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder norequire'>
                          <div className='required height32'>
                          </div>
                        </div>
                        <div className='field'>
                          {displayArchiveLocations(this.handler, this.state.issue.archiveLocation)}
                        </div>
                      </div>
                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Special Issue Number</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder norequire'>
                          <div className='required height32'>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className='height32'
                              type='text'
                              name='issue.specialIssueNumber'
                              onChange={this.handler}
                              value={this.state.issue.specialIssueNumber}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='errorHolder'>
                  </div>
                </div>
                <hr />
                <div className='row'>
                  <div className='fieldHolder'>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Volume</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder norequire'>
                          <div className='required height32'>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className='height32'
                              type='text'
                              name='issue.volume'
                              onChange={this.handler}
                              value={this.state.issue.volume}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='errorHolder'>
                  </div>
                </div>
                <div className='row'>
                  <div className='fieldHolder'>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Volume DOI</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder norequire'>
                          <div className='required height32'>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className={'height32' + ((this.state.errors.dupedoi || this.state.errors.invaliddoi || this.state.errors.invalidvolumedoi) ? ' fieldError': '')}
                              type='text'
                              name='issue.volumeDoi'
                              onChange={this.handler}
                              value={this.state.issue.volumeDoi}
                              disabled={this.state.volumeDoiDisabled}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Volume URL</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder norequire'>
                          <div className='required height32'>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className={'height32' + ((this.state.errors.volumeUrl || this.state.errors.invalidvolumeurl) ? ' fieldError': '')}
                              type='text'
                              name='issue.volumeUrl'
                              onChange={this.handler}
                              value={this.state.issue.volumeUrl}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <SubItem
                title={'Optional Issue Information (Contributorship)'}
                arrowType={'dark'}
                addable={true}
                incomingData={this.state.optionalIssueInfo}
                handler={this.optionalIssueInfoHandler.bind(this)}
                addHandler={this.addOptionalIssueInfo.bind(this)}
                remove={this.removeOptionalIssueInfo.bind(this)}
              />
              <div className='saveButtonAddIssueHolder'>
                <button type='submit' className='saveButton addIssue'>Submit</button>
                <button onClick={() => this.closeModal()} type='button' className='cancelButton addIssue'>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

