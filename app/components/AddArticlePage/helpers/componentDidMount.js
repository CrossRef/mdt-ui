import React, { Component } from 'react'

import {xmldoc, compareDois} from '../../../utilities/helpers'
import * as api from '../../../actions/api'
import parseXMLArticle from '../../../utilities/parseXMLArticle'





export default async function () {

  const { pubDoi } = this.props.routeParams;
  const getItems = []

  //If this is an edit or a duplicate, get Article's content
  if(this.state.mode === 'edit') {
    getItems.push(api.getItem(this.state.editArticleDoi))
  }

  //Get publication content
  const checkForAcceptedPub = this.state.mode === 'edit'
  getItems.push(api.getItem(pubDoi, checkForAcceptedPub).catch(e => api.getItem(pubDoi)))

  //Data returns as 1 or 2 publications (2 publications in case of edit / duplicate)
  const publications = await Promise.all(getItems)

  //If returned 2 publications, publication content is in the 2nd item, otherwise it is in the first
  const publicationData = publications[1] || publications[0]

  //If this is an edit, Article content and hierarchy found in 1st publication
  const fullHierarchy = publications[0]


  //Build publication metadata and xml
  let publMeta = publicationData.message.content
  const publicationMetaData = publMeta ? xmldoc(publMeta) : {}

  const publicationXml = publMeta.substring(publMeta.indexOf('<journal_metadata>'), publMeta.indexOf('</Journal>'))


  //Update publication data in publication object to be saved to state
  if(this.state.mode === 'edit') {
    delete fullHierarchy.message.content
    fullHierarchy.message.date = publicationData.message.date
    fullHierarchy.message.doi = fullHierarchy.message.doi || pubDoi
    fullHierarchy.message['owner-prefix'] = fullHierarchy.message['owner-prefix'] || this.state.ownerPrefix
    fullHierarchy.message['mdt-version'] = fullHierarchy.message['mdt-version'] || '0'
  }

  //Designate publication object with Article as child
  //If article has issueParent, need to build two publications, one where Article is under the publication, and one with the full hierarchy including the issue
  let articleUnderPub
  let issuePublication

  if (this.state.issueDoi || this.state.issueTitle) {

    if(this.state.mode === 'add') {
      //New article means publicationData includes all records and need to locate the correct issue
      fullHierarchy.message.contains[0] = fullHierarchy.message.contains.find((item)=>{
        if(item.type !== 'issue') {
          return false
        }
        return compareDois(this.state.issueDoi, item.doi) || JSON.stringify(this.state.issueTitle) === JSON.stringify(item.title)
      })
    }

    articleUnderPub = {
      ...fullHierarchy,
      message: {
        ...fullHierarchy.message,
        contains: [fullHierarchy.message.contains[0].contains[0]]
      }
    }

    issuePublication = fullHierarchy
    const issue = issuePublication.message.contains[0]
    delete issue.content
    issue['mdt-version'] = issue['mdt-version'] || '1'
    issue['owner-prefix'] = issue['owner-prefix'] || this.state.ownerPrefix
    issue.date = issue.date || new Date()
  }

  else {
    //No issue parent, publication object can be full hierarchy
    articleUnderPub = fullHierarchy
  }

  //Parse article xml and prepare setState data
  if(this.state.mode === 'edit') {

    let setStatePayload = {}

    if(this.state.issueDoi || this.state.issueTitle) {
      setStatePayload.issueTitle = fullHierarchy.message.contains[0].title
    }

    const parsedArticle = parseXMLArticle(articleUnderPub.message.contains[0].content)

    let reduxForm
    if(parsedArticle.crossmark) {
      reduxForm = parsedArticle.crossmark.reduxForm
      setStatePayload.crossmarkCards = parsedArticle.crossmark.showCards
    }

    const isDuplicate = this.props.location.state ? !!this.props.location.state.duplicateFrom : false
    let doiDisabled = !isDuplicate
    if(isDuplicate) {
      parsedArticle.article.doi = this.state.ownerPrefix
    }

    const {validatedPayload} = await this.validation(parsedArticle, reduxForm, doiDisabled)

    validatedPayload.openSubItems = true

    setStatePayload = {
      ...setStatePayload,
      publication: articleUnderPub,
      issuePublication,
      publicationMetaData,
      publicationXml,
      doiDisabled,
      version: String( Number(articleUnderPub.message.contains[0]['mdt-version'] || 0) + 1),
      addInfo: parsedArticle.addInfo,
      article: parsedArticle.article,
      contributors: parsedArticle.contributors,
      funding: parsedArticle.funding,
      license: parsedArticle.license,
      relatedItems: parsedArticle.relatedItems,
      openItems: parsedArticle.openItems,
      ...validatedPayload
    }

    this.setState(setStatePayload)

  } else /*if new article*/ {
    this.setState({
      publication: articleUnderPub,
      issuePublication,
      publicationMetaData,
      publicationXml
    })
  }
}