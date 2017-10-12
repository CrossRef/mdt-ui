import React, { Component } from 'react'
import is from 'prop-types'
import update from 'immutability-helper'

import AddIssueCard from '../components/AddIssueModal/addIssueCard'
import defaultState from '../components/AddIssueModal/issueDefaultState'
import {jsEscape, refreshErrorBubble} from '../utilities/helpers'
import getIssueXml from '../components/AddIssueModal/issueXmlGenerator'
import {asyncValidateIssue} from '../utilities/validation'
import parseXMLIssue from '../utilities/parseXMLIssue'
import * as api from '../actions/api'



export default class AddIssueModal extends Component {

  static propTypes = {
    ownerPrefix: is.string.isRequired,
    reduxControlModal: is.func.isRequired,

    asyncGetPublications: is.func.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {...defaultState};
    this.state.ownerPrefix = props.ownerPrefix
    if(props.preFilledData) {
      this.state.issue = {...this.state.issue, ...props.preFilledData}
    }
    this.state.issue.issueDoi = props.ownerPrefix + '/'
    this.state.issue.volumeDoi = props.ownerPrefix + '/'
  }

  async componentDidMount () {
    if(this.props.mode === 'edit') {
      let id, Publication, message, Issue, issueDoiDisabled = false, volumeDoiDisabled = false;

      id = {
        doi: this.props.issue.issueDoi,
        title: this.props.issue.title,
        pubDoi: this.props.publication.message.doi
      }
      Publication = await api.getItem(id)
      message = Publication.message
      Issue = message.contains[0]

      const version = Issue['mdt-version']

      const {issue, optionalIssueInfo, showSection} = parseXMLIssue(Issue.content, this.props.duplicate, this.props.ownerPrefix)

      if(issue.issueDoi === '') {
        issue.issueDoi = this.props.ownerPrefix + '/'
      } else {
        issueDoiDisabled = true
      }

      if(issue.volumeDoi === '') {
        issue.volumeDoi = this.props.ownerPrefix + '/'
      } else {
        volumeDoiDisabled = true
      }

      const {validatedPayload} = await this.validation(issue, optionalIssueInfo, issueDoiDisabled, volumeDoiDisabled)

      const setStatePayload = {
        version: version,
        issueDoiDisabled,
        volumeDoiDisabled,
        issue:  issue,
        optionalIssueInfo: optionalIssueInfo,
        showSection: showSection,
        ...validatedPayload
      }

      this.setState(setStatePayload, ()=> this.state.validating = false)
    }
  }


  async validation (issueData, optionalIssueInfo, issueDoiDisabled, volumeDoiDisabled) {

    const { criticalErrors, warnings, contributors, enableVolumeDoi } = await asyncValidateIssue(issueData, optionalIssueInfo, this.props.ownerPrefix, issueDoiDisabled, volumeDoiDisabled)

    const validatedPayload = {
      validating: true,
      error: false,
      errors: {...criticalErrors, ...warnings},
      optionalIssueInfo: (contributors && contributors.length) ? contributors : optionalIssueInfo
    }
    if(enableVolumeDoi) {
      validatedPayload.volumeDoiDisabled = false
    }
    let valid = true;

    for(const key in warnings) {
      if (warnings[key]) {
        validatedPayload.error = true;
      }
    }

    for(const key in criticalErrors) {
      if(criticalErrors[key]) {
        validatedPayload.error = true
        valid = false;
      }
    }

    return {valid, validatedPayload, criticalErrors}
  }


  save = async () => {

    const {valid, validatedPayload, criticalErrors, issueDoiEntered} = await this.validation(this.state.issue, this.state.optionalIssueInfo, this.state.issueDoiDisabled, this.state.volumeDoiDisabled)

    if (valid) {
      const { publication, mode } = this.props

      const issueXML = getIssueXml(this.state)

      let version = this.state.version

      if (mode === 'edit') {
        version = (Number(this.state.version) + 1).toString()
      }

      const title = jsEscape(this.state.issue.issueTitle)
      const issue = jsEscape(this.state.issue.issue)
      const volume = jsEscape(this.state.issue.volume)

      const newRecord = {
        'title': {issue, volume, title},
        'date': new Date(),
        'doi': issueDoiEntered ? this.state.issue.issueDoi : '',
        'owner-prefix': this.props.ownerPrefix,
        'type': 'issue',
        'mdt-version': version,
        'status': 'draft',
        'content': issueXML.replace(/(\r\n|\n|\r)/gm,'')
      }

      const submissionPayload = {
        ...publication,
        message: {
          ...publication.message,
          contains: [newRecord]
        }
      }

      try {
        await api.submitItem(submissionPayload)
      } catch (e) {
        console.error('ERROR in save Issue: ', e)
      }

      this.props.asyncGetPublications(this.props.publication.message.doi)

      newRecord.pubDoi = publication.message.doi

      if(issueDoiEntered) {
        validatedPayload.issueDoiDisabled = true
      }
      validatedPayload.version = (Number(this.state.version) + 1).toString()
      const { confirmationPayload, timeOut } = this.confirmSave(criticalErrors)
      validatedPayload.confirmationPayload = confirmationPayload
      validatedPayload.timeOut = timeOut

      this.setState(validatedPayload, () => {
        this.state.validating = false
      })

    } else /*if not valid*/ {
      const { confirmationPayload, timeOut } = this.confirmSave(criticalErrors)
      validatedPayload.confirmationPayload = confirmationPayload
      validatedPayload.timeOut = timeOut
      this.setState(validatedPayload, () => {
        this.state.validating = false
      })
    }
  }

  confirmSave = (criticalErrors) => {
    clearTimeout(this.state.timeOut)
    const confirmationPayload = {
      status: 'saveSuccess',
      message: 'Save Complete'
    }

    const errorMessageArray = ['Required to save:']

    const criticalErrorMsg = {
      issueVolume: 'Issue or Volume Number.',
      invalidissuedoi: 'DOI must be valid.',
      invalidIssueDoiPrefix: 'DOI must be valid.',
      dupeissuedoi: 'DOI must be valid.',
      volume: 'Volume Number.'
    }

    for (let error in criticalErrors) {
      if(criticalErrors[error] === true) {
        confirmationPayload.status = 'saveFailed'
        errorMessageArray.push(criticalErrorMsg[error])
      }
    }

    if(confirmationPayload.status === 'saveFailed') {
      confirmationPayload.message = errorMessageArray.join(' ')
    }

    const timeOut = setTimeout(()=>{
      this.setState({confirmationPayload: {status: '', message: ''}})
    }, 7000)

    return {confirmationPayload, timeOut}
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

  closeModal = () => {
    this.props.reduxControlModal({showModal:false})
  }

  helperSwitch = () => {
      this.setState({showHelper: !this.state.showHelper})
  }

  optionalIssueInfoHandlers = () => {
    return {
      handler: (index, OptIssueInfo) => {
        var optIssueInfo = {}
        for(var i in OptIssueInfo.refs){
          if(OptIssueInfo.refs[i]){
            optIssueInfo[i] = OptIssueInfo.refs[i].value
          }
        }

        this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
          optionalIssueInfo: update(this.state.optionalIssueInfo, {[index]: {$set: optIssueInfo }})
        })
      },

      addOptionalIssueInfo: () => {
        this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
          optionalIssueInfo: update(this.state.optionalIssueInfo, {$push:
            [{
              firstName: '',
              lastName: '',
              suffix: '',
              affiliation: '',
              orcid: '',
              alternativeName: '',
              role: '',
              errors: {}
            }]
          })
        })
      },

      remove: (index) => {
        this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
          optionalIssueInfo: update(this.state.optionalIssueInfo, {$splice: [[index, 1]] })
        })
      }
    }
  }

  componentDidUpdate () {
    refreshErrorBubble()
  }

  componentWillUnmount () {
    clearTimeout(this.state.timeOut)
  }


  render () {
    return (
      <AddIssueCard
        save={this.save}
        duplicate={this.props.duplicate}
        handler={this.handler}
        optionalIssueInfoHandlers={this.optionalIssueInfoHandlers}
        closeModal={this.closeModal}
        helperSwitch={this.helperSwitch}

        {...this.state}
      />
    )

  }
}

