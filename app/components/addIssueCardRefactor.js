import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import update from 'immutability-helper'
import _ from 'lodash'
import Switch from 'react-toggle-switch'
import { stateTrackerII } from 'my_decorators'

import ModalCard from './modalCard'
import SubItem from './SubItems/subItem'
import client from '../client'
import fetch from '../utilities/fetch'
import checkDupeDOI from '../utilities/dupeDOI'
import isDOI from '../utilities/isDOI'
import isURL from '../utilities/isURL'
const ArchiveLocations = require('../utilities/archiveLocations.json')


const defaultState = (handle = null) => ({
  handler: handle,
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
})

@stateTrackerII
export default class AddIssueCard extends Component {
  constructor (props) {
    super(props)
    const {handle} = this.props
    this.state = defaultState(handle)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      handler: nextProps.handle
    })
  }

  componentDidMount () {
    const child = this.refs.child
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

  displayArchiveLocations () {
      var locations = [
        <option key='-1'></option>,
        ...ArchiveLocations.map((location, i) => (<option key={i} value={location.value}>{location.name}</option>))
      ]

      return (
          <select
            ref='issue.archiveLocation'
            className='height32'
            defaultValue={this.state.issue.archiveLocation}
            >
              {locations}
          </select>
      )
  }

  makeDateDropDown (ref, type, preset, validation, index, item) {
    var s = [<option key='-1'></option>], start = 0, end = 0
    if (type === 'y') {
      start = 2017
      end = 1980
    } else if (type === 'd') {
      start = 1
      end = 31
    } else if (type === 'm') {
      start = 1
      end = 12
    }

    if (type === 'y') {
      for(var i = start; i >= end; i--){
        s.push(<option key={i} value={i}>{i}</option>)
      }
    } else {
      for(var i = start; i <= end; i++){
        s.push(<option key={i} value={i}>{i}</option>)
      }
    }

    return (
      <select
        className={'height32 datepickselects' + ((validation) ? ' fieldError': '')}
        ref={ref}
        defaultValue={preset}
        >
        {s}
      </select>
    )
  }

  validation (callback) {
    var errorStates = {
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

        //we ONLY care about issueDOI if there is a issue URL
        // of course issue URL is required, so doi is required, kinda
        errorStates = {
          issueUrl: {$set: (this.state.issue.issueUrl.length === 0) },
          printDateYear: {$set: (this.state.issue.printDateYear.length === 0) },
          onlineDateYear: {$set: (this.state.issue.onlineDateYear.length === 0) },
          invalidissueurl: {$set: !isURL(this.state.issue.issueUrl) },
          dupeissuedoi: {$set: (this.state.issue.issueDoi.length > 0) ? isDupe[0] : false }, // we only care IF there is a DOI
          issuedoi: {$set: ((this.state.issue.issueDoi.length === 0) && (isURL(this.state.issue.issueUrl))) }, // we only care IF there is a DOI
          invalidissuedoi: {$set: ((this.state.issue.issueDoi.length > 0) && (isURL(this.state.issue.issueUrl))) ? !isDOI(this.state.issue.issueDoi) : false } // we only care IF there is a DOI
        }

        if (hasPrintYear) { // has print year, don't care if there is a online year
          errorStates.onlineDateYear = {$set: false}
        }
        if (hasOnlineYear) { // has online year, don't care if there is a print year
          errorStates.printDateYear = {$set: false}
        }

        errorStates.dupeissuedoi = (this.state.issueDoiDisabled) ? {$set: false} : errorStates.dupeissuedoi

        if ((this.state.issue.volume.length > 0) || (this.state.issue.volumeDoi.length > 0) || (this.state.issue.volumeUrl.length > 0)) {
          errorStates.dupevolumedoi = {$set: (this.state.issue.volumeDoi.length > 0) ? isDupe[1] : false }, // we only care IF there is a DOI
          errorStates.invalidvolumedoi = {$set: ((this.state.issue.volumeDoi.length > 0) && (!isDOI(this.state.issue.volumeDoi))) }, // we only care IF there is a DOI
          errorStates.invalidvolumeurl = {$set: (this.state.issue.volumeUrl.length > 0) ? !isURL(this.state.issue.volumeUrl) : false  }

          errorStates.dupevolumedoi = (this.state.volumeDoiDisabled) ? {$set: false} : errorStates.dupevolumedoi
        }

        this.setState({
          errors: update(this.state.errors, errorStates)
        }, ()=>{
          for(var key in this.state.errors) { // checking all the properties of errors to see if there is a true
              if (this.state.errors[key]) {
                this.setState({error: true})
                return callback(this.state.errors[key]) // there is a true, return the true, means there is an error
              }
          }
          return callback(false) // iterated the entire object, no true, returning a false, no error
        })
    })
  }

  getSubmitSubItems (items) {
    return _.filter(items, (item) => {
      for(var key in item) { // checking all the properties of errors to see if there is a true
        if(item[key]){
          try {
            if (item[key].trim().length > 0) {
              return item
            }
          } catch (e) {
            if (item[key].length > 0) {
              return item
            }
          }

        }
      }
    })
  }

  getContributor () {
      var contributors = this.getSubmitSubItems(this.state.optionalIssueInfo).map((contributor, i) => {
          // cause the type "ROLE" is shared name
          var attributes = [
            (contributor.firstName && (contributor.firstName.trim().length>0)) ? `<given_name>${contributor.firstName}</given_name>` : undefined,
            (contributor.lastName && (contributor.lastName.trim().length>0)) ? `<surname>${contributor.lastName}</surname>` : undefined,
            (contributor.suffix && (contributor.suffix.trim().length>0)) ? `<suffix>${contributor.suffix}</suffix>` : undefined,
            (contributor.affiliation && (contributor.affiliation.trim().length>0)) ? `<affiliation>${contributor.affiliation}</affiliation>` : undefined,
            (contributor.orcid && (contributor.orcid.trim().length>0)) ? `<ORCID>${contributor.orcid}</ORCID>` : undefined
          ]

          attributes = _.filter(attributes, (attribute) => { // filter all the undefined
            for(var key in attribute) { // checking all the properties of errors to see if there is a true
                if (attribute[key]) {
                  return attribute
                }
            }
          })

          var person = `<person_name sequence="${(i===0) ? 'first' : 'additional'}" contributor_role="${(contributor.role && (contributor.role.trim().length>0)) ? contributor.role : false}">${attributes.join('')}</person_name>`

        return person
      })

      return contributors.length > 0 ? `<contributors>${contributors.join('')}</contributors>` : ``
  }

  getIssueXML () {
    // the title
    const titles = this.state.issue.issueTitle.trim().length > 0 ? `<titles><title>${this.state.issue.issueTitle.trim()}</title></titles>` : ``

    // special numbering
    const specialNumbering = this.state.issue.specialIssueNumber.trim().length > 0 ? `<special_numbering>${this.state.issue.specialIssueNumber.trim()}</special_numbering>` : ``

    // special numbering
    const issue = this.state.issue.issue.trim().length > 0 ? `<issue>${this.state.issue.issue.trim()}</issue>` : ``

    // the online date
    var publicationOnlineDate = ''
    if (this.state.issue.onlineDateYear.length > 0 || this.state.issue.onlineDateDay.length > 0 || this.state.issue.onlineDateMonth.length > 0) {
      publicationOnlineDate += (this.state.issue.onlineDateYear.length > 0 ? `<year>${this.state.issue.onlineDateYear}</year>` : ``)
      publicationOnlineDate += (this.state.issue.onlineDateMonth.length > 0 ? `<month>${this.state.issue.onlineDateMonth}</month>` : ``)
      publicationOnlineDate += (this.state.issue.onlineDateDay.length > 0 ? `<day>${this.state.issue.onlineDateDay}</day>` : ``)

      publicationOnlineDate = `<publication_date media_type="online">${publicationOnlineDate}</publication_date>`
    }

    // the print date
    var publicationPrintDate = ''
    if (this.state.issue.printDateYear.length > 0 || this.state.issue.printDateDay.length > 0 || this.state.issue.printDateMonth.length > 0) {
      publicationPrintDate += (this.state.issue.printDateYear.length > 0 ? `<year>${this.state.issue.printDateYear}</year>` : ``)
      publicationPrintDate += (this.state.issue.printDateMonth.length > 0 ? `<month>${this.state.issue.printDateMonth}</month>` : ``)
      publicationPrintDate += (this.state.issue.printDateDay.length > 0 ? `<day>${this.state.issue.printDateDay}</day>` : ``)

      publicationPrintDate = `<publication_date media_type="print">${publicationPrintDate}</publication_date>`
    }

    //doi_data
    var doiData = ''
    if (this.state.issue.issueDoi.trim().length > 0 || this.state.issue.issueUrl.trim().length > 0 ) {
      doiData += (this.state.issue.issueDoi.trim().length > 0 ? `<doi>${this.state.issue.issueDoi}</doi>` : ``)
      doiData += (this.state.issue.issueUrl.trim().length > 0 ? `<resource>${this.state.issue.issueUrl}</resource>` : ``)
      doiData = `<doi_data>${doiData}</doi_data>`
    }

    // volume
    var volume = ''
    if (this.state.issue.volumeDoi.trim().length > 0 || this.state.issue.volumeUrl.trim().length > 0 || this.state.issue.volume.trim().length > 0) {
      volume += (this.state.issue.volume.trim().length > 0 ? `<volume>${this.state.issue.volume}</volume>` : ``)

      var volumeDoiData = ''
      if (this.state.issue.volumeDoi.trim().length > 0 || this.state.issue.volumeUrl.trim().length > 0 ) {
        volumeDoiData += (this.state.issue.volumeDoi.trim().length > 0 ? `<doi>${this.state.issue.volumeDoi}</doi>` : ``)
        volumeDoiData += (this.state.issue.volumeUrl.trim().length > 0 ? `<resource>${this.state.issue.volumeUrl}</resource>` : ``)
        volumeDoiData = `<doi_data>${volumeDoiData}</doi_data>`
      }

      volume = `<journal_volume>${volume}${volumeDoiData}</journal_volume>`
    }

    // archive locations
    var archiveLocation = ''
    if (this.state.issue.archiveLocation.trim().length > 0) {
      archiveLocation = `<archive_locations><archive name="${this.state.issue.archiveLocation}"/></archive_locations>`
    }

    return `<?xml version="1.0" encoding="UTF-8"?><crossref xmlns="http://www.crossref.org/xschema/1.1" xsi:schemaLocation="http://www.crossref.org/xschema/1.1 http://doi.crossref.org/schemas/unixref1.1.xsd"><journal_issue>${this.getContributor()}${titles}${issue}${specialNumbering}${publicationOnlineDate}${publicationPrintDate}${volume}${archiveLocation}${doiData}</journal_issue></crossref>`

  }

  onSubmit (e) {
    e.preventDefault()
    //let gather the modal window refs
    var issueData = {}
    for(var i in this.refs){
      if(i.indexOf('issue.') > -1) {
        issueData[i.substr(i.indexOf('.')+1, i.length-1)] = this.refs[i].value
      }
    }

    this.setState({
      issue: issueData
    }, () => {
      this.validation((valid) => { // need it to be a callback because setting state does not happen right away
        if (!valid) {
          const props = this.props
          var publication = this.props.publication
          const state = this.state

          const issueXML = (this.getIssueXML())

          var newRecord = {
            'title': {'title': this.state.issue.issueTitle},
            'doi': this.state.issue.issueDoi,
            'type': 'issue',
            'mdt-version': this.state.version,
            'status': 'draft',
            'content': issueXML.replace(/(\r\n|\n|\r)/gm,'')
          }

          publication.message.contains = [newRecord]

          fetch(`http://mdt.crossref.org/mdt/v1/work`, { // using isomorphic-fetch directly here, React is NOT passing the action everytime
              method: 'post',
              headers: client.headers,
              body: JSON.stringify(publication)
            }
          ).then(() => {
            this.state.handler(publication.message.doi)
            this.closeModal()
          })
        }
      })
    })
  }

  closeModal () {
    this.setState(defaultState())
    this.props.reduxControlModal({showModal:false})
  }

  render () {
    return (
      <div className='addIssueCard'>
        <div>
          <form onSubmit={this.onSubmit.bind(this)} className='addIssues'>
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
                        <div className='requiredholder norequire'>
                          <div className='required height32'>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className='height32'
                              type='text'
                              ref='issue.issue'
                              defaultValue={this.state.issue.issue}
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
                              defaultValue={this.state.issue.issueTitle}
                              ref='issue.issueTitle'
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
                                  this.state.errors.issuedoi ||
                                  this.state.errors.issueUrl ||
                                  this.state.errors.printDateYear ||
                                  this.state.errors.onlineDateYear
                                ) &&
                                  <div><b>Required.</b><br />Please provide required informaton.</div>
                                }
                                {(this.state.errors.invalidissuedoi || this.state.errors.invalidvolumedoi) &&
                                  <div><b>Invalid DOI.</b><br />Please check your DOI (10.xxxx/xx...).</div>
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
                              ref='issue.issueDoi'
                              defaultValue={this.state.issue.issueDoi}
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
                              ref='issue.issueUrl'
                              defaultValue={this.state.issue.issueUrl}
                              onChange={(input) => {
                                  input.currentTarget.value.length > 0 ? this.setState({showIssueDoiReq:true}) : this.setState({showIssueDoiReq:false})
                                }
                              }
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
                              <div>{this.makeDateDropDown('issue.printDateYear', 'y', this.state.issue.printDateYear, this.state.errors.printDateYear, 0, this, 'issue')}</div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Month</div>
                              <div>
                                {this.makeDateDropDown('issue.printDateMonth', 'm', this.state.issue.printDateMonth, false, 0, this, 'issue')}
                              </div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Day</div>
                              <div>
                                {this.makeDateDropDown('issue.printDateDay', 'd', this.state.issue.printDateDay, false, 0, this, 'issue')}
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
                              <div>{this.makeDateDropDown('issue.onlineDateYear', 'y', this.state.issue.onlineDateYear, this.state.errors.onlineDateYear, 0, this, 'issue')}</div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Month</div>
                              <div>
                                {this.makeDateDropDown('issue.onlineDateMonth', 'm', this.state.issue.onlineDateMonth, false, 0, this, 'issue')}
                              </div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Day</div>
                              <div>
                                {this.makeDateDropDown('issue.onlineDateDay', 'd', this.state.issue.onlineDateDay, false, 0, this, 'issue')}
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
                          {this.displayArchiveLocations()}
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
                              ref='issue.specialIssueNumber'
                              defaultValue={this.state.issue.specialIssueNumber}
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
                              ref='issue.volume'
                              defaultValue={this.state.issue.volume}
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
                              className={'height32' + ((this.state.errors.dupedoi || this.state.errors.invalidvolumedoi) ? ' fieldError': '')}
                              type='text'
                              ref='issue.volumeDoi'
                              defaultValue={this.state.issue.volumeDoi}
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
                              ref='issue.volumeUrl'
                              defaultValue={this.state.issue.volumeUrl}
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
              <div className='saveButtonHolder'>
                <button type='submit' className='saveButton'>Save</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
