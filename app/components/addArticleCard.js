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
import { makeDateDropDown, validDate } from '../utilities/date'
import isUrl from '../utilities/isURL'
import isDOI from '../utilities/isDOI'
import {routes} from '../routing'
import { getSubmitSubItems } from '../utilities/getSubItems'


const defaultState = {
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
    contributorGroupRole: false,

    licenseUrl: false,
    licenseUrlInvalid: false,
    licenseDate: false,
    licenseDateInvalid: false,
    licenseDateIncomplete: false,

    relatedItemIdType: false,
    relatedItemRelType: false,
    relatedItemDoiInvalid: false,

    simCheckUrlInvalid: false
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
      groupAuthorRole: '',
      errors: {
        contributorLastName: false,
        contributorRole: false,
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
      licenseurl:'',
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
    similarityCheckURL:'',
    freetolicense: false
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

@stateTrackerII
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

    asyncSubmitArticle: is.func.isRequired,
    asyncGetItem: is.func.isRequired
  }

  constructor (props) {
    super(props);
    this.state = defaultState;
    this.state.article.doi = props.ownerPrefix
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.reduxForm !== this.props.reduxForm) {
      return;
    }

    let setStatePayload = {};

    if(nextProps.crossmarkPrefixes.length && !this.state.crossmark) {
      if (nextProps.publication) {
        const thisPrefix = nextProps.publication.message ? nextProps.publication.message.doi.split('/')[0] : null;
        if(thisPrefix && nextProps.crossmarkPrefixes.includes(thisPrefix)) {
          setStatePayload.crossmark = true
        }
      }
    }

    const { publication } = nextProps
    if ((publication.message) && (nextProps.mode === 'edit')) {
      if (publication.message.contains.length > 0) { // its an edit of article, else its new, also checks if its empty before doing any xml conversion

        const parsedArticle = parseXMLArticle(publication.message.contains[0].content);

        if(parsedArticle.crossmark) {
          this.props.reduxEditForm(parsedArticle.crossmark.reduxForm);
          setStatePayload.showCards = parsedArticle.crossmark.showCards;
        }

        if(this.props.isDuplicate) {
          parsedArticle.article.doi = this.props.ownerPrefix
        }

        setStatePayload = {...setStatePayload, ...{
          doiDisabled: !this.props.isDuplicate,
          version: String(parseInt(publication.message.contains[0]['mdt-version']) + 1),
          addInfo: parsedArticle.addInfo,
          article: parsedArticle.article,
          contributors: parsedArticle.contributors,
          funding: parsedArticle.funding,
          license: parsedArticle.license,
          relatedItems: parsedArticle.relatedItems,
          openItems: parsedArticle.openItems
        }}
      }
    }
    this.setState(setStatePayload, nextProps.mode === 'edit' ? this.validation : null)
  }

  componentDidUpdate() {
    this.positionErrorBubble()
  }

  positionErrorBubble = () => {
    var firstError = $(".fieldError").first()
    if (firstError.length > 0) {
      $('.fullError').show()
      $('.fullError').find('.tooltips').css({
        'top': ((firstError.offset().top + (firstError.position().top - (firstError.position().top * .9)) - ($('.switchLicense').first().position().top + 15) - ($('.switchLicense').first().offset().top + 15))) + 25
      })
    } else {
      $('.fullError').hide()
    }
  }

  onSubmit = (e) => {
    e.preventDefault();

    const crossmark = this.state.crossmark ? crossmarkXml(this.props.reduxForm, this.props.ownerPrefix) : undefined;

    this.validation((valid) => {
      if (valid) {
        const publication = this.props.publication

        const journalArticle = journalArticleXml(this, crossmark);
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
        let savePub;

        if (this.props.issue) { //this is just an issue doi OR undefined
          // if its an issue, we need to put this newRecord under the issue, NOT the publicaton
          // need to use the issuePublication, the publication has been mutated to allow reading of the article
          const issuePublication = this.props.issuePublication
          const theIssue = _.find(issuePublication.message.contains, (item) => {
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

          browserHistory.push(`${routes.publications}/${encodeURIComponent(publication.message.doi)}`)
        });
      }
    })
  }

  validation (callback = ()=>{}) {
    const { title, doi, url, printDateYear, printDateMonth, printDateDay, onlineDateYear, onlineDateMonth, onlineDateDay, firstPage, lastPage } = this.state.article;

    let criticalErrors = {
      doi: false,
      invaliddoi: false,
      invalidDoiPrefix: false
    };
    criticalErrors.title = !title;

    if(!this.state.doiDisabled) {
      criticalErrors.doi = !doi;
      criticalErrors.invaliddoi = criticalErrors.doi ? false : !isDOI(doi);
      criticalErrors.invalidDoiPrefix = criticalErrors.invaliddoi ? false : (doi.split('/')[0] !== this.props.ownerPrefix);
    }

    const hasDate = !!(printDateYear || onlineDateYear);
    let warnings = {
      licenseUrl: false,
      licenseUrlInvalid: false,
      licenseDateIncomplete: false,
      licenseDateInvalid: false,

      contributorLastName: false,
      contributorRole: false,
      contributorGroupRole: false,

      relatedItemIdType: false,
      relatedItemRelType: false,
      relatedItemDoiInvalid: false,
    };
    warnings.url = !url;
    warnings.invalidurl = !!(url && !isUrl(url));

    warnings.printDateYear = hasDate ? false : !printDateYear;
    warnings.printDateIncomplete = !!(!printDateYear && (printDateMonth || printDateDay));
    warnings.printDateInvalid = warnings.printDateIncomplete ? false : !validDate(printDateYear, printDateMonth, printDateDay);

    warnings.onlineDateYear = hasDate ? false : !onlineDateYear;
    warnings.onlineDateIncomplete = !!(!onlineDateYear && (onlineDateMonth || onlineDateDay));
    warnings.onlineDateInvalid = warnings.onlineDateIncomplete ? false : !validDate(onlineDateYear, onlineDateMonth, onlineDateDay);

    warnings.firstPage = !!(lastPage && !firstPage);
    warnings.simCheckUrlInvalid = !!(this.state.addInfo.similarityCheckURL && !isUrl(this.state.addInfo.similarityCheckURL));


    if (this.state.addInfo.freetolicense){
      criticalErrors.licenseDate = true;
    }

    //validate License subItems
    const licenses = getSubmitSubItems(this.state.license).map((license, i) => {
      const {acceptedDateYear, acceptedDateMonth, acceptedDateDay, appliesto, licenseurl} = license;
      const errors = {
        licenseUrl: false,
        licenseUrlInvalid: false,
        licenseDate: false,
        licenseDateIncomplete: false,
        licenseDateInvalid: false,
      };

      const thereIsDate = !!(acceptedDateDay || acceptedDateMonth || acceptedDateYear);
      if(thereIsDate) {
        criticalErrors.licenseDate = false;

        if(!(acceptedDateDay && acceptedDateMonth && acceptedDateYear)) {
          errors.licenseDateIncomplete = true;
          warnings.licenseDateIncomplete = true;
        }
      }

      if(!errors.licenseDateIncomplete && !validDate(acceptedDateYear, acceptedDateMonth, acceptedDateDay)) {
        errors.licenseDateInvalid = true;
        warnings.licenseDateInvalid = true;
      }

      if(!licenseurl && (thereIsDate || appliesto)) {
        errors.licenseUrl = true;
        warnings.licenseUrl = true;
      }

      if(!errors.licenseUrl) {
        const urlInvalid = !isUrl(licenseurl);
        errors.licenseUrl = urlInvalid;
        warnings.licenseUrl = urlInvalid;
      }

      return {...license, errors}
    })

    if(criticalErrors.licenseDate) licenses[0].errors.licenseDate = true;  // if no licenses have a date and free to license is on, make first license require a date

    //validate contributor subItems
    const contributors = getSubmitSubItems(this.state.contributors).map( contributor => {
      const {firstName, lastName, suffix, affiliation, orcid, role, groupAuthorName, groupAuthorRole} = contributor;
      const errors = {
        contributorLastName: firstName && !lastName,
        contributorRole: (lastName || firstName || suffix || affiliation || orcid) && !role,
        contributorGroupRole: groupAuthorName && !groupAuthorRole
      }
      if(errors.contributorLastName) warnings.contributorLastName = true;
      if(errors.contributorRole) warnings.contributorRole = true;
      if(errors.contributorGroupRole) warnings.contributorGroupRole = true;

      return {...contributor, errors}
    })

    //validate relatedItem subItems
    const relatedItems = getSubmitSubItems(this.state.relatedItems).map( item => {
      const errors = {
        relatedItemIdType: !item.identifierType,
        relatedItemRelType: !item.relationType,
        relatedItemDoiInvalid: item.identifierType === 'doi' ? !isDOI(item.relatedItemIdentifier) : false
      }
      if(errors.relatedItemIdType) warnings.relatedItemIdType = true;
      if(errors.relatedItemRelType) warnings.relatedItemRelType = true;
      if(errors.relatedItemDoiInvalid) warnings.relatedItemDoiInvalid = true;

      return {...item, errors}
    })


    const crossmarkErrors = {};
    if(this.state.crossmark) {
      const reduxForm = this.props.reduxForm;

      for (const formField in reduxForm) {
        const [ card, i, field ] = formField.split('_');
        const value = reduxForm[formField];

        if(field === 'href') {
          crossmarkErrors[formField] = !value ? false : !isUrl(value)
        }

        if(card === 'update') {
          if(field === 'type' && value !== '') {
            crossmarkErrors[`update_${i}_DOI_Missing`] = !reduxForm[`update_${i}_DOI`];
            crossmarkErrors[`update_${i}_year`] = !reduxForm[`update_${i}_year`];
          }

          if(field === 'DOI') {
            var re = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i
            crossmarkErrors[`${formField}_Invalid`] = !re.test(reduxForm[formField])
          }
        }

        if(card === 'clinical' && value !== '') {
          crossmarkErrors[`clinical_${i}_registry`] = !reduxForm[`clinical_${i}_registry`];
          crossmarkErrors[`clinical_${i}_trialNumber`] = !reduxForm[`clinical_${i}_trialNumber`];
        }
      }
    }

    const completeValidation = () => {
      const setStatePayload = {
        error: false,
        errors: {...criticalErrors, ...warnings},
        crossmarkErrors,
        license: licenses.length ? licenses : this.state.license,
        contributors: contributors.length ? contributors : this.state.contributors,
        relatedItems: relatedItems.length ? relatedItems : this.state.relatedItems
      }
      let valid = true;

      for(const key in warnings) {
        if (warnings[key]) {
          setStatePayload.error = true;
        }
      }

      for(const key in crossmarkErrors) {
        if(crossmarkErrors[key]) {
          setStatePayload.error = true;
        }
      }

      for(const key in criticalErrors) {
        if(criticalErrors[key]) {
          setStatePayload.error = true;
          valid = false;
        }
      }

      this.setState(setStatePayload, ()=>callback(valid))
    }

    if(this.state.doiDisabled || criticalErrors.doi || criticalErrors.invaliddoi || criticalErrors.invalidDoiPrefix) {
      completeValidation()
    } else {
      return checkDupeDOI(doi, (isDupe) => {
        criticalErrors.dupedoi = isDupe;
        completeValidation()
      })
    }
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
                positionErrorBubble={this.positionErrorBubble}
                errorContributorLastName={this.state.errors.contributorLastName}
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
                positionErrorBubble={this.positionErrorBubble}
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
                errorLicenseStartDate={this.state.errors.licenseDate}
                errorLicenseUrlInvalid={this.state.errors.licenseUrlInvalid}
                makeDateDropDown={makeDateDropDown}
                positionErrorBubble={this.positionErrorBubble}
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
                positionErrorBubble={this.positionErrorBubble}
              />
              <SubItem
                title={'Additional Information'}
                addable={false}
                incomingData={this.state.addInfo}
                handler={this.boundSetState}
                showSection={this.state.openItems.addInfo}
                apiReturned={this.state.openItems.apiReturned}
                positionErrorBubble={this.positionErrorBubble}
              />
              {this.state.crossmark &&
                <SubItem
                  title={'Crossmark'}
                  showCards={this.state.showCards}
                  crossmarkErrors={this.state.crossmarkErrors}
                  positionErrorBubble={this.positionErrorBubble}
                />
              }

            </div>
          </form>
        </div>
      </div>
    )
  }
}
