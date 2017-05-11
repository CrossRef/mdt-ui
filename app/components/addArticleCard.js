import React, { Component } from 'react'
import is from 'prop-types'
import { browserHistory } from 'react-router'
import update from 'immutability-helper'
import Switch from 'react-toggle-switch'
import _ from 'lodash'
import { stateTrackerII } from 'my_decorators'

import client from '../client'
import fetch from '../utilities/fetch'
import checkDupeDOI from '../utilities/dupeDOI'
import xmldoc from '../utilities/xmldoc'
import objectSearch from '../utilities/objectSearch'
import ReviewArticleRefactor from './reviewArticleRefactor'
import SubItem from './SubItems/subItem'
import { TopBar, InfoBubble, InfoHelperRow, ErrorBubble, ArticleTitleField, OptionalTitleData, ArticleDOIField, ArticleUrlField } from './addArticleCardComponents'
import { journalArticleXml } from '../utilities/xmlGenerator'
import JSesc from '../utilities/jsesc'

@stateTrackerII
export default class AddArticleCard extends Component {

  static propTypes = {
    cartUpdate: is.func.isRequired,
    reduxControlModal: is.func.isRequired,
    reduxEditForm: is.func.isRequired,
    asyncSubmitArticle: is.func.isRequired,
    crossmarkAuth: is.bool.isRequired,
    reduxForm: is.object.isRequired,
    mode: is.string.isRequired,
    publication: is.shape({
      message: is.object
    }).isRequired,
    publicationMetaData: is.shape({
      Journal: is.object
    })
  }

  constructor (props) {
    super(props)

    this.state = {
      showOptionalTitleData: false,
      showContributor: false,
      showFunding: false,
      showRelatedItems: false,
      showAdditionalInformation: false,
      showHelper: false,
      on: false,
      error: false,
      doiDisabled: false,
      version: '0',
      errors: {
        title: false,
        printDateYear: false,
        onlineDateYear: false,
        doi: false,
        url: false,
        dupedoi: false,
        invaliddoi: false,
        invalidurl: false,
        licenseStartDate: false
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
      }
    }
  }

  async componentWillReceiveProps (nextProps) {
    const { publication } = nextProps
    if ((publication.message) && (nextProps.mode === 'edit')) {
      if (publication.message.contains.length > 0) { // its an edit of article, else its new, also checks if its empty before doing any xml conversion
        this.setState({doiDisabled: true})

        const parsedArticle = xmldoc(publication.message.contains[0].content)
        this.setState({version: String(parseInt(publication.message.contains[0]['mdt-version']) + 1)})

        // article loading
        const publication_date = objectSearch(parsedArticle, 'publication_date')

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

        const acceptedPubDate = objectSearch(parsedArticle, 'acceptance_date')

        var acceptedDateYear = ''
        var acceptedDateMonth = ''
        var acceptedDateDay = ''
        if (acceptedPubDate) {
          acceptedDateYear = acceptedPubDate['year'] ? acceptedPubDate['year'] : ''
          acceptedDateMonth = acceptedPubDate['month'] ? acceptedPubDate['month'] : ''
          acceptedDateDay = acceptedPubDate['day'] ? acceptedPubDate['day'] : ''
        }

        const titles = objectSearch(parsedArticle, 'titles')
        const title = titles.title.trim()

        var originallanguagetitle = ''
        if (titles.original_language_title) {
          originallanguagetitle = (titles.original_language_title.trim().length > 0) ? titles.original_language_title.trim() : ''
        }
        // 0 is subtitle, 1 is original language subtitle
        var subtitle = ''
        var originallanguagetitlesubtitle = ''

        if (titles.subtitle) {
          if (titles.subtitle[0]) {
            subtitle = (titles.subtitle[0].trim().length > 0) ? titles.subtitle[0].trim() : ''
          }
          if (titles.subtitle[1]) {
            originallanguagetitlesubtitle = (titles.subtitle[1].trim().length > 0) ? titles.subtitle[1].trim() : ''
          }
        }

        const pages = objectSearch(parsedArticle, 'pages')

        var firstPage = ''
        var lastPage = ''
        if (pages) {
          firstPage = pages.first_page ? pages.first_page : ''
          lastPage = pages.last_page ? pages.last_page : ''
        }

        const abstractHolder = objectSearch(parsedArticle, 'jats:abstract')
        var abstract = ''
        if (abstractHolder) {
          abstract = objectSearch(abstractHolder, 'jats:p')
        }
        var doiData = objectSearch(parsedArticle, 'doi_data')
        const doi = doiData.doi
        const url = doiData.resource

        const publisherItem = objectSearch(parsedArticle, 'publisher_item')
        var locationId = ''
        if (publisherItem) {
          locationId = objectSearch(publisherItem, '#text')
        }

        var article = {
          title:title,
          doi: doi,
          subtitle: subtitle,
          originallanguagetitle: originallanguagetitle,
          originallanguagetitlesubtitle: originallanguagetitlesubtitle,
          url: url,
          printDateYear: printDateYear,
          printDateMonth: printDateMonth,
          printDateDay: printDateDay,
          onlineDateYear: onlineDateYear,
          onlineDateMonth: onlineDateMonth,
          onlineDateDay: onlineDateDay,
          acceptedDateYear: acceptedDateYear,
          acceptedDateMonth: acceptedDateMonth,
          acceptedDateDay: acceptedDateDay,
          firstPage: firstPage,
          lastPage: lastPage,
          locationId: locationId,
          abstract: abstract
        }

        this.setState({
          article: article
        })

        // additional info loading
        const publicationType = objectSearch(parsedArticle, '-publication_type')
        const archiveLocations = objectSearch(parsedArticle, 'archive_locations')
        var archive = ''
        if (archiveLocations) {
          archive = archiveLocations.archive['-name']
        }
        const item = objectSearch(doiData, 'item')
        var similarityCheckURL = ''
        if (item) {
          similarityCheckURL = objectSearch(item, 'resource')
        }
        const language = objectSearch(parsedArticle, '-language')

        const freeToRead = objectSearch(parsedArticle, 'ai:free_to_read')

        const addInfo = {
          archiveLocation: archive,
          language: language ? language : '',
          publicationType: publicationType ? publicationType : '',
          similarityCheckURL: similarityCheckURL ? similarityCheckURL : '',
          freetolicense: freeToRead ? 'yes' : 'no'
        }

        this.setState({
          addInfo: addInfo
        })

        // contributor loading
        const contributors = objectSearch(parsedArticle, 'contributors')
        var contributee = []
        // contributors are divied into 2 types
        // person_name and organization
        var person_name = undefined
        var organization = undefined
        if (contributors) {
          person_name = objectSearch(contributors, 'person_name')
          organization = objectSearch(contributors, 'organization')

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
                  role: person_name['-contributor_role'] ? person_name['-contributor_role'] : '',
                  groupAuthorName: '',
                  groupAuthorRole: ''
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
                    role: person['-contributor_role'] ? person['-contributor_role'] : '',
                    groupAuthorName: '',
                    groupAuthorRole: ''
                  }
                )
              })
            }
          }

          if (organization) { // if exist
            if (!Array.isArray(organization)) {
              // there is ONE organization
              contributee.push(
                {
                  firstName: '',
                  lastName: '',
                  suffix: '',
                  affiliation: '',
                  orcid: '',
                  role: '',
                  groupAuthorName: organization['#text'] ? organization['#text'] : '',
                  groupAuthorRole: organization['-contributor_role'] ? organization['-contributor_role'] : ''
                }
              )
            } else { // its an array
              _.each(organization, (org) => {
                contributee.push(
                  {
                    firstName: '',
                    lastName: '',
                    suffix: '',
                    affiliation: '',
                    orcid: '',
                    role: '',
                    groupAuthorName: org['#text'] ? org['#text'] : '',
                    groupAuthorRole: org['-contributor_role'] ? org['-contributor_role'] : ''
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
              groupAuthorName: '',
              groupAuthorRole: ''
            }
          )
        }

        this.setState({
          contributors: update(this.state.contributors, {$set: contributee })
        })

        // fundings loading
        const fundings = objectSearch(parsedArticle, 'fr:assertion')
        var funders = []
        // contributors are divied into 2 types
        // person_name and organization
        if (fundings) {
            if (!Array.isArray(fundings)) {
              // only 1 funder
              // 0 is the actual funder data
              // 1 is the grantnumbers
              const thefunder = objectSearch(fundings, 'fr:assertion')
              var funderName = ''
              var funderRegId = ''
              var funderIdent = ''
              var grants = []
              // because I don't know what is returned back from backend cause there is no validation, I need to loop
              for(var i = 0; i < thefunder.length; i++) {
                if (thefunder[i]['-name'] === 'funder_name'){
                  funderName = thefunder[i]['#text'].trim()
                  // within hte name, there is the funder ID
                   const thefunderReg = objectSearch(thefunder[i], 'fr:assertion')
                   if (thefunderReg) {
                      funderIdent = thefunderReg['#text']
                      funderRegId = funderIdent.substr(funderIdent.lastIndexOf('/')+1, funderIdent.length -1)
                   }

                } else if (thefunder[i]['-name'] === 'award_number'){
                  grants.push(thefunder[i]['#text'])
                }
              }
              funders.push({
                fundername: funderName,
                funderRegistryID: funderRegId,
                funder_identifier: funderIdent,
                grantNumbers: grants.length > 0 ? grants : ['']
              })
            } else {
              _.each(fundings, (fund) => {
                const thefunder = objectSearch(fund, 'fr:assertion')
                var funderName = ''
                var funderRegId = ''
                var funderIdent = ''
                var grants = []
                // because I don't know what is returned back from backend cause there is no validation, I need to loop
                for(var i = 0; i < thefunder.length; i++) {
                  if (thefunder[i]['-name'] === 'funder_name'){
                    funderName = thefunder[i]['#text'].trim()
                  // within hte name, there is the funder ID
                   const thefunderReg = objectSearch(thefunder[i], 'fr:assertion')
                   if (thefunderReg) {
                      funderIdent = thefunderReg['#text']
                      funderRegId = funderIdent.substr(funderIdent.lastIndexOf('/')+1, funderIdent.length -1)
                   }
                  } else if (thefunder[i]['-name'] === 'award_number'){
                    grants.push(thefunder[i]['#text'])
                  }
                }
                funders.push(
                  {
                    fundername: funderName,
                    funderRegistryID: funderRegId,
                    funder_identifier: funderIdent,
                    grantNumbers: grants.length > 0 ? grants : ['']
                  }
                )
              })
            }
        }

        if (funders.length <= 0) {
          funders.push(
            {
              fundername: '',
              funderRegistryID: '',
              funder_identifier: '',
              grantNumbers: ['']
            }
          )
        }

        this.setState({
          funding: update(this.state.funding, {$set: funders })
        })

        // license loading
        const licences = objectSearch(parsedArticle, 'ai:license_ref')
        var lic = []
        // contributors are divied into 2 types
        // person_name and organization
        if (licences) {
          if (!Array.isArray(licences)) {
            const licAcceptedDate = licences['-start_date'].split('-')
            lic.push({
                acceptedDateDay: licAcceptedDate[2] ? licAcceptedDate[2] : '',
                acceptedDateMonth: licAcceptedDate[1] ? licAcceptedDate[1] : '',
                acceptedDateYear: licAcceptedDate[0] ? licAcceptedDate[0] : '',
                appliesto: licences['-applies_to'] ? licences['-applies_to'] : '',
                licenseurl: licences['#text'] ? licences['#text'] : ''
              })
          } else {
            for(var i = 0; i < licences.length; i++) {
              const licAcceptedDate = licences[i]['-start_date'].split('-')
              lic.push({
                  acceptedDateDay: licAcceptedDate[2] ? licAcceptedDate[2] : '',
                  acceptedDateMonth: licAcceptedDate[1] ? licAcceptedDate[1] : '',
                  acceptedDateYear: licAcceptedDate[0] ? licAcceptedDate[0] : '',
                  appliesto: licences[i]['-applies_to'] ? licences[i]['-applies_to'] : '',
                  licenseurl: licences[i]['#text'] ? licences[i]['#text'] : ''
                })
            }
          }
        }

        if (lic.length <= 0) {
          lic.push(
            {
              acceptedDateDay: '',
              acceptedDateMonth: '',
              acceptedDateYear: '',
              appliesto: '',
              licenseurl: ''
            }
          )
        }

        this.setState({
          license: update(this.state.license, {$set: lic })
        })

        // related items
        const relatedItems = objectSearch(parsedArticle, 'related_item')
        var relItem = []
        // contributors are divied into 2 types
        // person_name and organization
        if (relatedItems) {
          if (!Array.isArray(relatedItems)) {
            const inter_work_relation = objectSearch(relatedItems, 'inter_work_relation')
            relItem.push({
                description: relatedItems['description'] ? relatedItems['description'] : '',
                identifierType: inter_work_relation['-identifier-type'] ? inter_work_relation['-identifier-type'] : '',
                relatedItemIdentifier: inter_work_relation['#text'] ? inter_work_relation['#text'] : '',
                relationType: inter_work_relation['-relationship-type'] ? inter_work_relation['-relationship-type'] : ''
              })
          } else {
            for(var i = 0; i < relatedItems.length; i++) {
              const inter_work_relation = objectSearch(relatedItems[i], 'inter_work_relation')
              relItem.push({
                description: relatedItems[i]['description'] ? relatedItems[i]['description'] : '',
                identifierType: inter_work_relation['-identifier-type'] ? inter_work_relation['-identifier-type'] : '',
                relatedItemIdentifier: inter_work_relation['#text'] ? inter_work_relation['#text'] : '',
                relationType: inter_work_relation['-relationship-type'] ? inter_work_relation['-relationship-type'] : ''
              })
            }
          }
        }

        if (relItem.length <= 0) {
          relItem.push(
            {
              description: '',
              identifierType: '',
              relatedItemIdentifier: '',
              relationType: ''
            }
          )
        }

        this.setState({
          relatedItems: update(this.state.relatedItems, {$set: relItem })
        })

      }
    }
  }

  dropDownHandler (index, item, type) {
    switch(type){
      case 'license':
        this.handleLicense (index, item)
        break
      case 'article':
        this.handleChange (item)
        break
      case 'addInfo':
        this.handleAddInfo (item)
    }
  }

  makeDateDropDown (name, type, preset, validation, index, item, handler) {
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
        name={name}
        ref={name}
        onChange={(e) => {
            if(handler==='article') {
              this.handleChange(e)
            } else
              this.dropDownHandler(index, item, handler)
          }
        }
        value={parseInt(preset)}
        >
        {s}
      </select>
    )
  }

  handleChange = (e) => {
    this.setState({
      article: {
        ...this.state.article,
        [e.target.name]: e.target.value
      }
    })
  }

  toggleFields () {
    this.setState({
      showOptionalTitleData: !this.state.showOptionalTitleData
    })
  }

  handleContributor (index, Contributor) {
    var contributor = {}
    for(var i in Contributor.refs){
      if(Contributor.refs[i]){
        contributor[i] = Contributor.refs[i].value
      }
    }

    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
      contributors: update(this.state.contributors, {[index]: {$set: contributor }})
    })
  }

  handleRelatedItems (index, RelatedItem) {
    var relatedItems = {}
    for(var i in RelatedItem.refs){
      if(RelatedItem.refs[i]){
        relatedItems[i] = RelatedItem.refs[i].value
      }
    }

    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
      relatedItems: update(this.state.relatedItems, {[index]: {$set: relatedItems }})
    })
  }

  handleAddInfo (addInfo) {
    this.setState({
      addInfo: update(this.state.addInfo, {$set:{
        archiveLocation: addInfo.refs.archiveLocation.value,
        language: addInfo.refs.language.value,
        publicationType: addInfo.refs.publicationType.value,
        similarityCheckURL: addInfo.refs.similarityCheckURL.value,
        freetolicense: addInfo.state.on  ? 'yes' : 'no'
      }})
    }, ()=>{
      // for some reason, I have to flow it back down to the children, where the others don't need it
      addInfo.refs['publicationType'].value = this.state.addInfo.publicationType
      addInfo.refs['language'].value = this.state.addInfo.language
      addInfo.refs['archiveLocation'].value = this.state.addInfo.archiveLocation
      addInfo.refs['similarityCheckURL'].value = this.state.addInfo.similarityCheckURL
      addInfo.state.on =  this.state.addInfo.freetolicense === 'yes' ? true : false
    })
  }

  handleLicense (index, License) {
    console.log(License.refs);
    var license = {}
    for(var i in License.refs){
      if(License.refs[i]){
        license[i] = License.refs[i].value
      }
    }

    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
      license: update(this.state.license, {[index]: {$set: license }})
    })

  }

  handleFunding (index, Funder, value, uri) {
    var funder = {}
    var grants = []
    var funder_ident_count = 0
    for(var i in Funder.refs){
      if(i === 'funderRegistryID') {
        funder[i] = value
        funder['funder_identifier'] = uri
      } else if ((i !== 'funder_identifier') && (i !== 'funderRegistryID') && (i.indexOf('grantNumbers') < 0)){
        funder[i] = Funder.refs[i].value
      } else if (i.indexOf('grantNumber') > -1){
        grants.push(Funder.refs[i].value)
      }
    }

    funder.grantNumbers = grants

    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
      funding: update(this.state.funding, {[index]: {$set: funder }})
    })

  }

  addContributor () {
    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
     contributors: update(this.state.contributors, {$push:
        [{
          firstName: '',
          lastName: '',
          suffix: '',
          affiliation: '',
          orcid: '',
          role: '',
          groupAuthorName: '',
          groupAuthorRole: ''
        }]
     })
    })
  }

  addLicense () {
    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
     license: update(this.state.license, {$push:
        [{
          acceptedDateDay:'',
          acceptedDateMonth:'',
          acceptedDateYear:'',
          appliesto:'',
          licenseurl:''
        }]
     })
    })
  }

  addFunder () {
    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
     funding: update(this.state.funding, {$push:
        [{
          fundername: '',
          funderRegistryID: '',
          funder_identifier: '',
          grantNumbers: ['']
        }]
     })
    })
  }

  addRelatedItems () {
    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
     relatedItems: update(this.state.relatedItems, {$push:
      [{
        relatedItemIdentifier:'',
        identifierType:'',
        description:'',
        relationType:''
      }]
     })
    })

  }

  addGrant (index, funder) {
    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
     funding: update(this.state.funding, {[index]: {grantNumbers: {$push: ['']}}})
    })
  }

  removeGrant (index, grantIndex, funder) {
    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
      funding: update(this.state.funding, {[index]: {grantNumbers: {$splice: [[grantIndex, 1]]}}})
    })
  }

  removeFunder (index) {
    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
      funding: update(this.state.funding, {$splice: [[index, 1]] })
    })
  }

  removeLicense (index) {
    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
      license: update(this.state.license, {$splice: [[index, 1]] })
    })
  }

  removeRelatedItems (index) {
    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
      relatedItems: update(this.state.relatedItems, {$splice: [[index, 1]] })
    })
  }

  removeContributor (index) {
    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
      contributors: update(this.state.contributors, {$splice: [[index, 1]] })
    })
  }

  isValidDOI () {
    var re = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i
    return re.test(this.state.article.doi)
  }

  validateURL () {
    var re = /^(ftp|http|https):\/\/[^ "]+$/
    return re.test(this.state.article.url)
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

  getContributorXML () {
      var contributors = this.getSubmitSubItems(this.state.contributors).map((contributor, i) => {
          // cause the type "ROLE" is shared name
          var attributes = [
            (contributor.firstName && (contributor.firstName.trim().length>0)) ? `<given_name>${contributor.firstName}</given_name>` : undefined,
            (contributor.lastName && (contributor.lastName.trim().length>0)) ? `<surname>${contributor.lastName}</surname>` : undefined,
            (contributor.suffix && (contributor.suffix.trim().length>0)) ? `<suffix>${contributor.suffix}</suffix>` : undefined,
            (contributor.affiliation && (contributor.affiliation.trim().length>0)) ? `<affiliation>${contributor.affiliation}</affiliation>` : undefined,
            (contributor.orcid && (contributor.orcid.trim().length>0)) ? `<ORCID>${contributor.orcid}</ORCID>` : undefined,
          ]

          attributes = _.filter(attributes, (attribute) => { // filter all the undefined
            for(var key in attribute) { // checking all the properties of errors to see if there is a true
                if (attribute[key]) {
                  return attribute
                }
            }
          })

          var org = ((contributor.groupAuthorName && (contributor.groupAuthorName.trim().length>0)) && (contributor.groupAuthorRole && (contributor.groupAuthorRole.trim().length>0))) ? `<organization sequence="${i===0 ? 'first' : 'additional'}" contributor_role="${contributor.groupAuthorRole}">${contributor.groupAuthorName}</organization>` : undefined

          var person = `<person_name sequence="${i===0 ? 'first' : 'additional'}"${(contributor.role && (contributor.role.trim().length>0)) ? ` contributor_role="${contributor.role}"` : ``}>${attributes.join('')}</person_name>`

        return org ? org : person
      })

      return contributors.length > 0 ? `<contributors>${contributors.join('')}</contributors>` : ``
  }

  getFunderXML () {
      var funders = this.getSubmitSubItems(this.state.funding).map((funder, i) => {
          var funderName = undefined
          if (funder.fundername) {
            funderName = funder.fundername.trim().length > 0 ? funder.fundername : undefined
          }

          var funder_identifier = undefined
          if (funder.funder_identifier) {
            funder_identifier = funder.funder_identifier.trim().length > 0 ? funder.funder_identifier : undefined
          }

          var attributes = ``
          if (funderName || funder_identifier) { //if an of these exist
            attributes = `<fr:assertion name="funder_name">${funderName}${funder_identifier ? `<fr:assertion name="funder_identifier">${funder_identifier}</fr:assertion>` : ``}</fr:assertion>`
            var grants = funder.grantNumbers.map((awardNumber, i) => {
              return `<fr:assertion name="award_number">${awardNumber}</fr:assertion>`
            });

            var fundgroup = `<fr:assertion name="fundgroup">${attributes}${grants.join('')}</fr:assertion>`
            return fundgroup
          }
      })

    funders = _.filter(funders, (funder) => {
      return typeof funder !== 'undefined'
    })

    return funders.length > 0 ? `<fr:program xmlns:fr="http://www.crossref.org/fundref.xsd">${funders.join('')}</fr:program>` : ``

  }

  getLicenseXML () {
      var licenses = this.getSubmitSubItems(this.state.license).map((license, i) => {

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

          var attributes = ``
          if (dayHolder.length > 0) {
            var freetolicense = ``
            if (this.state.addInfo.freetolicense === 'yes') {
              freetolicense = `<ai:free_to_read start_date="${dayHolder.join('-')}"/>`
            }

            attributes = `${freetolicense}<ai:license_ref applies_to="${license.appliesto}" start_date="${dayHolder.join('-')}">${license.licenseurl}</ai:license_ref>`
          }
          return attributes
      })
    return licenses.length > 0 ? `<ai:program xmlns:ai="http://www.crossref.org/AccessIndicators.xsd" name="AccessIndicators">${licenses.join('')}</ai:program>` : ``
  }

  getRelatedItemsXML () {
      var relatedItems = this.getSubmitSubItems(this.state.relatedItems).map((relatedItem, i) => {
          var attributes = `<related_item>${(relatedItem.description.length > 0) ? `<description>${relatedItem.description}</description>` : ``}<inter_work_relation relationship-type="${relatedItem.relationType}" identifier-type="${relatedItem.identifierType}">${relatedItem.relatedItemIdentifier}</inter_work_relation></related_item>`

          return attributes
      })
    return relatedItems.length > 0 ? `<program xlmns="http://www.crossref.org/relations.xsd">${relatedItems.join('')}</program>` : ``
  }

  getCollectionXML () {
    // similarity check
    const similarityCheck = this.state.addInfo.similarityCheckURL.trim().length > 0 ? `<item crawler="iParadigms"><resource>${this.state.addInfo.similarityCheckURL}</resource></item>` : ``
    return similarityCheck
  }

  getPagesXML () {
      return ((this.state.article.firstPage.trim().length > 0) || (this.state.article.lastPage.trim().length > 0)) ? `<pages>${(this.state.article.firstPage.trim().length > 0) ? `<first_page>${this.state.article.firstPage}</first_page>` : ``}${(this.state.article.lastPage.trim().length > 0) ? `<last_page>${this.state.article.lastPage}</last_page>` : ``}</pages>`: ``
  }

  getPublisherItems () {
    return (this.state.article.locationId.trim().length > 0) ? `<publisher_item><item_number item_number_type="article_number">${this.state.article.locationId.trim()}</item_number></publisher_item>` : ``
  }

  getAcceptanceDateXML () {
    var retStr = ``
    if ((this.state.article.acceptedDateYear.length > 0) || (this.state.article.acceptedDateMonth.length > 0) || (this.state.article.acceptedDateDay.length > 0)) {
      retStr = retStr + ((this.state.article.acceptedDateYear.length > 0) ? `<year>${this.state.article.acceptedDateYear}</year>` : ``)
      retStr = retStr + ((this.state.article.acceptedDateMonth.length > 0) ? `<month>${this.state.article.acceptedDateMonth}</month>` : ``)
      retStr = retStr + ((this.state.article.acceptedDateDay.length > 0) ? `<day>${this.state.article.acceptedDateDay}</day>` : ``)
      retStr = `<acceptance_date>${retStr}</acceptance_date>`
    }

    return retStr
  }


  onSubmit = (e) => {

    e.preventDefault()

    this.validation((valid) => { // need it to be a callback because setting state does not happen right away
      if (!valid) {

        const props = this.props
        var publication = this.props.publication

        const state = this.state

        const metaData = `` // TODO: Publication information

        const journalIssue = `` // TODO: Issue information

        const journalArticle = journalArticleXml(this);
        const journal = `<?xml version="1.0" encoding="UTF-8"?><crossref xmlns="http://www.crossref.org/xschema/1.1"><journal>${journalArticle}</journal></crossref>`

        const title = JSesc(this.state.article.title)

        var newRecord = {
          'title': {'title': title},
          'doi': this.state.article.doi,
          'type': 'article',
          'mdt-version': this.state.version,
          'status': 'draft',
          'content': journal.replace(/(\r\n|\n|\r)/gm,'')
        }

        publication.message.contains = [newRecord];

        this.props.asyncSubmitArticle(publication, this.state.article.doi, () => {
          browserHistory.push(`/publications/${encodeURIComponent(publication.message.doi)}`)
        });

      }
    })

  }


  validation (callback) {
    var errorStates = {
      title: {$set: false },
      doi: {$set: false },
      printDateYear: {$set: false },
      onlineDateYear: {$set: false },
      url: {$set: false },
      invalidurl: {$set: false },
      dupedoi: {$set: false },
      invaliddoi: {$set: false}
    }
    this.setState({
      error: false,
      errors: update(this.state.errors, errorStates)
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
          title: {$set: (this.state.article.title.length === 0) },
          doi: {$set: (this.state.article.doi.length === 0) },
          printDateYear: {$set: (this.state.article.printDateYear.length === 0) },
          onlineDateYear: {$set: (this.state.article.onlineDateYear.length === 0) },
          url: {$set: (this.state.article.url.length === 0) },
          invalidurl: {$set: !this.validateURL() && (this.state.article.url.length > 0) },
          dupedoi: {$set: this.state.doiDisabled ? false : isDupe },
          invaliddoi: {$set: ((this.state.article.doi.length > 0) && (isValid ? isValid : !this.isValidDOI()))},
          licenseStartDate: {$set: false }
        }

        if (hasPrintYear) { // has print year, don't care if there is a online year
          errorStates.onlineDateYear = {$set: false}
        }
        if (hasOnlineYear) { // has online year, don't care if there is a print year
          errorStates.printDateYear = {$set: false}
        }

        // if addInfo license to read to ON, license StartDates are required
        if (this.state.addInfo.freetolicense === 'yes'){
            var licenses = this.getSubmitSubItems(this.state.license).map((license, i) => {
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

  openReviewArticleModal = () => {
    this.props.reduxControlModal({
      showModal: true,
        title:
          <div className='innerTitleHolder'>
            <div className='innterTitleHolderIcon'>
              <img src='/images/ReviewArticle/Asset_Icons_White_Review.svg' />
            </div>
            <div className='innerTitleHolderText'>
              {this.state.article.title}
            </div>
          </div>,
        style: 'defaultModal reviewModal',
        Component: ReviewArticleRefactor,
        props: {
            reviewData: this.state,
            publication: this.props.publication,
            publicationMetaData: this.props.publicationMetaData,
            cartUpdate: this.props.cartUpdate
        }
    })
  }

  boundSetState = (...args) => { this.setState(...args) }


  render () {
    const error = (this.props.addArticle || {}).error
    const { publication, publicationMetaData } = this.props

    return (
      <div>
        <div className="reviewArticleButtonDiv">
          <button onClick={this.openReviewArticleModal} className="addPublication">Review</button>
        </div>

        <div className={'addarticlecard' + (error ? ' invalid' : '')}>

          <form className='addArticleForm' onSubmit={this.onSubmit.bind(this)}>

            <div className='articleInnerForm'>

              <TopBar title={this.state.article.title} />

              <div className='body'>

                <InfoHelperRow setState={this.boundSetState} on={this.state.on}/>

                <div className='row'>
                  <ArticleTitleField handleChange={this.handleChange} title={this.state.article.title} errors={this.state.errors}/>
                  {(!this.state.error && this.state.showHelper) && <InfoBubble/> }
                  {(this.state.error) && <ErrorBubble errors={this.state.errors}/> }
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

                <div className='row'>
                  <div className='fieldHolder'>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div className='labelinnerholder'>
                          <div className='label'>Print Date</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className={'requiredholder' + (((this.state.article.onlineDateYear ? this.state.article.onlineDateYear : '').length === 0)? ' dateselectrequire':' norequire')}>
                          <div className='required height32'>
                            {((this.state.article.onlineDateYear ? this.state.article.onlineDateYear : '').length === 0 ? <span>*</span> : <span></span>)}
                          </div>
                        </div>
                        <div className='field'>
                          <div className='datepickerholder'>
                            <div className='dateselectholder'>
                              <div>Year {((this.state.article.onlineDateYear ? this.state.article.onlineDateYear : '').length === 0 ? '(*)' : '')}</div>
                              <div>{this.makeDateDropDown('printDateYear', 'y', this.state.article.printDateYear, this.state.errors.printDateYear, 0, this, 'article')}</div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Month</div>
                              <div>
                                {this.makeDateDropDown('printDateMonth', 'm', this.state.article.printDateMonth, false, 0, this, 'article')}
                              </div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Day</div>
                              <div>
                                {this.makeDateDropDown('printDateDay', 'd', this.state.article.printDateDay, false, 0, this, 'article')}
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
                        <div className='labelinnerholder'>
                          <div className='label'>Online Date</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className={'requiredholder' + (((this.state.article.printDateYear ? this.state.article.printDateYear : '').length === 0)? ' dateselectrequire':' norequire')}>
                          <div className='required height32'>
                            {((this.state.article.printDateYear ? this.state.article.printDateYear : '').length === 0 ? <span>*</span> : <span></span>)}
                          </div>
                        </div>
                        <div className='field'>
                          <div className='datepickerholder'>
                            <div className='dateselectholder'>
                              <div>Year {((this.state.article.printDateYear ? this.state.article.printDateYear : '').length === 0 ? '(*)' : '')}</div>
                              <div>{this.makeDateDropDown('onlineDateYear', 'y', this.state.article.onlineDateYear, this.state.errors.onlineDateYear, 0, this, 'article')}</div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Month</div>
                              <div>
                                {this.makeDateDropDown('onlineDateMonth', 'm', this.state.article.onlineDateMonth, false, 0, this, 'article')}
                              </div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Day</div>
                              <div>
                                {this.makeDateDropDown('onlineDateDay', 'd', this.state.article.onlineDateDay, false, 0, this, 'article')}
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
                        <div className='labelinnerholder'>
                          <div className='label'>Accepted Date</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder dateselectrequire norequire'>
                          <div className='required height32'>
                          </div>
                        </div>
                        <div className='field'>
                          <div className='datepickerholder'>
                            <div className='dateselectholder'>
                              <div>Year</div>
                              <div>{this.makeDateDropDown('acceptedDateYear', 'y', this.state.article.acceptedDateYear, false, 0, this, 'article')}</div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Month</div>
                              <div>
                                {this.makeDateDropDown('acceptedDateMonth', 'm', this.state.article.acceptedDateMonth, false, 0, this, 'article')}
                              </div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Day</div>
                              <div>
                                {this.makeDateDropDown('acceptedDateDay', 'd', this.state.article.acceptedDateDay, false, 0, this, 'article')}
                              </div>
                            </div>
                            <div>
                            </div>
                          </div>
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
                        <div className='labelinnerholder'>
                          <div className='label'>First Page</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder norequire'>
                          <div className='required height32'>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              name="firstPage"
                              className='height32'
                              type='text'
                              onChange={this.handleChange}
                              value={this.state.article.firstPage}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div className='labelinnerholder'>
                          <div className='label'>Last Page</div>
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
                            name='lastPage'
                            onChange={this.handleChange}
                            value={this.state.article.lastPage}
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
                        <div className='labelinnerholder'>
                          <div className='label'>Article / Electronic Location ID</div>
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
                              name='locationId'
                              onChange={this.handleChange}
                              value={this.state.article.locationId}
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
                    <div className='fieldinnerholder fulllength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Abstract</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder norequire'>
                          <div className='required height64'>
                          </div>
                        </div>
                        <div className='field'>
                          <textarea
                              className='height64'
                              type='text'
                              name='abstract'
                              onChange={this.handleChange}
                              value={this.state.article.abstract}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='errorHolder'>
                  </div>
                </div>

              </div>

              <SubItem
                title={'Contributor'}
                addable={true}
                incomingData={this.state.contributors}
                handler={this.handleContributor.bind(this)}
                remove={this.removeContributor.bind(this)}
                showSection={this.state.showContributor}
                addHandler={this.addContributor.bind(this)}
              />
              <SubItem
                title={'Funding'}
                addable={true}
                incomingData={this.state.funding}
                handler={this.handleFunding.bind(this)}
                remove={this.removeFunder.bind(this)}
                showSection={this.state.showFunding}
                addHandler={this.addFunder.bind(this)}
                addGrant={this.addGrant.bind(this)}
                removeGrant={this.removeGrant.bind(this)}
              />
              <SubItem
                title={'License'}
                addable={true}
                incomingData={this.state.license}
                handler={this.handleLicense.bind(this)}
                remove={this.removeLicense.bind(this)}
                showSection={this.state.showLicense}
                addHandler={this.addLicense.bind(this)}
                freetoread={this.state.addInfo.freetolicense}
                errorLicenseStartDate={this.state.errors.licenseStartDate}
                makeDateDropDown={this.makeDateDropDown.bind(this)}
              />
              <SubItem
                title={'Related Items'}
                addable={true}
                incomingData={this.state.relatedItems}
                handler={this.handleRelatedItems.bind(this)}
                remove={this.removeRelatedItems.bind(this)}
                showSection={this.state.showRelatedItems}
                addHandler={this.addRelatedItems.bind(this)}
              />
              <SubItem
                title={'Additional Information'}
                addable={false}
                incomingData={this.state.addInfo}
                handler={this.handleAddInfo.bind(this)}
                showSection={this.state.showAdditionalInformation}
                makeDateDropDown={this.makeDateDropDown.bind(this)}
              />
              {this.props.crossmarkAuth &&
                <SubItem
                  title={'Crossmark'}
                  makeDateDropDown={this.makeDateDropDown}/>
              }
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
