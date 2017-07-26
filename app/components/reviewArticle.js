import React, { Component } from 'react'
import is from 'prop-types'
import _ from 'lodash'
import { stateTrackerII } from 'my_decorators'
import update from 'immutability-helper'
const Languages = require('../utilities/language.json')
import { ArchiveLocations } from '../utilities/archiveLocations'
const PublicationTypes = require('../utilities/publicationTypes.json')
const AppliesTo = require('../utilities/appliesTo.json')
const IdentifierTypes = require('../utilities/identifierTypes.json')
import objectSearch from '../utilities/objectSearch'
import articleReviewGenerator from './articleReviewGenerator'
import xmldoc from '../utilities/xmldoc'

export default class ArticleReview extends Component {

  static propTypes = {
    cartUpdate: is.func.isRequired,
    asyncGetItem: is.func
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
      this.props.asyncGetItem(this.props.issue.doi).then((issueData) => {

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

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log()
  //   if (nextState.issue !== this.state.issue) {
  //     return true
  //   }
  //   return false
  // }

  addToCart = () => {
    this.props.reduxControlModal({showModal:false})
    this.props.cartUpdate([this.props.reviewData])
  }

  wrapper = (reviewData, publicationMetaData) => {
    if (this.state.loaded) {
      return articleReviewGenerator(publicationMetaData, reviewData, this.state.issue, true, this.addToCart)
    } else {
      return <div></div>
    }
  }

  render () {
    const { reviewData, publication, publicationMetaData} = this.props
    return this.wrapper(reviewData, publicationMetaData)

  }
}
