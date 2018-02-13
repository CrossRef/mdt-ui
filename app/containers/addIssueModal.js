import React, { Component } from 'react'
import is from 'prop-types'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { controlModal, getPublications } from '../actions/application'
import AddIssueCard from '../components/AddIssueModal/addIssueCard'
import defaultState from '../components/AddIssueModal/issueDefaultState'
import {finishUpdate, doiEntered, escapeString} from '../utilities/helpers'
import getIssueXml from '../components/AddIssueModal/issueXmlGenerator'
import {asyncValidateIssue} from '../utilities/validation'
import parseXMLIssue from '../utilities/parseXMLIssue'
import * as api from '../actions/api'
import { XMLSerializer, DOMParser } from 'xmldom'



const mapStateToProps = (state, props) => ({
  publication: state.publications[props.pubDoi]
})

const mapDispatchToProps = dispatch => bindActionCreators({
  asyncGetPublications: getPublications,
}, dispatch)



export class AddIssueModal extends Component {

  static propTypes = {
    mode: is.string,
    pubDoi: is.string.isRequired,
    asyncGetPublications: is.func.isRequired,
    publication: is.object.isRequired,
    close: is.func.isRequired //close function and reduxControlModal provided by modal container parent
  }

  constructor (props) {
    super();

    this.state = {...defaultState};
    this.state.mode = props.mode || 'add'
    this.state.ownerPrefix = props.pubDoi.split('/')[0]

    this.state.issue.issueDoi = this.state.ownerPrefix + '/'
    this.state.issue.volumeDoi = this.state.ownerPrefix + '/'

    this.state.errorMessages = []
    this.state.focusedInput = ''
    this.state.activeCalendar = ''
  }


  async componentDidMount () {
    if(this.state.mode === 'edit') {
      let id, Publication, Issue, issueDoiDisabled = false, volumeDoiDisabled = false;

      id = {
        doi: this.props.issue.doi,
        title: this.props.issue.title,
        pubDoi: this.props.publication.message.doi
      }
      Publication = await api.getItem(id)
      Issue = Publication.message.contains[0]
      const savedIssueState = Issue.state || {}

      const version = Issue['mdt-version']

      const {issue, optionalIssueInfo, showSection} = parseXMLIssue(Issue.content, this.state.ownerPrefix)

      if(!doiEntered(issue.issueDoi, this.state.ownerPrefix)) {
        issue.issueDoi = this.state.ownerPrefix + '/'
      } else {
        issueDoiDisabled = true
      }

      if(!doiEntered(issue.volumeDoi, this.state.ownerPrefix)) {
        issue.volumeDoi = this.state.ownerPrefix + '/'
      } else {
        volumeDoiDisabled = true
      }

      const checkDuplicateId = false
      const {validatedPayload} = await this.validation(checkDuplicateId, issue, optionalIssueInfo, issueDoiDisabled)

      const setStatePayload = {
        version: version,
        issueDoiDisabled,
        volumeDoiDisabled,
        issue:  issue,
        optionalIssueInfo: optionalIssueInfo,
        showSection: showSection,
        titleId: JSON.stringify({issue: issue.issue, volume: issue.volume, title: issue.issueTitle}),
        depositTimestamp: Issue['deposit-timestamp'],
        ...validatedPayload
      }

      if(savedIssueState.archiveLocation) {
        setStatePayload.issue.archiveLocation = savedIssueState.archiveLocation
      }

      this.setState(setStatePayload, ()=> this.state.validating = false)
    }
  }


  async validation (
    checkDuplicateId = false,
    issueData = this.state.issue,
    optionalIssueInfo = this.state.optionalIssueInfo,
    issueDoiDisabled = this.state.issueDoiDisabled
  ) {

    const { criticalErrors, warnings, contributors, enableVolumeDoi, issueDoiEntered } =
      await asyncValidateIssue({
        issueData,
        optionalIssueInfo,
        ownerPrefix: this.state.ownerPrefix,
        publicationRecords: this.props.publication.normalizedRecords,
        issueDoiDisabled,
        checkDuplicateId
      })

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
        validatedPayload.error = true
      }
    }

    for(const key in criticalErrors) {
      if(criticalErrors[key]) {
        validatedPayload.error = true
        valid = false
      }
    }

    validatedPayload.errorMessages = this.errorUtility.onValidate(validatedPayload.errors, validatedPayload.optionalIssueInfo)

    return {valid, validatedPayload, criticalErrors, issueDoiEntered}
  }


  validate = async () => {
    const title = this.state.issue.issueTitle, issue = this.state.issue.issue, volume = this.state.issue.volume
    const newTitleId = JSON.stringify({issue, volume, title})
    const oldTitleId = this.state.titleId
    const titleIdChanged = oldTitleId !== newTitleId

    if(this.state.mode === 'edit') {
      const {validatedPayload} = await this.validation(titleIdChanged)
      this.setState(validatedPayload)
    }
  }


  save = async () => {
    const title = this.state.issue.issueTitle, issue = this.state.issue.issue, volume = this.state.issue.volume
    const newTitleId = JSON.stringify({issue, volume, title})
    const oldTitleId = this.state.titleId
    const titleIdChanged = oldTitleId !== newTitleId
    const issueDoiDisabled = this.state.issueDoiDisabled

    const {valid, validatedPayload, criticalErrors, issueDoiEntered} =
      await this.validation(titleIdChanged)

    validatedPayload.focusedInput = ''

    if (valid) {
      const issueDoi = issueDoiEntered ? this.state.issue.issueDoi : ''
      const { publication, mode } = this.props

      const issueXML = getIssueXml(this.state)

      let version = this.state.version

      if (mode === 'edit') {
        version = String(Number(this.state.version) + 1)
      }

      const newRecord = {
        'title': {issue: escapeString(issue), volume: escapeString(volume), title: escapeString(title)},
        'date': new Date(),
        'deposit-timestamp': this.state.depositTimestamp || null,
        'doi': issueDoi,
        'owner-prefix': this.state.ownerPrefix,
        'type': 'issue',
        'mdt-version': version,
        'status': 'draft',
        'content': new XMLSerializer().serializeToString(issueXML)
      }

      let state = {}
      let hasState = false
      if(this.state.issue.archiveLocation) {
        state.archiveLocation = this.state.issue.archiveLocation
        hasState = true
      }

      if(hasState) {
        newRecord.state = state
      }

      const submissionPayload = {
        message: {
          ...publication.message,
          contains: [newRecord]
        }
      }

      validatedPayload.titleId = newTitleId

      //check if new titleId or doi, if so, do rename
      if(
        (!issueDoiEntered && oldTitleId && titleIdChanged) ||
        (oldTitleId && !issueDoiDisabled && issueDoiEntered)
      ) {
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
        await api.deleteItem({title: oldTitleId, pubDoi: publication.message.doi})

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
      dupTitleIdIssue: 'Issue/Volume already exists.',
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


  errorUtility = {

    errorIndicators: [],

    activeIndicator: -1,

    openingSubItem: false,
    subItemIndex: "0",

    saveRef: (activeErrors, indicatorErrors, node, subItem, subItemIndex, openSubItem) => {
      if(node){
        this.errorUtility.errorIndicators.push({
          activeErrors,
          indicatorErrors,
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
      const trackedIndicatorErrors = activeIndicatorObj ? activeIndicatorObj.indicatorErrors : []
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


  handler = (e) => {
    const name = e.target.name

    if (name === 'issueUrl') {
      (e.target.value.trim().length > 0) ? this.setState({showIssueDoiReq:true}) : this.setState({showIssueDoiReq:false})
    }

    this.setState({
      issue: update(this.state.issue, {[name]: {$set: e.target.value ? e.target.value : '' }})
    })
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


  calendarHandler = (name, dateObj) => {
    if(dateObj) {
      const stateName = this.state.activeCalendar.split('-')[0]
      const datePayload = {
        [`${stateName}Year`]: dateObj.year,
        [`${stateName}Month`]: dateObj.month,
        [`${stateName}Day`]: dateObj.day
      }

      this.setState({
        activeCalendar: name,
        issue: {
          ...this.state.issue,
          ...datePayload
        }
      }, () => this.validate())

    } else {
      this.setState({
        activeCalendar: name
      })
    }
  }


  render () {
    this.errorUtility.errorIndicators = []  //Saving refs of any errorIndicators rendered so need to clear it before each render
    this.errorUtility.openingSubItem = false
    return (
      <AddIssueCard
        save={this.save}
        handler={this.handler}
        addSubItem={this.addSubItem}
        removeSubItem={this.removeSubItem}
        closeModal={this.props.close}
        helperSwitch={this.helperSwitch}
        errorUtility={this.errorUtility}
        validate={this.validate}
        boundSetState={this.boundSetState}
        tooltipUtility={this.tooltipUtility}
        calendarHandler={this.calendarHandler}
        {...this.state}
      />
    )

  }
}


export default connect(mapStateToProps, mapDispatchToProps)(AddIssueModal)

