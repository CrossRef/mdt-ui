import React, { Component } from 'react'
import is from 'prop-types'
import { browserHistory } from 'react-router'
import update from 'immutability-helper'
import _ from 'lodash'
import {stateTrackerII} from 'my_decorators'

import ReviewArticle from './reviewArticle'
import SubItem from './SubItems/subItem'
import { ActionBar, TopBar, InfoBubble, InfoHelperRow, ErrorBubble, ArticleTitleField, OptionalTitleData, ArticleDOIField, ArticleUrlField, DatesRow, BottomFields } from './addArticleCardComponents'
import { journalArticleXml, crossmarkXml } from '../utilities/xmlGenerator'
import JSesc from '../utilities/jsesc'
import parseXMLArticle from '../utilities/parseXMLArticle'
import { makeDateDropDown } from '../utilities/date'
import {routes} from '../routing'
import refreshErrorBubble from '../utilities/refreshErrorBubble'
import {asyncValidateArticle} from '../utilities/validation'


const defaultState = {
  validating: false,
  crossmark: false,
  showCards: {},
  showOptionalTitleData: false,
  showContributor: false,
  showFunding: false,
  showRelatedItems: false,
  showAdditionalInformation: false,
  showHelper: false,
  on: false,
  error: false,
  doiDisabled: false,
  version: '1',
  errors: {
    title: false,

    doi: false,
    invaliddoi: false,
    invalidDoiPrefix: false,
    dupedoi: false,

    url: false,
    invalidurl: false,

    printDateYear: false,
    printDateIncomplete: false,
    printDateInvalid: false,
    onlineDateYear: false,
    onlineDateIncomplete: false,
    onlineDateInvalid: false,

    firstPage: false,

    contributorLastName: false,
    contributorRole: false,
    contributorGroupName: false,
    contributorGroupRole: false,

    licenseUrl: false,
    licenseUrlInvalid: false,
    licenseDateInvalid: false,
    licenseDateIncomplete: false,

    relatedItemIdType: false,
    relatedItemRelType: false,
    relatedItemDoiInvalid: false,

    simCheckUrlInvalid: false
  },
  article: {
    title: '',
    doi: '',
    subtitle: '',
    originallanguagetitle: '',
    originallanguagetitlesubtitle: '',
    url: 'http://',
    printDateYear: '',
    printDateMonth: '',
    printDateDay: '',
    onlineDateYear: '',
    onlineDateMonth: '',
    onlineDateDay: '',
    firstPage: '',
    lastPage: '',
    locationId: '',
    abstract: ''
  },
  contributors: [
    {
      firstName: '',
      lastName: '',
      suffix: '',
      affiliation: '',
      orcid: '',
      role: '',
      groupAuthorName: '',
      groupAuthorRole: '',
      errors: {
        contributorLastName: false,
        contributorRole: false,
        contributorGroupName: false,
        contributorGroupRole: false
      }
    }
  ],
  funding: [
    {
      fundername: '',
      funderRegistryID: '',
      funder_identifier: '',
      grantNumbers: ['']
    }
  ],
  license: [
    {
      acceptedDateDay:'',
      acceptedDateMonth:'',
      acceptedDateYear:'',
      appliesto:'',
      licenseurl:'http://',
      errors: {
        licenseUrl: false,
        licenseUrlInvalid: false,
        licenseDateInvalid: false,
        licenseDateIncomplete: false
      }
    }
  ],
  relatedItems: [
    {
      relatedItemIdentifier: '',
      identifierType: '',
      description: '',
      relationType: '',
      errors: {
        relatedItemIdType: false,
        relatedItemRelType: false,
        relatedItemDoiInvalid: false
      }
    }
  ],
  addInfo: {
    archiveLocation:'',
    language:'',
    publicationType:'',
    similarityCheckURL:'http://',
    freetolicense: false
  },
  openItems: {
    Contributors:false,
    Funding:false,
    Licenses:false,
    relatedItems:false,
    addInfo:false
  }
}


export default class AddArticleCard extends Component {

  static propTypes = {
    mode: is.string.isRequired,
    isDuplicate: is.bool.isRequired,
    issue: is.string,
    ownerPrefix: is.string.isRequired,

    crossmarkPrefixes: is.array.isRequired,
    reduxForm: is.object.isRequired,
    reduxCart: is.array.isRequired,
    publication: is.shape({
      message: is.object
    }).isRequired,
    publicationMetaData: is.shape({
      Journal: is.object
    }),

    reduxCartUpdate: is.func.isRequired,
    reduxControlModal: is.func.isRequired,
    reduxEditForm: is.func.isRequired,
    reduxDeleteCard: is.func.isRequired,

    asyncSubmitArticle: is.func.isRequired,
    asyncGetItem: is.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = defaultState
    this.state.article.doi = props.ownerPrefix
  }

  async componentWillReceiveProps (nextProps) {
    if(nextProps.reduxForm !== this.props.reduxForm) {
      return
    }

    let setStatePayload = {}

    if(nextProps.crossmarkPrefixes.length && !this.state.crossmark) {
      if (nextProps.publication) {
        const thisPrefix = nextProps.publication.message ? nextProps.publication.message.doi.split('/')[0] : null
        if(thisPrefix && nextProps.crossmarkPrefixes.indexOf(thisPrefix) !== -1) {
          setStatePayload.crossmark = true
        }
      }
    }

    const { publication } = nextProps
    if (nextProps.mode === 'edit' && publication.message && publication.message.contains.length) {

      const parsedArticle = parseXMLArticle(publication.message.contains[0].content)

      let reduxForm
      if(parsedArticle.crossmark) {
        reduxForm = parsedArticle.crossmark.reduxForm
        setStatePayload.showCards = parsedArticle.crossmark.showCards
      }

      let doiDisabled = true
      if(this.props.isDuplicate) {
        parsedArticle.article.doi = this.props.ownerPrefix
        doiDisabled = false
      }

      const {validatedPayload} = await this.validation(parsedArticle, reduxForm, doiDisabled)

      setStatePayload = {...setStatePayload, ...{
        doiDisabled: doiDisabled,
        version: String(parseInt(publication.message.contains[0]['mdt-version']) + 1),
        addInfo: parsedArticle.addInfo,
        article: parsedArticle.article,
        contributors: parsedArticle.contributors,
        funding: parsedArticle.funding,
        license: parsedArticle.license,
        relatedItems: parsedArticle.relatedItems,
        openItems: parsedArticle.openItems
      }, ...validatedPayload}

      this.setState(setStatePayload, () => this.state.validating = false)
    } else {
      this.setState(setStatePayload)
    }
  }


  async validation (data = this.state, reduxForm = this.props.reduxForm, doiDisabled = this.state.doiDisabled) {

    const { criticalErrors, warnings, licenses, contributors, relatedItems, newReduxForm } = await asyncValidateArticle(data, reduxForm, this.props.ownerPrefix, doiDisabled)

    const validatedPayload = {
      validating: true,
      error: false,
      errors: {...criticalErrors, ...warnings},
      license: licenses.length ? licenses : this.state.license,
      contributors: contributors.length ? contributors : this.state.contributors,
      relatedItems: relatedItems.length ? relatedItems : this.state.relatedItems
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

    if(newReduxForm && newReduxForm.size) this.props.reduxEditForm([], newReduxForm)

    return {valid, validatedPayload}
  }


  save = async (addToCart) => {
    const crossmark = this.state.crossmark ? crossmarkXml(this.props.reduxForm, this.props.ownerPrefix) : undefined

    const {valid, validatedPayload} = await this.validation()

    if (valid) {
      const publication = this.props.publication

      const journalArticle = journalArticleXml(this, crossmark)
      const journal = `<?xml version="1.0" encoding="UTF-8"?><crossref xmlns="http://www.crossref.org/xschema/1.1"><journal>${journalArticle}</journal></crossref>`

      const title = JSesc(this.state.article.title)

      const newRecord = {
        'title': {'title': title},
        'date': new Date(),
        'doi': this.state.article.doi,
        'owner-prefix': this.state.article.doi.split('/')[0],
        'type': 'article',
        'mdt-version': this.state.version,
        'status': 'draft',
        'content': journal.replace(/(\r\n|\n|\r)/gm,'')
      }

      // check if its part of a issue, the issue props will tell us
      let savePub

      if (this.props.issue) { //this is just an issue doi OR undefined
        // if its an issue, we need to put this newRecord under the issue, NOT the publicaton
        // need to use the issuePublication, the publication has been mutated to allow reading of the article
        const issuePublication = this.props.issuePublication
        const theIssue = _.find(issuePublication.message.contains, (item) => {
          if ((item.type === 'issue') && (item.doi === this.props.issue)) {
            return item
          }
        })

        theIssue.contains = [newRecord]
        issuePublication.message.contains = [theIssue]

        savePub = issuePublication
      } else { // not issue, so just put directly under the publication
        publication.message.contains = [newRecord]
        savePub = publication
      }

      await this.props.asyncSubmitArticle(savePub, this.state.article.doi)

      if(addToCart) {
        newRecord.pubDoi = this.props.publication.message.doi
        return newRecord
      } else {
        this.setState(validatedPayload, () => this.state.validating = false)
      }

    } else {
      this.setState(validatedPayload, () => this.state.validating = false)
      return false
    }
  }

  addToCart = async () => {
    const addToCart = true
    const newRecord = await this.save(addToCart)
    if(newRecord) {
      newRecord.doi = newRecord.doi.toLowerCase()
      this.props.reduxCartUpdate([newRecord])
      browserHistory.push(`${routes.publications}/${encodeURIComponent(this.props.publication.message.doi)}`)
    }
  }

  componentDidUpdate() {
    refreshErrorBubble()
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

  addSection (section) {
    this.setState({
      [section]: update(this.state[section], {$push: defaultState[section]})
    })
  }

  removeSection (section, index) {
    this.setState({
      [section]: update(this.state[section], {$splice: [[index, 1]]})
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
            publication: this.props.publication,
            publicationMetaData: this.props.publicationMetaData,
            issue: this.props.issuePublication ? this.props.issuePublication.message.contains[0] : undefined,
            asyncGetItem: this.props.asyncGetItem
        }
    })
  }

  back = () => {
    var publication = this.props.publication
    browserHistory.push(`${routes.publications}/${encodeURIComponent(publication.message.doi)}`)
  }



  render () {
    const error = (this.props.addArticle || {}).error
    return (
      <div>

        <div className={'addarticlecard' + (error ? ' invalid' : '')}>

          <form className='addArticleForm'>

            <ActionBar back={this.back} addToCart={this.addToCart} save={this.save} openReviewArticleModal={this.openReviewArticleModal}/>

            <div className='articleInnerForm'>

              <TopBar title={this.state.article.title} />

              <div className='body'>

                <InfoHelperRow setState={this.boundSetState} on={this.state.on}/>

                <div className='row'>
                  <ArticleTitleField handleChange={this.handleChange} title={this.state.article.title} errors={this.state.errors}/>
                  {(!this.state.error && this.state.showHelper) && <InfoBubble/> }
                  {(this.state.error) && <ErrorBubble errors={this.state.errors} crossmarkErrors={this.state.crossmarkErrors}/> }
                </div>

                <div className='row'>
                  <OptionalTitleData
                    show={this.state.showOptionalTitleData}
                    toggleFields={this.toggleFields}
                    subtitle={this.state.article.subtitle}
                    originallanguagetitle={this.state.article.originallanguagetitle}
                    originallanguagetitlesubtitle={this.state.article.originallanguagetitlesubtitle}
                    handleChange={this.handleChange}/>
                </div>

                <div className='row'>
                  <div className="fieldHolder">
                    <ArticleDOIField disabled={this.state.doiDisabled} doi={this.state.article.doi} handleChange={this.handleChange} errors={this.state.errors}/>
                    <ArticleUrlField url={this.state.article.url} handleChange={this.handleChange} errors={this.state.errors} />
                  </div>
                </div>

                <DatesRow
                  article={this.state.article}
                  errors={this.state.errors}
                  makeDateDropDown={makeDateDropDown}
                  handleChange={this.handleChange}
                />

                <BottomFields
                  article={this.state.article}
                  errors={this.state.errors}
                  makeDateDropDown={makeDateDropDown}
                  handleChange={this.handleChange}
                />

              </div>

              <SubItem
                title={'Contributor'}
                validating={this.state.validating}
                addable={true}
                incomingData={this.state.contributors}
                handler={this.boundSetState}
                remove={this.removeSection.bind(this, 'contributors')}
                showSection={this.state.openItems.Contributors}
                addHandler={this.addSection.bind(this, 'contributors')}
              />
              <SubItem
                title={'Funding'}
                validating={this.state.validating}
                addable={true}
                incomingData={this.state.funding}
                handler={this.boundSetState}
                remove={this.removeSection.bind(this, 'funding')}
                showSection={this.state.openItems.Funding}
                addHandler={this.addSection.bind(this, 'funding')}
              />
              <SubItem
                title={'License'}
                validating={this.state.validating}
                addable={true}
                incomingData={this.state.license}
                handler={this.boundSetState}
                remove={this.removeSection.bind(this, 'license')}
                showSection={this.state.openItems.Licenses}
                addHandler={this.addSection.bind(this, 'license')}
                freetoread={this.state.addInfo.freetolicense}
                makeDateDropDown={makeDateDropDown}
              />
              <SubItem
                title={'Related Items'}
                validating={this.state.validating}
                addable={true}
                incomingData={this.state.relatedItems}
                handler={this.boundSetState}
                remove={this.removeSection.bind(this, 'relatedItems')}
                showSection={this.state.openItems.relatedItems}
                addHandler={this.addSection.bind(this, 'relatedItems')}
              />
              <SubItem
                title={'Additional Information'}
                validating={this.state.validating}
                addable={false}
                incomingData={this.state.addInfo}
                handler={this.boundSetState}
                showSection={this.state.openItems.addInfo}
                freetoread={this.state.addInfo.freetolicense}
                simCheckError={this.state.errors.simCheckUrlInvalid}
              />
              {this.state.crossmark &&
                <SubItem
                  title={'Crossmark'}
                  showCards={this.state.showCards}
                  crossmarkErrors={this.state.crossmarkErrors}
                  reduxDeleteCard={this.props.reduxDeleteCard}
                />
              }

            </div>
          </form>
        </div>
      </div>
    )
  }
}
