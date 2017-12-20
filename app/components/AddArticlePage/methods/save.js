import React, { Component } from 'react'
import {browserHistory} from 'react-router'
import { XMLSerializer, DOMParser } from 'xmldom'

import {compareDois, escapeString} from '../../../utilities/helpers'
import {routes} from '../../../routing'
import * as api from '../../../actions/api'
import articleXmlGenerator from '../../AddArticlePage/articleXmlGenerator'






export default async function (addToCart) {
  const {valid, validatedPayload} = await this.validation()

  validatedPayload.openSubItems = true
  validatedPayload.saving = true
  validatedPayload.focusedInput = ''

  if (valid) {
    const publication = this.state.publication

    const journalArticle = articleXmlGenerator(this.state, this.props.reduxForm)
    const journalDoc = new DOMParser().parseFromString(`<?xml version="1.0" encoding="UTF-8"?><crossref xmlns="http://www.crossref.org/xschema/1.1"><journal>${this.state.publicationXml}</journal></crossref>`)
    const journalElm = journalDoc.getElementsByTagName("journal")[0]
    journalElm.appendChild(journalArticle)
    const title = this.state.article.title

    const newRecord = {
      'title': {title: escapeString(title)},
      'date': new Date(),
      'doi': this.state.article.doi,
      'owner-prefix': this.state.ownerPrefix,
      'type': 'article',
      'mdt-version': this.state.version,
      'status': 'draft',
      'content': new XMLSerializer().serializeToString(journalDoc)
    }

    let savePub = publication

    if (this.state.issueDoi || this.state.issueTitle) {
      const issue = this.state.issue
      issue.contains = [newRecord]
      savePub.message.contains = [issue]

    } else { // not issue, so just put directly under the publication
      savePub.message.contains = [newRecord]
    }

    delete savePub.message.content

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

      this.setState(validatedPayload)
    }

  } else /*if not valid */{
    this.setState(validatedPayload)
    return false
  }
}