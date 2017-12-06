import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'

import defaultState from '../components/AddArticlePage/defaultState'
import { controlModal, getPublications, editForm, deleteCard, clearForm, cartUpdate } from '../actions/application'
import {DeferredTask} from '../utilities/helpers'
import {cardNamesArray} from '../utilities/crossmarkHelpers'
import AddArticleView from '../components/AddArticlePage/addArticleView'
import {routes} from '../routing'
import {asyncValidateArticle} from '../utilities/validation'
import {getSubItems} from '../utilities/getSubItems'
import ReviewArticle from '../components/AddArticlePage/reviewArticleModal'
import { XMLSerializer, DOMParser } from 'xmldom'
import componentDidMount from '../components/AddArticlePage/methods/componentDidMount'
import save from '../components/AddArticlePage/methods/save'





const mapStateToProps = (state, props) => {
  return ({
    publication: state.publications[props.routeParams.pubDoi],
    reduxForm: state.reduxForm,
    crossmarkPrefixes: state.login['crossmark-prefixes'],
    reduxCart: state.cart
  })
}

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxControlModal: controlModal,
  reduxEditForm: editForm,
  reduxDeleteCard: deleteCard,
  reduxClearForm: clearForm,
  asyncGetPublications: getPublications,
  reduxCartUpdate: cartUpdate
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class AddArticlePage extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    reduxEditForm: is.func.isRequired,
    reduxClearForm: is.func.isRequired,
    reduxDeleteCard: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    asyncGetPublications: is.func.isRequired,

    routeParams: is.shape({
      pubDoi: is.string.isRequired,
      articleDoi: is.string
    }).isRequired,

    location: is.shape({
      state: is.shape({
        duplicateFrom: is.string
      })
    }).isRequired,

    reduxForm: is.object.isRequired,
    publication: is.object,
    crossmarkPrefixes: is.array.isRequired,
    reduxCart: is.array.isRequired
  }

  constructor (props) {
    super(props)
    const {duplicateFrom, dupIssueDoi, dupIssueTitle} = props.location.state || {}
    const ownerPrefix = props.routeParams.pubDoi.split('/')[0];
    const editArticleDoi = props.routeParams.articleDoi || (props.location.state && props.location.state.duplicateFrom)
    const isDuplicate = !!duplicateFrom
    const issueId = props.routeParams.issueId || dupIssueDoi || dupIssueTitle
    const issueDoi = issueId && (issueId.split('/')[0] === ownerPrefix) ? issueId : undefined
    const issueTitle = issueId && !issueDoi ? JSON.parse(issueId) : undefined
    this.state = {
      ...defaultState,
      publication: props.publication,
      publicationMetaData: {},
      publicationXml: '',
      issue: undefined,
      editArticleDoi,
      issueDoi,
      issueTitle,
      mode: editArticleDoi ? 'edit' : 'add',
      isDuplicate,
      ownerPrefix,
      crossmark: props.crossmarkPrefixes.indexOf(ownerPrefix) !== -1,
      crossmarkCards: {},
      version: '1',
      deferredTooltipBubbleRefresh: new DeferredTask(),
      errorMessages: [],
      deferredStickyErrorRefresh: new DeferredTask()
    }
    this.state.article.doi = ownerPrefix + '/'
  }


  componentDidMount = componentDidMount.bind(this)

  save = save.bind(this)


  componentWillReceiveProps (nextProps) {
    if (this.props.crossmarkPrefixes !== nextProps.crossmarkPrefixes) {
      this.setState({
        crossmark: nextProps.crossmarkPrefixes.indexOf(this.state.ownerPrefix) !== -1
      })
    }
  }


  validation = async (data = this.state, reduxForm = this.props.reduxForm, doiDisabled = this.state.doiDisabled) => {
    const { criticalErrors, warnings, licenses, contributors, relatedItems, newReduxForm } = await asyncValidateArticle(data, reduxForm, this.state.ownerPrefix, doiDisabled)

    const validatedPayload = {
      validating: true,
      mode: 'edit',
      error: false,
      errors: {...criticalErrors, ...warnings},
      criticalErrors: criticalErrors,
      license: licenses.length ? licenses : defaultState.license,
      contributors: contributors.length ? contributors : defaultState.contributors,
      relatedItems: relatedItems.length ? relatedItems : defaultState.relatedItems,
      openItems: {
        Contributors: !!contributors.length,
        Funding: !!getSubItems(data.funding).length,
        Licenses: !!licenses.length,
        relatedItems: !!relatedItems.length,
        addInfo: !!getSubItems(data.addInfo).length
      }
    }
    let valid = true

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

    validatedPayload.errorMessages = this.errorUtility.onValidate(validatedPayload.errors, validatedPayload.contributors, validatedPayload.license, validatedPayload.relatedItems, newReduxForm)

    if(newReduxForm && newReduxForm.size) {
      const keyPath = []
      this.props.reduxEditForm(keyPath, newReduxForm)
    }

    return {valid, validatedPayload}
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

    onValidate: (newValidationErrors, contributors, license, relatedItems, newReduxForm) => {
      const {errorIndicators, activeIndicator} = this.errorUtility
      const activeIndicatorObj = errorIndicators[activeIndicator]
      const trackedIndicatorErrors = activeIndicatorObj ? activeIndicatorObj.trackErrors : []
      let newErrorMessages
      const {subItem, subItemIndex} = activeIndicatorObj || {}

      if(subItem) {
        const subItemErrors = {
          contributor: contributors,
          license: license,
          relatedItems: relatedItems,
        }

        let allErrors
        if(cardNamesArray.indexOf(subItem) > -1) {
          //Is crossmark subItem
          allErrors = newReduxForm.getIn([subItem, subItemIndex, 'errors'])

        } else {
          allErrors = subItemErrors[subItem][subItemIndex].errors
        }

        newErrorMessages = trackedIndicatorErrors.filter((error) => {
          return allErrors[error]
        })

      } else {
        newErrorMessages = trackedIndicatorErrors.filter((error)=>{
          return newValidationErrors[error]
        })
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


  addToCart = () => {
    const addToCart = true
    this.save(addToCart)
  }


  componentDidUpdate() {
    this.state.deferredStickyErrorRefresh.resolve()

    if(this.state.validating) {
      this.state.deferredTooltipBubbleRefresh.resolve()
    }

    //Select first error if first validation
    if(
      this.state.validating &&
      this.state.error &&
      (this.errorUtility.activeIndicator === -1 || this.errorUtility.errorIndicators.length === 1)
    ) {
      try {
        this.errorUtility.setErrorMessages(this.errorUtility.errorIndicators[0].activeErrors)
      } catch (e) {}
    }

    this.state.validating = false
    this.state.saving = false
    this.state.openSubItems = false
  }


  openReviewArticleModal = () => {
    this.props.reduxControlModal({
      showModal: true,
      title:
        <div className='innerTitleHolder'>
          <div className='innterTitleHolderIcon'>
            <img src={`${routes.images}/ReviewArticle/Asset_Icons_White_Review.svg`} />
          </div>
          <div className='innerTitleHolderText'>
            {this.state.article.title}
          </div>
        </div>,
      style: 'defaultModal reviewModal',
      Component: ReviewArticle,
      props: {
        submit: this.addToCart,
        reviewData: this.state,
        publication: this.state.publication,
        publicationMetaData: this.state.publicationMetaData,
        issue: this.state.issue
      }
    })
  }


  handleChange = async (e) => {
    this.setState({
      article: {
        ...this.state.article,
        [e.target.name]: e.target.value
      }
    })
  }


  boundSetState = (...args) => { this.setState(...args) }


  toggleFields = () => {
    this.setState({
      showOptionalTitleData: !this.state.showOptionalTitleData
    })
  }


  addSection = (section) => {
    this.setState({
      [section]: [...this.state[section], defaultState[section][0]]
    })
  }


  removeSection = (section, index) => {
    this.setState({
      [section]: do {
        const newArray = [...this.state[section]]
        newArray.splice(index, 1)
        newArray
      }
    })
  }


  back = () => {
    browserHistory.push(`${routes.publications}/${encodeURIComponent(this.state.publication.message.doi)}`)
  }


  crossmarkUtility = {

    addCrossmarkCard: (selection) => {
      this.setState({
        crossmarkCards: {
          ...this.state.crossmarkCards,
          [selection]: this.state.crossmarkCards[selection] ? this.state.crossmarkCards[selection] + 1 : 1
        }
      })
    },

    removeCrossmarkCard: (selection) => {
      const newState = {...this.state.crossmarkCards}
      delete newState[selection]
      this.props.reduxDeleteCard([selection])
      this.setState({
        crossmarkCards: newState
      })
    }
  }


  componentWillUnmount () {
    this.props.reduxClearForm();
  }


  render () {
    this.errorUtility.errorIndicators = []  //Saving refs of any errorIndicators rendered so need to clear it before each render
    this.errorUtility.openingSubItem = false
    return (
      <div className='addArticles'>

        <AddArticleView
          back={this.back}
          addToCart={this.addToCart}
          validate={this.validate}
          save={this.save}
          openReviewArticleModal={this.openReviewArticleModal}
          handleChange={this.handleChange}
          toggleFields={this.toggleFields}
          boundSetState={this.boundSetState}
          removeSection={this.removeSection}
          addSection={this.addSection}
          reduxDeleteCard={this.props.reduxDeleteCard}
          reduxForm={this.props.reduxForm}
          errorUtility={this.errorUtility}
          crossmarkUtility={this.crossmarkUtility}
          {...this.state}
        />
      </div>
    )
  }
}

