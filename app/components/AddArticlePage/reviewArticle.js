import React, { Component } from 'react'
import is from 'prop-types'
import update from 'immutability-helper'

import {objectSearch, xmldoc} from '../../utilities/helpers'
import articleReviewGenerator from './articleReviewGenerator'
import * as api from '../../actions/api'


export default class ArticleReview extends Component {

  static propTypes = {

  }

  constructor (props) {
    super(props)
    this.state = {
      load: false,
      issue: {
        title: undefined,
        issue: undefined,
        volume: undefined
      }
    }

  }

  componentWillMount () {
    if (this.props.issue) {
      api.getItem(this.props.issue.doi).then((issueData) => {

        const message = issueData.message
        const Issue = message.contains[0]
        const parsedIssue = xmldoc(Issue.content);

        const issueTitle = objectSearch(parsedIssue, 'title') ? objectSearch(parsedIssue, 'title') : ''
        const issueNumber = objectSearch(parsedIssue, 'issue') ? objectSearch(parsedIssue, 'issue') : ''
        const journal_volume = objectSearch(parsedIssue, 'journal_volume')
        var theVolume = ''
        if (journal_volume) {
          theVolume = objectSearch(journal_volume, 'volume') ? objectSearch(journal_volume, 'volume') : ''
        }
        this.setState({
          loaded: true,
          issue: update(this.state.issue, {$set: {
            title: issueTitle,
            issue: issueNumber,
            volume: theVolume
          }})
        })

      })
    } else this.setState({loaded: true})
  }


  addToCart = (e) => {
    this.props.reduxControlModal({showModal:false})
    this.props.submit(e);
  }


  render () {
    const { reviewData, publicationMetaData} = this.props
    if (this.state.loaded) {
      return articleReviewGenerator(publicationMetaData, reviewData, this.state.issue, true, this.addToCart)
    } else {
      return <div></div>
    }

  }
}
