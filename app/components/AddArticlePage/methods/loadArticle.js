import React, { Component } from 'react'

import {xmldoc, compareDois} from '../../../utilities/helpers'
import * as api from '../../../actions/api'
import parseXMLArticle from '../../../utilities/parseXMLArticle'




export default async function loadArticle () {
  const { pubDoi, issueId } = this.props.routeParams;
  const getItems = []

  const isEditOrDuplicate = this.state.mode === 'edit'
  const isNewArticle = this.state.mode === 'add'
  const isDuplicate = this.state.isDuplicate
  const idObj = issueId?JSON.parse(issueId):{}
  const issueTitleId = JSON.stringify({issue: idObj.issue, volume: idObj.volume, title: idObj.title})
  //We need to get the articles content if it isn't new
  if(isEditOrDuplicate) {
    getItems.push(api.getItem(this.state.editArticleDoi))
  }else if(issueId){ // if we're adding an article under an issue, we need the issue info
    getItems.push(api.getItem({doi:this.state.issueDoi , title: issueTitleId, pubDoi:pubDoi}))
  }
  // always get the publication directly
  getItems.push(api.getItem(pubDoi,false,true))

  //Data returns as 1 or 2 publications (2 publications in case of duplicate)
  const publications = await Promise.all(getItems)

  //If returned 2 publications, publication content is in the 2nd item
  const publicationData = publications[1] || publications[0]

  //If this is an edit or duplicate, Article content and hierarchy found in 1st publication
  const fullHierarchy = publications[0]


  //Build publication metadata and xml
  // since we always get the publication, just set that
  let publicationXml = publicationData.message.content.substring(	
    publicationData.message.content.indexOf('<journal_metadata'),	
    publicationData.message.content.indexOf('</journal_metadata>') + 19	
  )
  if (!isNewArticle){ // don't try to look inside new articles
    let article = fullHierarchy.message.contains[0].type === 'article' ?
      fullHierarchy.message.contains[0]
      : fullHierarchy.message.contains[0].contains[0]
  
  //if there is a timestamp, then we want to use the journal found in the article (deposited).
    if (article){
      if (article['deposit-timestamp'] !== "" && article.content.indexOf('<journal_metadata')>0) {
        publicationXml = article.content.substring(
          article.content.indexOf('<journal_metadata'),
          article.content.indexOf('</journal_metadata>') + 19
        )
      }
    }
  }
  const publicationMetaData = xmldoc(publicationXml)

  //In case of duplicate, copy updated publicationData info into the fullHierarchy object which will be used to submit
  if(isDuplicate) {
    delete fullHierarchy.message.content
    fullHierarchy.message.date = publicationData.message.date
    fullHierarchy.message.doi = publicationData.message.doi || pubDoi
    fullHierarchy.message['owner-prefix'] = publicationData.message['owner-prefix'] || this.state.publicationOwnerPrefix
    fullHierarchy.message['mdt-version'] = publicationData.message['mdt-version'] || '0'
  }


  //Assign Publication object with Article as child. If article has issue parent, need to re-structure it (remove issue and place article under publication, saving issue separately)
  let articleUnderPub = fullHierarchy
  let issue = (!isNewArticle && fullHierarchy.message.contains[0].type === 'issue') ? fullHierarchy.message.contains[0] : undefined

  if (issue || this.state.issueDoi || this.state.issueTitle) {

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
    issue['owner-prefix'] = issue['owner-prefix'] || this.state.publicationOwnerPrefix
    issue.date = issue.date || new Date()
  }


  //Parse article xml and prepare setState data
  if(isEditOrDuplicate) {

    let setStatePayload = {}

    if(this.state.issueDoi || this.state.issueTitle) {
      setStatePayload.issueTitle = fullHierarchy.message.contains[0].title
    }

    const article = articleUnderPub.message.contains[0]
    var parsedArticle = parseXMLArticle(article.content)
    parsedArticle.article['owner-prefix'] = article['owner-prefix']

    const savedArticleState = article.state || {}

    let reduxForm
    if(parsedArticle.crossmark) {
      reduxForm = parsedArticle.crossmark.reduxForm
      setStatePayload.crossmarkCards = parsedArticle.crossmark.showCards
    }

    const isDuplicate = this.props.location.state ? !!this.props.location.state.duplicateFrom : false
    let doiDisabled = !isDuplicate
    if(isDuplicate) {
      parsedArticle.article.doi = this.state.publicationOwnerPrefix
    }

    const {validatedPayload} = await this.validation(parsedArticle, reduxForm, doiDisabled)

    validatedPayload.openSubItems = true

    setStatePayload = {
      ...setStatePayload,
      publication: articleUnderPub,
      depositTimestamp: (isDuplicate||isNewArticle)?'':article['deposit-timestamp'],
      issue,
      issueDoi: issue ? issue.doi : undefined,
      issueTitle: issue ? issue.title : undefined,
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