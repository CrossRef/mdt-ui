import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import update from 'immutability-helper'
import ModalCard from './modalCard'
import SubItem from './SubItems/subItem'
import client from '../client'
import fetch from '../utilities/fetch'
import checkDupeDOI from '../utilities/dupeDOI'
import isDOI from '../utilities/isDOI'
import isURL from '../utilities/isURL'
import Switch from 'react-toggle-switch'
import _ from 'lodash'
import xmldoc from '../utilities/xmldoc'
import JSesc from '../utilities/jsesc'
import objectSearch from '../utilities/objectSearch'
const ArchiveLocations = require('../utilities/archiveLocations.json')

export default class AddIssueCard extends Component {
  constructor (props) {
    super(props)
    const { handle, fetchIssue, postIssue } = this.props
    this.state = {
      handler: handle,
      fetchIssue: fetchIssue,
      postIssue: postIssue,
      mode: 'new',
      showIssueDoiReq: false,
      showHelper: false,
      on: false,
      error: false,
      version: '0',
      issueDoiDisabled: false,
      volumeDoiDisabled: false,
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
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      handler: nextProps.handle,
      fetchIssue: nextProps.fetchIssue,
      postIssue: nextProps.postIssue
    })
  }

  componentDidMount () {
    const child = this.refs.child

    if (this.props.triggerModal) { //its a doi
      if (this.props.triggerModal === this.props.issue.doi) {
        this.setState({
          mode: 'edit'
        }, () => {
          this.modalShown()
          this.child.handleOpenModal()
        })
      }
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

  displayArchiveLocations () {
      var locations = [
        <option key='-1'></option>,
        ...ArchiveLocations.map((location, i) => (<option key={i} value={location.value}>{location.name}</option>))
      ]

      return (
          <select
            ref='issue.archiveLocation'
            className='height32'
            name='issue.archiveLocation'
            onChange={this.handler.bind(this)}
            value={this.state.issue.archiveLocation}
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
        name={ref}
        value={preset}
        onChange={this.handler.bind(this)}
        >
        {s}
      </select>
    )
  }

  handler (e) {
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
        //we ONLY care about issueDOI if there is a issue URL
        // of course issue URL is required, so doi is required, kinda

        //only need print year and/or online year, not both
        var hasPrintYear = false, hasOnlineYear = false
        if ((this.state.issue.printDateYear.length > 0) || (this.state.issue.printOnlineYear.length > 0)) {
          hasDate = true
          if ((this.state.issue.printDateYear.length > 0)) {
            hasPrintYear = true
          }
          if ((this.state.issue.printOnlineYear.length > 0)) {
            hasOnlineYear = true
          }
        }

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
          errorState.onlineDateYear = {$set: false}
        }
        if (hasOnlineYear) { // has online year, don't care if there is a print year
          errorState.printDateYear = {$set: false}
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
            (contributor.orcid && (contributor.orcid.trim().length>0)) ? `<ORCID>${contributor.orcid}</ORCID>` : undefined,
            (contributor.alternativeName && (contributor.alternativeName.trim().length>0)) ? `<alt-name>${contributor.alternativeName}</alt-name>` : undefined
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
    if ((this.state.issue.volumeDoi ? this.state.issue.volumeDoi : '').trim().length > 0 || (this.state.issue.volumeUrl ? this.state.issue.volumeUrl : '').trim().length > 0 || (this.state.issue.volume ? this.state.issue.volume : '').trim().length > 0) {
      volume += ((this.state.issue.volume ? this.state.issue.volume : '').trim().length > 0 ? `<volume>${this.state.issue.volume}</volume>` : ``)

      var volumeDoiData = ''
      if ((this.state.issue.volumeDoi ? this.state.issue.volumeDoi : '').trim().length > 0 || (this.state.issue.volumeUrl ? this.state.issue.volumeUrl : '').trim().length > 0 ) {
        volumeDoiData += ((this.state.issue.volumeDoi ? this.state.issue.volumeDoi : '').trim().length > 0 ? `<doi>${this.state.issue.volumeDoi}</doi>` : ``)
        volumeDoiData += ((this.state.issue.volumeUrl ? this.state.issue.volumeUrl : '').trim().length > 0 ? `<resource>${this.state.issue.volumeUrl}</resource>` : ``)
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

    this.validation((valid) => { // need it to be a callback because setting state does not happen right away
      if (!valid) {
        const props = this.props
        var publication = this.props.publication
        const state = this.state

        const issueXML = (this.getIssueXML())

        var version = this.state.version

        if (props.mode === 'edit') {
          version = String(parseInt(this.state.version) + 1)
        }

        const title = JSesc(this.state.issue.issueTitle)

        const newRecord = {
          'title': {'title': title},
          'doi': this.state.issue.issueDoi,
          'type': 'issue',
          'mdt-version': version,
          'status': 'draft',
          'content': issueXML.replace(/(\r\n|\n|\r)/gm,'')
        }

        publication.message.contains = [newRecord]
        this.state.postIssue(publication, () => {
          this.state.handler(publication.message.doi)
          this.closeModal()
        })
      }
    })
  }

  closeModal () {
    const errors = {
      issueUrl: false,
      publicationDateType: false,
      printDateYear: false,
      onlineDateYear: false,
      invalidissueurl: false,
      dupeissuedoi: false,
      invalidissuedoi: false
    }

    const issue = {
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
      pubDateType: '',
      archiveLocation: '',
      specialIssueNumber: '',
      volume: '',
      volumeDoi: '',
      volumeUrl: ''
    }

    const optionalIssueInfo = {
      firstName: '',
      lastName: '',
      suffix: '',
      affiliation: '',
      orcid: '',
      alternativeName: '',
      role: ''
    }

    this.setState({
      showHelper: false,
      on: false,
      error: false,
      version: '0',
      errors: update(this.state.erros, {$set: errors }),
      issue: update(this.state.issue, {$set: issue }),
      optionalIssueInfo: update(this.state.optionalIssueInfo, {$set: [optionalIssueInfo] }),
    })
    this.child.handleCloseModal()
  }

  modalShown () {
    const { doi } = this.props.issue
    // if doi is not required, then how is UI suppose to find a issue?
    this.state.fetchIssue(doi, (Publication) => {
      const message = Publication.message
      const Issue = message.contains[0]
      const version = Issue['mdt-version']

      const parsedIssue = xmldoc(Issue.content)
      const issueTitle = objectSearch(parsedIssue, 'title') ? objectSearch(parsedIssue, 'title') : ''
      const issue = objectSearch(parsedIssue, 'issue') ? objectSearch(parsedIssue, 'issue') : ''
      const issueDoi = objectSearch(parsedIssue, 'doi') ? objectSearch(parsedIssue, 'doi') : ''
      const issueUrl = objectSearch(parsedIssue, 'resource') ? objectSearch(parsedIssue, 'resource') : ''
      const special_numbering = objectSearch(parsedIssue, 'special_numbering') ? objectSearch(parsedIssue, 'special_numbering') : ''
      const publication_date = objectSearch(parsedIssue, 'publication_date')

      const onlinePubDate = _.find(publication_date, (pubDate) => {
        if (pubDate['-media_type'] === 'online') {
          return pubDate
        }
      })

      const printPubDate = _.find(publication_date, (pubDate) => {
        if (pubDate['-media_type'] === 'print') {
          return pubDate
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
        issueDoi: issueDoi,
        issueUrl: issueUrl,
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
        issueDoiDisabled = issueDoi.length > 0 ? true : false
      }

      var volumeDoiDisabled = false
      if (volumeDoi) {
        volumeDoiDisabled = volumeDoi.length > 0 ? true : false
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

  render () {
    return (
      <div className='addIssueCard'>
        <div>
          <ModalCard
            cardtitle={this.props.mode === 'new' ? 'Create New Issue/Volume' : 'Edit Issue/Volume'}
            buttonTitle={this.props.listtitle ? this.props.listtitle : 'Create New Issue/Volume'}
            buttonClassStyle={this.props.listtitle ? 'editIssue' : 'addIssue'}
            modalInnerBodyStyle={'issueInnerBody'}
            modalContentStyle={'issueModalContentStyle'}
            onRef={ref => (this.child = ref)}
            link={this.props.listtitle ? true : false}
            emitshowModal={this.props.mode === 'edit' ? this.modalShown.bind(this) : undefined}
            closeModal={this.closeModal.bind(this)}
          >
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
                                name='issue.issue'
                                onChange={this.handler.bind(this)}
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
                                onChange={this.handler.bind(this)}
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
                                name='issue.issueDoi'
                                onChange={this.handler.bind(this)}
                                value={this.state.issue.issueDoi}
                                disabled={this.state.issueDoiDisabled}
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
                                onChange={this.handler.bind(this)}
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
                          <div className={'requiredholder' + (((this.state.issue.onlineDateYear ? this.state.issue.onlineDateYear : '').length === 0)? ' dateselectrequire':' norequire')}>>
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
                                name='issue.specialIssueNumber'
                                onChange={this.handler.bind(this)}
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
                                onChange={this.handler.bind(this)}
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
                                onChange={this.handler.bind(this)}
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
                                onChange={this.handler.bind(this)}
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
                <div className='saveButtonHolder'>
                  <button type='submit' className='saveButton'>Save</button>
                </div>
              </div>
            </form>
          </ModalCard>
        </div>
      </div>
    )
  }
}
