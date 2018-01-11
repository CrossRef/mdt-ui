import React, { Component } from 'react'

import {xmldoc, compareDois} from '../../../utilities/helpers'
import * as api from '../../../actions/api'
import parseXMLArticle from '../../../utilities/parseXMLArticle'





export default async function loadArticle () {

  const { pubDoi } = this.props.routeParams;
  const getItems = []

  const isEditOrDuplicate = this.state.mode === 'edit'
  const isNewArticle = this.state.mode === 'add'
  const isDuplicate = this.state.isDuplicate

  //If this is an edit or a duplicate, get Article's content
  if(isEditOrDuplicate) {
    getItems.push(api.getItem(this.state.editArticleDoi))
  }

  //If this is a new article or a duplicate, get most updated publication data from draft works
  if(isNewArticle || isDuplicate) {
    getItems.push(api.getItem(pubDoi))
  }

  //Data returns as 1 or 2 publications (2 publications in case of duplicate)
  const publications = await Promise.all(getItems)

  //If returned 2 publications, publication content is in the 2nd item
  const publicationData = publications[1] || publications[0]

  //If this is an edit or duplicate, Article content and hierarchy found in 1st publication
  const fullHierarchy = publications[0]


  //Build publication metadata and xml
  let publicationXml
  if(isNewArticle || isDuplicate) {
    publicationXml = publicationData.message.content.substring(
      publicationData.message.content.indexOf('<journal_metadata'),
      publicationData.message.content.indexOf('</journal_metadata>') + 19
    )

  } else {
    let article = fullHierarchy.message.contains[0].type === 'article' ?
      fullHierarchy.message.contains[0]
      : fullHierarchy.message.contains[0].contains[0]

    publicationXml = article.content.substring(
      article.content.indexOf('<journal_metadata'),
      article.content.indexOf('</journal_metadata>') + 19
    )
  }

  const publicationMetaData = xmldoc(publicationXml)


  //In case of duplicate, copy updated publicationData info into the fullHierarchy object which will be used to submit
  if(isDuplicate) {
    delete fullHierarchy.message.content
    fullHierarchy.message.date = publicationData.message.date
    fullHierarchy.message.doi = publicationData.message.doi || pubDoi
    fullHierarchy.message['owner-prefix'] = publicationData.message['owner-prefix'] || this.state.ownerPrefix
    fullHierarchy.message['mdt-version'] = publicationData.message['mdt-version'] || '0'
  }


  //Assign Publication object with Article as child. If article has issue parent, need to re-structure it (remove issue and place article under publication, saving issue separately)
  let articleUnderPub = fullHierarchy
  let issue

  if (this.state.issueDoi || this.state.issueTitle) {

    if(isNewArticle) {
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

    //Assign and adjust issue metadata
    issue = fullHierarchy.message.contains[0]
    delete issue.content
    issue['mdt-version'] = issue['mdt-version'] || '1'
    issue['owner-prefix'] = issue['owner-prefix'] || this.state.ownerPrefix
    issue.date = issue.date || new Date()
  }


  //Parse article xml and prepare setState data
  if(isEditOrDuplicate) {

    let setStatePayload = {}

    if(this.state.issueDoi || this.state.issueTitle) {
      setStatePayload.issueTitle = fullHierarchy.message.contains[0].title
    }

    const parsedArticle = parseXMLArticle(articleUnderPub.message.contains[0].content)
    const savedArticleState = articleUnderPub.message.contains[0].state || {}

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
      issue,
      publicationMetaData,
      publicationXml,
      doiDisabled,
      version: String( Number(articleUnderPub.message.contains[0]['mdt-version'] || 0) + 1),
      addInfo: parsedArticle.addInfo,
      article: parsedArticle.article,
      contributors: parsedArticle.contributors,
      funding: parsedArticle.funding,
      license: parsedArticle.license,
      references: parsedArticle.references,
      relatedItems: parsedArticle.relatedItems,
      openItems: parsedArticle.openItems,
      ...validatedPayload
    }

    if(savedArticleState.archiveLocation) {
      setStatePayload.addInfo.archiveLocation = savedArticleState.archiveLocation
      setStatePayload.openItems.addInfo = true
    }
    if(savedArticleState.freetolicense) {
      setStatePayload.article.freetolicense = savedArticleState.freetolicense
      setStatePayload.openItems.Licenses = true
    }

    this.setState(setStatePayload)

  } else /*if new article*/ {
    this.setState({
      publication: articleUnderPub,
      issue,
      publicationMetaData,
      publicationXml
    })
  }
}