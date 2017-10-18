import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import _ from 'lodash'

import defaultState from '../components/AddArticlePage/defaultState'
import { controlModal, getPublications, editForm, deleteCard, clearForm, cartUpdate } from '../actions/application'
import {xmldoc, jsEscape, refreshErrorBubble, compareDois} from '../utilities/helpers'
import AddArticleView from '../components/AddArticlePage/addArticleView'
import {routes} from '../routing'
import {asyncValidateArticle} from '../utilities/validation'
import {getSubItems} from '../utilities/getSubItems'
import * as api from '../actions/api'
import parseXMLArticle from '../utilities/parseXMLArticle'
import journalArticleXml from '../components/AddArticlePage/articleXmlGenerator'
import ReviewArticle from '../components/AddArticlePage/reviewArticleModal'



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
    const ownerPrefix = props.routeParams.pubDoi.split('/')[0];
    const editArticleDoi = props.routeParams.articleDoi || (props.location.state && props.location.state.duplicateFrom)
    const isDuplicate = this.props.location.state ? !!this.props.location.state.duplicateFrom : false
    const issueId = props.routeParams.issueId
    const issueDoi = issueId && (issueId.split('/')[0] === ownerPrefix) ? issueId : undefined
    const issueTitle = issueId && !issueDoi ? JSON.parse(issueId) : undefined
    this.state = {
      ...defaultState,
      publication: props.publication,
      publicationMetaData: {},
      publicationXml: '',
      issuePublication: undefined,
      editArticleDoi,
      issueDoi,
      issueTitle,
      mode: editArticleDoi ? 'edit' : 'add',
      isDuplicate,
      ownerPrefix,
      crossmark: props.crossmarkPrefixes.indexOf(ownerPrefix) !== -1,
      version: '1'
    }
    this.state.article.doi = ownerPrefix + '/'
  }


  async componentDidMount () {

    const { pubDoi } = this.props.routeParams;
    const getItems = []

    if(this.state.editArticleDoi) {
      getItems.push(api.getItem(this.state.editArticleDoi))
    }
    const checkForAcceptedPub = this.state.mode === 'edit'
    getItems.push(api.getItem(pubDoi, checkForAcceptedPub).catch(e => api.getItem(pubDoi)))

    const publications = await Promise.all(getItems)

    const publicationData = publications[1] || publications[0]
    const articleFullHierarchy = publications[0]

    let publMeta = publicationData.message.content
    const publicationMetaData = publMeta ? xmldoc(publMeta) : {}
    const publicationXml = publMeta.substring(publMeta.indexOf('<journal_metadata>'), publMeta.indexOf('</Journal>'))

    if(this.state.editArticleDoi) {
      delete articleFullHierarchy.message.content
      articleFullHierarchy.message.date = publicationData.message.date
      articleFullHierarchy.message.doi = articleFullHierarchy.message.doi || pubDoi
      articleFullHierarchy.message['owner-prefix'] = articleFullHierarchy.message['owner-prefix'] || this.state.ownerPrefix
      articleFullHierarchy.message['mdt-version'] = articleFullHierarchy.message['mdt-version'] || '0'
    }

    let publication = articleFullHierarchy

    if (this.state.issueDoi || this.state.issueTitle) {
      if(!this.state.editArticleDoi) { //New article means publicationData includes all records and need to locate the correct issue
        articleFullHierarchy.message.contains[0] = articleFullHierarchy.message.contains.find((item)=>{
          if(item.type !== 'issue') {
            return false
          }
          return compareDois(this.state.issueDoi, item.doi) || JSON.stringify(this.state.issueTitle) === JSON.stringify(item.title)
        })
      }

      let articleUnderPub = {
        ...articleFullHierarchy,
        message: {
          ...articleFullHierarchy.message,
          contains: [articleFullHierarchy.message.contains[0].contains[0]]
        }
      }
      const issue = articleFullHierarchy.message.contains[0]
      delete issue.content
      issue['mdt-version'] = issue['mdt-version'] || '1'
      issue['owner-prefix'] = issue['owner-prefix'] || this.state.ownerPrefix
      issue.date = issue.date || new Date()

      publication = articleUnderPub
    }

    if(this.state.mode === 'edit') {

      let setStatePayload = {}

      if(this.state.issueDoi || this.state.issueTitle) {
        setStatePayload.issueTitle = articleFullHierarchy.message.contains[0].title
      }

      const parsedArticle = parseXMLArticle(publication.message.contains[0].content)
      let reduxForm
      if(parsedArticle.crossmark) {
        reduxForm = parsedArticle.crossmark.reduxForm
        setStatePayload.showCards = parsedArticle.crossmark.showCards
      }

      const isDuplicate = this.props.location.state ? !!this.props.location.state.duplicateFrom : false
      let doiDisabled = !isDuplicate
      if(isDuplicate) {
        parsedArticle.article.doi = this.state.ownerPrefix
      }

      const {validatedPayload} = await this.validation(parsedArticle, reduxForm, doiDisabled)

      setStatePayload = {
        ...setStatePayload,
        publication,
        issuePublication: this.state.issueDoi || this.state.issueTitle ? articleFullHierarchy : undefined,
        publicationMetaData,
        publicationXml,
        doiDisabled,
        version: String( Number(publication.message.contains[0]['mdt-version'] || 0) + 1),
        addInfo: parsedArticle.addInfo,
        article: parsedArticle.article,
        contributors: parsedArticle.contributors,
        funding: parsedArticle.funding,
        license: parsedArticle.license,
        relatedItems: parsedArticle.relatedItems,
        openItems: parsedArticle.openItems,
        ...validatedPayload
      }

      this.setState(setStatePayload, () => this.state.validating = false)
    } else /*if add mode*/ {
      this.setState({
        publication,
        issuePublication: publications[0],
        publicationMetaData,
        publicationXml
      })
    }
  }


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

    if(newReduxForm && newReduxForm.size) {
      const keyPath = []
      this.props.reduxEditForm(keyPath, newReduxForm)
    }

    return {valid, validatedPayload}
  }


  save = async (addToCart) => {

    const {valid, validatedPayload} = await this.validation()

    validatedPayload.saving = true

    if (valid) {
      const publication = this.state.publication

      const journalArticle = journalArticleXml(this.state, this.props.reduxForm)
      const journal = `<?xml version="1.0" encoding="UTF-8"?><crossref xmlns="http://www.crossref.org/xschema/1.1"><journal>${this.state.publicationXml}${journalArticle}</journal></crossref>`

      const title = jsEscape(this.state.article.title)

      const newRecord = {
        'title': {'title': title},
        'date': new Date(),
        'doi': this.state.article.doi,
        'owner-prefix': this.state.ownerPrefix,
        'type': 'article',
        'mdt-version': this.state.version,
        'status': 'draft',
        'content': journal.replace(/(\r\n|\n|\r)/gm,'')
      }

      // check if its part of a issue, the issue props will tell us
      let savePub

      if (this.state.issueDoi || this.state.issueTitle) {
        const issuePublication = this.state.issuePublication
        const theIssue = issuePublication.message.contains[0]

        theIssue.contains = [newRecord]
        issuePublication.message.contains = [theIssue]

        savePub = issuePublication
      } else { // not issue, so just put directly under the publication
        publication.message.contains = [newRecord]
        savePub = publication
      }

      try {
        await api.submitItem(savePub)
      } catch (e) {
        console.error('Error in save article: ', e)
      }



      const inCart = this.state.mode === 'edit' ? !!this.props.reduxCart.find( cartItem => compareDois(cartItem.doi, newRecord.doi)) : false

      if(addToCart || inCart) {
        newRecord.doi = newRecord.doi.toLowerCase()
        newRecord.pubDoi = publication.message.doi
        if(this.state.issueDoi || this.state.issueTitle) {
          newRecord.issueDoi = this.state.issueDoi
          newRecord.issueTitle = this.state.issueTitle
        }
        this.props.reduxCartUpdate(newRecord, inCart, addToCart)

      }
      if (addToCart) {
        browserHistory.push(`${routes.publications}/${encodeURIComponent(publication.message.doi)}`)
      } else {

        validatedPayload.doiDisabled = true
        validatedPayload.version = (Number(this.state.version) + 1).toString()
        validatedPayload.inCart = inCart

        this.setState(validatedPayload, () => {
          this.state.validating = false
          this.state.saving = false
        })
      }

    } else /*if not valid */{
      this.setState(validatedPayload, () => {
        this.state.validating = false
        this.state.saving = false
      })
      return false
    }
  }


  addToCart = () => {
    const addToCart = true
    this.save(addToCart)
  }


  handleChange = (e) => {
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
        issue: this.state.issuePublication ? this.state.issuePublication.message.contains[0] : undefined,
      }
    })
  }


  componentDidUpdate() {
    refreshErrorBubble()
  }


  back = () => {
    browserHistory.push(`${routes.publications}/${encodeURIComponent(this.state.publication.message.doi)}`)
  }


  componentWillUnmount () {
    this.props.reduxClearForm();
  }


  render () {
    return (
      <div className='addArticles'>

        <AddArticleView
          back={this.back}
          addToCart={this.addToCart}
          save={this.save}
          openReviewArticleModal={this.openReviewArticleModal}
          handleChange={this.handleChange}
          toggleFields={this.toggleFields}
          boundSetState={this.boundSetState}
          removeSection={this.removeSection}
          addSection={this.addSection}
          reduxDeleteCard={this.props.reduxDeleteCard}
          {...this.state}
        />
      </div>
    )
  }
}

