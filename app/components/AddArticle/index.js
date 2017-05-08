import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import update from 'immutability-helper'
import SubItem from '../SubItem'
import client from '../../client'
import fetch from '../../utilities/fetch'
import checkDupeDOI from '../../utilities/dupeDOI'
import Switch from 'react-toggle-switch'
import _ from 'lodash'
import ReviewArticleCard from '../ReviewArticle'
import xmldoc from '../../utilities/xmldoc'
import objectSearch from '../../utilities/objectSearch'
import { stateTrackerII } from 'my_decorators'

export default class AddArticleCard extends Component {
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
        invalidurl: false
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
        similarityCheckURL:''
      }
    }
  }

  async componentWillReceiveProps (nextProps) {
    const { publication } = nextProps
    if ((publication.message) && (nextProps.mode === 'edit')) {
      if (publication.message.contains.length > 0) { // its an edit of article, else its new, also checks if its empty before doing any xml conversion
        this.setState({doiDisabled: true})

        const parsedArticle = xmldoc(publication.message.contains[0].content)

        console.log(parsedArticle)

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

        const addInfo = {
          archiveLocation: archive,
          language: language ? language : '',
          publicationType: publicationType ? publicationType : '',
          similarityCheckURL: similarityCheckURL ? similarityCheckURL : ''
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

        console.log(contributee)

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
      case 'article':
        this.handleChange (item)
    }
  }

  makeDateDropDown (ref, type, preset, validation, index, item, handler) {
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
        ref={ref}
        onChange={() => {
            this.dropDownHandler(index, item, handler)
          }
        }
        value={parseInt(preset)}
        >
        {s}
      </select>
    )
  }

  handleChange (e) {
    var article = {}
    for(var i in this.refs){
      article[i] = this.refs[i].value
    }

    this.setState({
      article: article
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
        similarityCheckURL: addInfo.refs.similarityCheckURL.value
      }})
    }, ()=>{
      // for some reason, I have to flow it back down to the children, where the others don't need it
      addInfo.refs['publicationType'].value = this.state.addInfo.publicationType
      addInfo.refs['language'].value = this.state.addInfo.language
      addInfo.refs['archiveLocation'].value = this.state.addInfo.archiveLocation
      addInfo.refs['similarityCheckURL'].value = this.state.addInfo.similarityCheckURL
    })
  }

  handleLicense (index, License) {
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

    return funders.length > 0 ? `<fr:program xmlns:fr="http://www.crossref.org/fundref.xsd">${funders.join('')}</fr:program>` : ``

  }

  getLicenseXML () {
      var licenses = this.getSubmitSubItems(this.state.license).map((license, i) => {
          var attributes = `<ai:license_ref applies_to="${license.appliesto}" start_date="${license.acceptedDateYear}-${license.acceptedDateMonth}-${license.acceptedDateDay}">${license.licenseurl}</ai:license_ref>`

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

  onSubmit (e) {
    e.preventDefault()

    this.validation((valid) => { // need it to be a callback because setting state does not happen right away
      if (!valid) {

        const props = this.props
        var publication = this.props.publication

        const state = this.state

        const metaData = `` // TODO: Publication information

        const journalIssue = `` // TODO: Issue information

        const publicationType = this.state.addInfo.publicationType
        const language = this.state.addInfo.language

        var archiveLocation = ``
        if (this.state.addInfo.archiveLocation.trim().length > 0) {
          archiveLocation = `<archive_locations><archive name="${this.state.addInfo.archiveLocation}"/></archive_locations>`
        }

        const journalArticle = `<journal_article${(language.length > 0) ? ` language="${language}"`:``}${(publicationType.length > 0) ? ` publication_type="${publicationType}"`:``}><titles>${state.article.title.length > 0 ? `<title>` + state.article.title.trim() + `</title>` : ``}${state.article.subtitle.length > 0 ? `<subtitle>` + state.article.subtitle.trim() + `</subtitle>` : ``}${state.article.originallanguagetitle.length > 0 ? `<original_language_title>` + state.article.originallanguagetitle.trim() + `</original_language_title>` : ``}${state.article.originallanguagetitlesubtitle.length > 0 ? `<subtitle>` + state.article.originallanguagetitlesubtitle.trim() + `</subtitle>` : ``}</titles>${this.getAcceptanceDateXML()}${(this.getContributorXML().length > 0) ? this.getContributorXML() : ``}${(state.article.abstract.trim().length > 0) && `<jats:abstract xmlns:jats="http://www.ncbi.nlm.nih.gov/JATS1"><jats:p>${state.article.abstract.trim()}</jats:p></jats:abstract>`}<publication_date media_type="online">${state.article.onlineDateYear.length > 0 ? `<year>${state.article.onlineDateYear}</year>`:``}${state.article.onlineDateMonth.length > 0 ? `<month>${state.article.onlineDateMonth}</month>`:``}${state.article.onlineDateDay.length > 0 ? `<day>${state.article.onlineDateDay}</day>`:``}</publication_date><publication_date media_type="print">${state.article.printDateYear.length > 0 ? `<year>${state.article.printDateYear}</year>`:``}${state.article.printDateMonth.length > 0 ? `<month>${state.article.printDateMonth}</month>`:``}${state.article.printDateDay.length > 0 ? `<day>${state.article.printDateDay}</day>`:``}</publication_date>${(this.getPagesXML().length > 0) ? this.getPagesXML() : ``}${(this.getPublisherItems().length > 0) ? this.getPublisherItems() : ``}${(this.getFunderXML().length > 0) ? this.getFunderXML() : ``}${(this.getLicenseXML().length > 0) ? this.getLicenseXML() : ``}${(this.getRelatedItemsXML().length > 0) ? this.getRelatedItemsXML() : ``}${archiveLocation}<doi_data><doi>${state.article.doi}</doi><resource>${state.article.url}</resource>${(this.getCollectionXML().length > 0) ? this.getCollectionXML() : ``}</doi_data></journal_article>`

        const journal = `<?xml version="1.0" encoding="UTF-8"?><crossref xmlns="http://www.crossref.org/xschema/1.1" xsi:schemaLocation="http://www.crossref.org/xschema/1.1 http://doi.crossref.org/schemas/unixref1.1.xsd"><journal>${journalArticle}</journal></crossref>`

        var newRecord = {
          'title': {'title': this.state.article.title},
          'doi': this.state.article.doi,
          'type': 'article',
          'mdt-version': this.state.version,
          'status': 'draft',
          'content': journal.replace(/(\r\n|\n|\r)/gm,'')
        }

        publication.message.contains = [newRecord]
        fetch(`http://mdt.crossref.org/mdt/v1/work`, { // using isomorphic-fetch directly here, React is NOT passing the action everytime
            method: 'post',
            headers: client.headers,
            body: JSON.stringify(publication)
          }
        ).then(() =>
          fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${this.state.article.doi}`, { headers: client.headers })
          .then(doi => doi.json())
          .then((dois) => {
            this.setState({
              dois
            })

            // redirect
            browserHistory.push(`/publications/${encodeURIComponent(publication.message.doi)}`)
          }))
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
        errorStates = {
          title: {$set: (this.state.article.title.length === 0) },
          doi: {$set: (this.state.article.doi.length === 0) },
          printDateYear: {$set: (this.state.article.printDateYear.length === 0) },
          onlineDateYear: {$set: (this.state.article.onlineDateYear.length === 0) },
          url: {$set: (this.state.article.url.length === 0) },
          invalidurl: {$set: !this.validateURL() && (this.state.article.url.length > 0) },
          dupedoi: {$set: this.state.doiDisabled ? false : isDupe },
          invaliddoi: {$set: ((this.state.article.doi.length > 0) && (isValid ? isValid : !this.isValidDOI()))}
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

  render () {
    const error = (this.props.addArticle || {}).error
    const { publication, publicationMetaData } = this.props
    return (
      <div>
        <ReviewArticleCard reviewData={this.state} publication={publication} publicationMetaData = {publicationMetaData} />
        <div className={'addarticlecard' + (error ? ' invalid' : '')}>
          <form className='addArticleForm' onSubmit={this.onSubmit.bind(this)}>
            <div className='articleInnerForm'>
              <div className='topbar'>
                <div className='titleholder'>
                  <div className='titleinnerholder'>
                    <div className='titleIconHolder'>
                      <img src='/images/AddArticle/Asset_Icons_White_Write.svg' />
                    </div>
                    <div className='articletitle'>
                      {this.state.article.title}
                    </div>
                  </div>
                </div>
              </div>
              <div className='body'>
                <div className='row infohelper'>
                  <div className='fieldHolder'>
                    <div className='fieldinnerholder fulllength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>* Indicates Required fields</div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                    <div className='fieldinnerholder fulllength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Article Title (Required)</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder'>
                          <div className='required height64'>
                            <span>*</span>
                          </div>
                        </div>
                        <div className='field'>
                          <textarea
                              className={'height64' + ((this.state.errors.title) ? ' fieldError': '')}
                              type='text'
                              ref='title'
                              onChange={this.handleChange.bind(this)}
                              value={this.state.article.title}
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
                                Please provide a Title that fully describes your Article
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
                                  this.state.errors.doi ||
                                  this.state.errors.url ||
                                  this.state.errors.title ||
                                  this.state.errors.printDateYear ||
                                  this.state.errors.onlineDateYear
                                ) &&
                                  <div><b>Required.</b><br />Please provide required informaton.</div>
                                }
                                {(this.state.errors.invalidurl) &&
                                  <div><b>Invalid URL.</b><br />Please check your URL.</div>
                                }
                                {(this.state.errors.invaliddoi) &&
                                  <div><b>Invalid DOI.</b><br />Please check your DOI (10.xxxx/xx...).</div>
                                }
                                {(this.state.errors.dupedoi) &&
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
                  <div className='toggleButton' onClick={this.toggleFields.bind(this)}>
                    <span className={'arrowHolder' + (this.state.showOptionalTitleData ? ' openArrowHolder' : '')}>
                      <img src="/images/AddArticle/DarkTriangle.svg" />
                    </span>
                    <span>
                      Optional Title Data
                    </span>
                    </div>
                    <div className={'hiddenFields' + (this.state.showOptionalTitleData ? 'showOptionalTitle':'')}>
                      <div className='fieldHolder'>
                        <div className='fieldinnerholder fulllength'>
                          <div className='labelholder'>
                            <div></div>
                            <div className='labelinnerholder'>
                              <div className='label'>Subtitle (Optional)</div>
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
                                  ref='subtitle'
                                  onChange={this.handleChange.bind(this)}
                                  value={this.state.article.subtitle}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='fieldHolder'>
                        <div className='fieldinnerholder fulllength'>
                          <div className='labelholder'>
                            <div></div>
                            <div className='labelinnerholder'>
                              <div className='label'>Original Language Title (Optional)</div>
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
                                  ref='originallanguagetitle'
                                  onChange={this.handleChange.bind(this)}
                                  value={this.state.article.originallanguagetitle}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='fieldHolder'>
                        <div className='fieldinnerholder fulllength'>
                          <div className='labelholder'>
                            <div></div>
                            <div className='labelinnerholder'>
                              <div className='label'>Original Language Title Subtitle</div>
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
                                  ref='originallanguagetitlesubtitle'
                                  onChange={this.handleChange.bind(this)}
                                  value={this.state.article.originallanguagetitlesubtitle}
                              />
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
                          <div className='label'>Article DOI (Required)</div>
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
                              className={'height32' + ((this.state.errors.doi || this.state.errors.dupedoi || this.state.errors.invaliddoi) ? ' fieldError': '')}
                              type='text'
                              ref='doi'
                              onChange={this.handleChange.bind(this)}
                              value={this.state.article.doi}
                              disabled={this.state.doiDisabled}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Article URL (Required)</div>
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
                              className={'height32' + ((this.state.errors.url) ? ' fieldError': '')}
                              type='text'
                              ref='url'
                              onChange={this.handleChange.bind(this)}
                              value={this.state.article.url}
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
                        <div className='requiredholder dateselectrequire'>
                          <div className='required height32'>
                            <span>*</span>
                          </div>
                        </div>
                        <div className='field'>
                          <div className='datepickerholder'>
                            <div className='dateselectholder'>
                              <div>Year (*)</div>
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
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Online Date</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder dateselectrequire'>
                          <div className='required height32'>
                            <span>*</span>
                          </div>
                        </div>
                        <div className='field'>
                          <div className='datepickerholder'>
                            <div className='dateselectholder'>
                              <div>Year (*)</div>
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
                        <div></div>
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
                        <div></div>
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
                              className='height32'
                              type='text'
                              ref='firstPage'
                              onChange={this.handleChange.bind(this)}
                              value={this.state.article.firstPage}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
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
                              ref='lastPage'
                              onChange={this.handleChange.bind(this)}
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
                        <div></div>
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
                              ref='locationId'
                              onChange={this.handleChange.bind(this)}
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
                              ref='abstract'
                              onChange={this.handleChange.bind(this)}
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
              />
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
