import React, { Component } from 'react'
import is from 'prop-types'
import { browserHistory } from 'react-router'
import update from 'immutability-helper'
import _ from 'lodash'
import {stateTrackerII} from 'my_decorators'

import checkDupeDOI from '../utilities/dupeDOI'
import ReviewArticle from './reviewArticle'
import SubItem from './SubItems/subItem'
import { TopBar, InfoBubble, InfoHelperRow, ErrorBubble, ArticleTitleField, OptionalTitleData, ArticleDOIField, ArticleUrlField, DatesRow, BottomFields } from './addArticleCardComponents'
import { journalArticleXml, crossmarkXml } from '../utilities/xmlGenerator'
import JSesc from '../utilities/jsesc'
import $ from 'jquery'
import parseXMLArticle from '../utilities/parseXMLArticle'
import { makeDateDropDown } from '../utilities/date'
import isUrl from '../utilities/isURL'
import isDOI from '../utilities/isDOI'
import {routes} from '../routing'
import { getSubmitSubItems } from '../utilities/getSubItems'


const defaultState = {
  inCart: true,
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
    printDateYear: false,
    onlineDateYear: false,
    doi: false,
    url: false,
    dupedoi: false,
    invaliddoi: false,
    invalidDoiPrefix: false,
    invalidurl: false,
    licenseStartDate: false,
  },
  crossmarkErrors: {
    peer_0_href:false,
    copyright_0_href:false,
    supp_0_href:false,
    other_0_href:false,
    update_0_DOI_Invalid:false,
    update_0_DOI_Missing:false,
    update_0_year:false,
    clinical_0_registry:false,
    clinical_0_trialNumber:false
  },
  article: {
    title: '',
    doi: '',
    subtitle: '',
    originallanguagetitle: '',
    originallanguagetitlesubtitle: '',
    url: '',
    printDateYear: '',
    printDateMonth: '',
    printDateDay: '',
    onlineDateYear: '',
    onlineDateMonth: '',
    onlineDateDay: '',
    acceptedDateYear: '',
    acceptedDateMonth: '',
    acceptedDateDay: '',
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
      groupAuthorRole: ''
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
      licenseurl:''
    }
  ],
  relatedItems: [
    {
      relatedItemIdentifier: '',
      identifierType: '',
      description: '',
      relationType: ''
    }
  ],
  addInfo: {
    archiveLocation:'',
    language:'',
    publicationType:'',
    similarityCheckURL:'',
    freetolicense: ''
  },
  openItems: {
    apiReturned: false,
    Contributors:false,
    Funding:false,
    Licenses:false,
    relatedItems:false,
    addInfo:false
  }
}


export default class AddArticleCard extends Component {

  static propTypes = {
    reduxCart: is.array.isRequired,
    reduxCartUpdate: is.func.isRequired,
    reduxControlModal: is.func.isRequired,
    reduxEditForm: is.func.isRequired,
    asyncSubmitArticle: is.func.isRequired,
    asyncGetItem: is.func.isRequired,
    reduxForm: is.object.isRequired,
    mode: is.string.isRequired,
    duplicateFrom: is.string,
    publication: is.shape({
      message: is.object
    }).isRequired,
    publicationMetaData: is.shape({
      Journal: is.object
    }),
    ownerPrefix: is.string.isRequired,
    crossmarkPrefixes: is.array.isRequired,
    issue: is.string
  }

  constructor (props) {
    super(props)
    this.state = defaultState;
    this.state.article.doi = props.ownerPrefix
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.mode === 'add') { //its new allow add to cart button
      this.setState({
        inCart: false
      })
    }

    if(nextProps.reduxForm !== this.props.reduxForm) {
      return;
    }

    if(nextProps.crossmarkPrefixes.length && !this.state.crossmark) {
      if (nextProps.publication) {
        const thisPrefix = nextProps.publication.message ? nextProps.publication.message.doi.split('/')[0] : null;
        if(thisPrefix && nextProps.crossmarkPrefixes.includes(thisPrefix)) this.setState({crossmark: true})
      }
    }

    const { publication } = nextProps
    if ((publication.message) && (nextProps.mode === 'edit')) {
      if (publication.message.contains.length > 0) { // its an edit of article, else its new, also checks if its empty before doing any xml conversion

        const parsedArticle = parseXMLArticle(publication.message.contains[0].content);

        if(parsedArticle.crossmark) {
          this.props.reduxEditForm(parsedArticle.crossmark.reduxForm);
          this.setState({showCards: parsedArticle.crossmark.showCards});
        }

        this.setState({
          inCart: !!_.find(this.props.reduxCart, (cartItems) => { return cartItems.doi === parsedArticle.article.doi}),
          first: true,
          doiDisabled: true,
          version: String(parseInt(publication.message.contains[0]['mdt-version']) + 1),
          addInfo: parsedArticle.addInfo,
          article: parsedArticle.article,
          contributors: parsedArticle.contributors,
          funding: parsedArticle.funding,
          license: parsedArticle.license,
          relatedItems: parsedArticle.relatedItems,
          openItems: parsedArticle.openItems
        })
      }
    }
  }

  componentDidUpdate() {
    var firstError = $(".fieldError").first()
    if (firstError.length > 0) {
      $('.fullError').find('.tooltips').css({
        'top': ((firstError.offset().top + (firstError.position().top - (firstError.position().top * .9)) - ($('.switchLicense').first().position().top + 15) - ($('.switchLicense').first().offset().top + 15))) + 25
      })
    }
  }

  onSubmit = (e) => {
    e.preventDefault();

    const crossmark = this.state.crossmark ? crossmarkXml(this.props.reduxForm, this.props.ownerPrefix) : undefined;

    this.validation((valid) => { // need it to be a callback because setting state does not happen right away
      if (!valid) {
        const props = this.props
        var publication = this.props.publication

        const state = this.state

        const metaData = `` // TODO: Publication information

        const journalIssue = `` // TODO: Issue information

        const journalArticle = journalArticleXml(this, crossmark);
        const journal = `<?xml version="1.0" encoding="UTF-8"?><crossref xmlns="http://www.crossref.org/xschema/1.1"><journal>${journalArticle}</journal></crossref>`

        const title = JSesc(this.state.article.title)

        var version = this.state.version

        if (props.mode === 'edit') {
          version = String(parseInt(this.state.version) + 1)
        }

        var newRecord = {
          'title': {'title': title},
          'date': new Date(),
          'doi': this.state.article.doi,
          'owner-prefix': this.state.article.doi.split('/')[0],
          'type': 'article',
          'mdt-version': version,
          'status': 'draft',
          'content': journal.replace(/(\r\n|\n|\r)/gm,'')
        }

        // check if its part of a issue, the issue props will tell us
        var savePub

        if (this.props.issue) { //this is just an issue doi OR undefined
          // if its an issue, we need to put this newRecord under the issue, NOT the publicaton
          // need to use the issuePublication, the publication has been mutated to allow reading of the article
          var issuePublication = this.props.issuePublication
          var theIssue = _.find(issuePublication.message.contains, (item) => {
            if ((item.type === 'issue') && (item.doi === this.props.issue)) {
              return item;
            }
          })

          theIssue.contains = [newRecord];
          issuePublication.message.contains = [theIssue]

          savePub = issuePublication
        } else { // not issue, so just put directly under the publication
          publication.message.contains = [newRecord];
          savePub = publication
        }

        this.props.asyncSubmitArticle(savePub, this.state.article.doi, () => {

          newRecord.pubDoi = this.props.publication.message.doi;
          this.props.reduxCartUpdate([newRecord]);

          this.setState({version: version})
          browserHistory.push(`${routes.publications}/${encodeURIComponent(publication.message.doi)}`)
        });
      }
    })
  }

  validation (callback) {
    var errorStates = {
      title: false,
      printDateYear: false,
      onlineDateYear: false,
      doi: false,
      url: false,
      dupedoi: false,
      invaliddoi: false,
      invalidDoiPrefix: false,
      invalidurl: false,
      licenseStartDate: false,
    }
    this.setState({
      error: false,
      errors: errorStates
    })

    return checkDupeDOI(this.state.article.doi, (isDupe , isValid) => {
      var hasPrintYear = false, hasOnlineYear = false;
      if ((this.state.article.printDateYear.length > 0) || (this.state.article.onlineDateYear.length > 0)) {
        //hasDate = true
        if ((this.state.article.printDateYear.length > 0)) {
          hasPrintYear = true
        }
        if ((this.state.article.onlineDateYear.length > 0)) {
          hasOnlineYear = true
        }
      }

      errorStates = {
        title: (this.state.article.title.length === 0),
        doi: (this.state.article.doi.length === 0),
        printDateYear: (this.state.article.printDateYear.length === 0),
        onlineDateYear: (this.state.article.onlineDateYear.length === 0),
        url: (this.state.article.url.length === 0),
        invalidurl: !isUrl(this.state.article.url) && (this.state.article.url.length > 0),
        dupedoi: this.state.doiDisabled ? false : isDupe,
        invaliddoi: ((this.state.article.doi.length > 0) && (isValid ? isValid : !isDOI(this.state.article.doi))),
        licenseStartDate: false
      }

      errorStates.invalidDoiPrefix = errorStates.invaliddoi ? false : (this.state.article.doi.split('/')[0] !== this.props.ownerPrefix);

      if (hasPrintYear) { // has print year, don't care if there is a online year
        errorStates.onlineDateYear = false
      }
      if (hasOnlineYear) { // has online year, don't care if there is a print year
        errorStates.printDateYear = false
      }

      // if addInfo license to read to ON, license StartDates are required
      if (this.state.addInfo.freetolicense === 'yes'){
        var licenses = getSubmitSubItems(this.state.license).map((license, i) => {
          var dayHolder = []
          if ((license.acceptedDateYear ? license.acceptedDateYear : '').length > 0) {
            dayHolder.push(license.acceptedDateYear)
          }
          if ((license.acceptedDateMonth ? license.acceptedDateMonth : '').length > 0) {
            dayHolder.push(license.acceptedDateMonth)
          }
          if ((license.acceptedDateDay ? license.acceptedDateDay : '').length > 0) {
            dayHolder.push(license.acceptedDateDay)
          }

          return {
            index: i,
            startDate: (dayHolder.join('').length > 0 ? dayHolder.join('-') : undefined),
            url: license.url
          }
        })

        for(var i = 0; i < licenses.length; i++) { // looping through the license array after filtered to see if there is start date
          if (!licenses[i].startDate) {
            errorStates.licenseStartDate = {$set: true}
            break
          }
        }
      }

      const crossmarkErrors = {};
      if(this.state.crossmark) {
        const reduxForm = this.props.reduxForm;

        for (var formField in reduxForm) {
          const [ card, i, field ] = formField.split('_');
          const value = reduxForm[formField];

          if(field === 'href') {
            var re = /^(ftp|http|https):\/\/[^ "]+$/
            crossmarkErrors[formField] = !value ? false : !re.test(value)
          }

          if(card === 'update') {
            if(field === 'type' && value !== '') {
              crossmarkErrors[`update_${i}_DOI_Missing`] = !reduxForm[`update_${i}_DOI`] ? true : false;
              crossmarkErrors[`update_${i}_year`] = !reduxForm[`update_${i}_year`] ? true : false;
            }

            if(field === 'DOI') {
              var re = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i
              crossmarkErrors[`${formField}_Invalid`] = !re.test(reduxForm[formField])
            }
          }

          if(card === 'clinical' && value !== '') {
            crossmarkErrors[`clinical_${i}_registry`] = !reduxForm[`clinical_${i}_registry`] ? true : false;
            crossmarkErrors[`clinical_${i}_trialNumber`] = !reduxForm[`clinical_${i}_trialNumber`] ? true : false;
          }
        };
      }

      this.setState({
        errors: update(this.state.errors, errorStates),
        crossmarkErrors: crossmarkErrors
      }, ()=>{
        var errors = ['doi', 'title']

        for(var key in this.state.errors) { // checking all the properties of errors to see if there is a true
          if (this.state.errors[key]) {
            this.setState({error: true})
            return (errors.indexOf(key) > -1) ? callback(this.state.errors[key]) : callback(false)
          }
        }
        for(var key in this.state.crossmarkErrors) {
          if(this.state.crossmarkErrors[key]) {
            this.setState({error: true})
            return callback(this.state.crossmarkErrors[key])
          }
        }
        return callback(false) // iterated the entire object, no true, returning a false, no error
      })
    })
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
            submit: this.onSubmit,
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
    const { publication, publicationMetaData } = this.props
    return (
      <div>

        <div className={'addarticlecard' + (error ? ' invalid' : '')}>

          <form className='addArticleForm' onSubmit={this.onSubmit}>

          <div className="reviewArticleButtonDiv">
            <button type='button' onClick={this.back} className="addPublication pull-left backbutton"><img className='backbuttonarrow' src={`${routes.images}/AddArticle/DarkTriangle.svg`} /><span>Back</span></button>
            <button type='button' onClick={this.openReviewArticleModal} className="addPublication reviewbutton">Review</button>
            <button type='submit' className={'addPublication saveButton'}>Add To Cart</button>
          </div>


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
                  makeDateDropDown={makeDateDropDown}
                  handleChange={this.handleChange}
                />

              </div>

              <SubItem
                title={'Contributor'}
                addable={true}
                incomingData={this.state.contributors}
                handler={this.boundSetState}
                remove={this.removeSection.bind(this, 'contributors')}
                showSection={this.state.openItems.Contributors}
                addHandler={this.addSection.bind(this, 'contributors')}
                apiReturned={this.state.openItems.apiReturned}
              />
              <SubItem
                title={'Funding'}
                addable={true}
                incomingData={this.state.funding}
                handler={this.boundSetState}
                remove={this.removeSection.bind(this, 'funding')}
                showSection={this.state.openItems.Funding}
                apiReturned={this.state.openItems.apiReturned}
                addHandler={this.addSection.bind(this, 'funding')}
              />
              <SubItem
                title={'License'}
                addable={true}
                incomingData={this.state.license}
                handler={this.boundSetState}
                remove={this.removeSection.bind(this, 'license')}
                showSection={this.state.openItems.Licenses}
                apiReturned={this.state.openItems.apiReturned}
                addHandler={this.addSection.bind(this, 'license')}
                freetoread={this.state.addInfo.freetolicense}
                errorLicenseStartDate={this.state.errors.licenseStartDate}
                makeDateDropDown={makeDateDropDown}
              />
              <SubItem
                title={'Related Items'}
                addable={true}
                incomingData={this.state.relatedItems}
                handler={this.boundSetState}
                remove={this.removeSection.bind(this, 'relatedItems')}
                showSection={this.state.openItems.relatedItems}
                apiReturned={this.state.openItems.apiReturned}
                addHandler={this.addSection.bind(this, 'relatedItems')}
              />
              <SubItem
                title={'Additional Information'}
                addable={false}
                incomingData={this.state.addInfo}
                handler={this.boundSetState}
                showSection={this.state.openItems.addInfo}
                apiReturned={this.state.openItems.apiReturned}
              />
              {this.state.crossmark &&
                <SubItem
                  title={'Crossmark'}
                  showCards={this.state.showCards}
                  crossmarkErrors={this.state.crossmarkErrors}
                />
              }

            </div>
          </form>
        </div>
      </div>
    )
  }
}
