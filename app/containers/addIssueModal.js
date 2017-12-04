import React, { Component } from 'react'
import is from 'prop-types'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { controlModal, getPublications } from '../actions/application'
import AddIssueCard from '../components/AddIssueModal/addIssueCard'
import defaultState from '../components/AddIssueModal/issueDefaultState'
import {finishUpdate} from '../utilities/helpers'
import getIssueXml from '../components/AddIssueModal/issueXmlGenerator'
import {asyncValidateIssue} from '../utilities/validation'
import parseXMLIssue from '../utilities/parseXMLIssue'
import * as api from '../actions/api'
import { XMLSerializer, DOMParser } from 'xmldom'



const mapStateToProps = (state, props) => ({})

const mapDispatchToProps = dispatch => bindActionCreators({
  asyncGetPublications: getPublications,
  reduxControlModal: controlModal
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class AddIssueModal extends Component {

  static propTypes = {
    ownerPrefix: is.string.isRequired,
    reduxControlModal: is.func.isRequired,
    asyncGetPublications: is.func.isRequired
  }

  constructor (props) {
    super();

    this.state = {...defaultState};
    this.state.mode = props.mode || 'add'
    this.state.ownerPrefix = props.ownerPrefix
    if(props.preFilledData) {
      this.state.issue = {...this.state.issue, ...props.preFilledData}
    }
    this.state.issue.issueDoi = props.ownerPrefix + '/'
    this.state.issue.volumeDoi = props.ownerPrefix + '/'

    this.state.errorMessages = []
    this.state.focusedInput = ''
  }


  async componentDidMount () {
    if(this.state.mode === 'edit') {
      let id, Publication, Issue, issueDoiDisabled = false, volumeDoiDisabled = false;

      id = {
        doi: this.props.issue.issueDoi,
        title: this.props.issue.title,
        pubDoi: this.props.publication.message.doi
      }
      Publication = await api.getItem(id)
      Issue = Publication.message.contains[0]

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
        titleId: JSON.stringify({issue: issue.issue, volume: issue.volume, title: issue.issueTitle}),
        ...validatedPayload
      }

      this.setState(setStatePayload, ()=> this.state.validating = false)
    }
  }


  async validation (issueData = this.state.issue, optionalIssueInfo = this.state.optionalIssueInfo, issueDoiDisabled = false, volumeDoiDisabled = false) {

    const { criticalErrors, warnings, contributors, enableVolumeDoi } =
      await asyncValidateIssue(issueData, optionalIssueInfo, this.props.ownerPrefix, issueDoiDisabled, volumeDoiDisabled)

    const validatedPayload = {
      validating: true,
      error: false,
      errors: {...criticalErrors, ...warnings},
      mode: 'edit',
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

    validatedPayload.errorMessages = this.errorUtility.onValidate(validatedPayload.errors, validatedPayload.optionalIssueInfo)

    return {valid, validatedPayload, criticalErrors}
  }


  validate = async () => {
    if(this.state.mode === 'edit') {
      const {validatedPayload} = await this.validation()
      this.setState(validatedPayload)
    }
  }


  errorUtility = {

    errorIndicators: [],

    activeIndicator: -1,

    openingSubItem: false,
    subItemIndex: "0",

    saveRef: (activeErrors, trackErrors, node, subItem, subItemIndex, openSubItem) => {
      if(node){
        this.errorUtility.errorIndicators.push({
          activeErrors,
          trackErrors,
          node,
          subItem,
          subItemIndex,
          openSubItem
        })

        if(node.id === 'errorBubble') {
          this.errorUtility.activeIndicator = this.errorUtility.errorIndicators.length - 1
        }
      }
    },

    setErrorMessages: (setErrors, allErrors = this.state.errors) => {
      const filteredErrorMessage = setErrors.filter((error)=>{
        return allErrors[error]
      })
      this.setState({errorMessages: filteredErrorMessage})
    },

    onValidate: (newValidationErrors, optionalIssueInfo) => {
      if(!this.state.errorMessages.length) {
        return []
      }

      const {errorIndicators, activeIndicator} = this.errorUtility
      const activeIndicatorObj = errorIndicators[activeIndicator]
      const trackedIndicatorErrors = activeIndicatorObj ? activeIndicatorObj.trackErrors : []
      let newErrorMessages
      const {subItem, subItemIndex} = activeIndicatorObj || {}

      if(subItem) {

        let allErrors = optionalIssueInfo[subItemIndex].errors

        newErrorMessages = this.state.errorMessages.filter((error) => {
          return allErrors[error]
        })

        if(!newErrorMessages.length) {
          newErrorMessages = trackedIndicatorErrors.filter((error) => {
            return allErrors[error]
          })
        }

      } else {
        newErrorMessages = this.state.errorMessages.filter((error) => {
          return newValidationErrors[error]
        })

        if(!newErrorMessages.length) {
          newErrorMessages = trackedIndicatorErrors.filter((error)=>{
            return newValidationErrors[error]
          })
        }

        this.errorUtility.subItemIndex = "0"
      }

      if(!newErrorMessages.length) {
        const indicatorBelow = errorIndicators[activeIndicator + 1]
        const indicatorAbove = errorIndicators[activeIndicator - 1]

        if(indicatorBelow) {
          newErrorMessages = indicatorBelow.activeErrors
          this.errorUtility.subItemIndex = indicatorBelow.subItemIndex || "0"
        } else if(indicatorAbove) {
          newErrorMessages = indicatorAbove.activeErrors
          this.errorUtility.subItemIndex = indicatorAbove.subItemIndex || "0"
        }
      }

      console.log(newErrorMessages)

      return newErrorMessages
    }
  }


  tooltipUtility = {

    getFocusedInput: () => this.state.focusedInput,

    tooltipMounted: false,

    assignRefreshTask: (func) => {
      this.tooltipUtility.tooltipMounted = true
      this.tooltipUtility.refreshTask = func
    },

    refresh: (param) => {
      if(
        this.tooltipUtility.tooltipMounted &&
        typeof this.tooltipUtility.refreshTask === 'function'
      ) {
        return finishUpdate().then(()=>this.tooltipUtility.refreshTask(param))
      }
    },

    assignFocus: (inputId, tooltip) => {
      this.setState({focusedInput: inputId})
      return this.tooltipUtility.refresh(tooltip)
    }
  }


  save = async () => {

    const {valid, validatedPayload, criticalErrors, issueDoiEntered} =
      await this.validation(this.state.issue, this.state.optionalIssueInfo, this.state.issueDoiDisabled, this.state.volumeDoiDisabled)

    validatedPayload.focusedInput = ''

    if (valid) {
      const issueDoi = issueDoiEntered ? this.state.issue.issueDoi : ''
      const { publication, mode } = this.props

      const issueXML = getIssueXml(this.state)

      let version = this.state.version

      if (mode === 'edit') {
        version = String(Number(this.state.version) + 1)
      }

      const title = this.state.issue.issueTitle
      const issue = this.state.issue.issue
      const volume =this.state.issue.volume
      const newRecord = {
        'title': JSON.parse(JSON.stringify({issue, volume, title})),
        'date': new Date(),
        'doi': issueDoi,
        'owner-prefix': this.props.ownerPrefix,
        'type': 'issue',
        'mdt-version': version,
        'status': 'draft',
        'content': new XMLSerializer().serializeToString(issueXML)
      }
      const submissionPayload = {
        ...publication,
        message: {
          ...publication.message,
          contains: [newRecord]
        }
      }

      const newTitleId = JSON.stringify(newRecord.title)
      const oldTitleId = this.state.titleId
      validatedPayload.titleId = newTitleId

      //check if new titleId, if so, do rename
      if(!issueDoiEntered && oldTitleId && oldTitleId !== newTitleId) {
        const issueInfo = mode === 'edit' ?
          publication.normalizedRecords.find( record =>
            JSON.stringify(record.title) === oldTitleId
          )
        : undefined

        //get article content
        let articles = []
        if(issueInfo && issueInfo.contains && issueInfo.contains.length) {
          for (let article of issueInfo.contains) {
            const getArticleContent = await api.getItem(article.doi)
            const articleContent = getArticleContent.message.contains[0].contains[0]
            articleContent['mdt-version'] = String(Number(articleContent['mdt-version']) + 1)
            articles.push(articleContent)
          }
        }

        //delete old issue
        await api.deleteItem({doi: issueDoi, title: oldTitleId, pubDoi: publication.message.doi})

        //save new issue
        await api.submitItem(submissionPayload)

        //save articles to new issue
        for (let articleContent of articles) {
          newRecord.contains = [articleContent]
          await api.submitItem(submissionPayload)
        }

      } else {
        await api.submitItem(submissionPayload)
      }

      this.props.asyncGetPublications(this.props.publication.message.doi)

      if(issueDoiEntered) {
        validatedPayload.issueDoiDisabled = true
      }
      validatedPayload.version = String(Number(this.state.version) + 1)
      const { confirmationPayload, timeOut } = this.confirmSave(criticalErrors)
      validatedPayload.confirmationPayload = confirmationPayload
      validatedPayload.timeOut = timeOut

      this.setState(validatedPayload)

    } else /*if not valid*/ {
      const { confirmationPayload, timeOut } = this.confirmSave(criticalErrors)
      validatedPayload.confirmationPayload = confirmationPayload
      validatedPayload.timeOut = timeOut
      this.setState(validatedPayload)
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


  boundSetState = (...args) => { this.setState(...args) }


  addSubItem = () => {
    this.setState({
      optionalIssueInfo: update(this.state.optionalIssueInfo, {$push: defaultState.optionalIssueInfo})
    })
  }


  removeSubItem = (index) => {
    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
      optionalIssueInfo: update(this.state.optionalIssueInfo, {$splice: [[index, 1]] })
    })
  }


  componentDidUpdate (prevProps, prevState) {
    //Select first error if first validation
    if(
      this.state.validating &&
      this.state.error && !prevState.error
    ) {
      try {
        this.errorUtility.setErrorMessages(this.errorUtility.errorIndicators[0].activeErrors)
      } catch (e) {}
    }

    this.tooltipUtility.refresh()

    this.state.validating = false
  }


  componentWillUnmount () {
    clearTimeout(this.state.timeOut)
  }


  render () {
    this.errorUtility.errorIndicators = []  //Saving refs of any errorIndicators rendered so need to clear it before each render
    this.errorUtility.openingSubItem = false
    return (
      <AddIssueCard
        save={this.save}
        duplicate={this.props.duplicate}
        handler={this.handler}
        addSubItem={this.addSubItem}
        removeSubItem={this.removeSubItem}
        closeModal={this.closeModal}
        helperSwitch={this.helperSwitch}
        errorUtility={this.errorUtility}
        validate={this.validate}
        boundSetState={this.boundSetState}
        tooltipUtility={this.tooltipUtility}
        {...this.state}
      />
    )

  }
}

