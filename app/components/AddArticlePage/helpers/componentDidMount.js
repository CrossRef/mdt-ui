import React, { Component } from 'react'

import {xmldoc, compareDois} from '../../../utilities/helpers'
import * as api from '../../../actions/api'
import parseXMLArticle from '../../../utilities/parseXMLArticle'





export default async function () {
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

    validatedPayload.openSubItems = true

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

    this.setState(setStatePayload)
  } else /*if add mode*/ {
    this.setState({
      publication,
      issuePublication: publications[0],
      publicationMetaData,
      publicationXml
    })
  }
}