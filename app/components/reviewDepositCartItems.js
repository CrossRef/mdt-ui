import React, { Component } from 'react'
import is from 'prop-types'
import _ from 'lodash'
import { stateTrackerII } from 'my_decorators'
import { browserHistory } from 'react-router'
import ModalCard from './modalCard'
const Languages = require('../utilities/language.json')
const ArchiveLocations = require('../utilities/archiveLocations.json')
const PublicationTypes = require('../utilities/publicationTypes.json')
const AppliesTo = require('../utilities/appliesTo.json')
const IdentifierTypes = require('../utilities/identifierTypes.json')
import objectSearch from '../utilities/objectSearch'
import articleReviewGenerator from '../utilities/articleReviewGenerator'
import issueReviewGenerator from  '../utilities/issueReviewGenerator'

export default class DepositCartItemsReview extends Component {

  static propTypes = {
    item: is.object.isRequired,
    publication: is.object.isRequired,
    index: is.number.isRequired,
    reduxControlModal: is.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      showInfoSection: false
    }
  }

  componentDidMount () {
    if (this.props.index === 0) {
      this.toggleInfoSection()
    }
  }

  toggleInfoSection () {
    this.setState({
      showInfoSection: !this.state.showInfoSection
    })
  }

  gotoPage () {
    const { item, publication } = this.props
    if (item.type.toLowerCase() === 'article') {
      this.props.reduxControlModal({showModal: false})
      browserHistory.push(`/publications/${encodeURIComponent(publication.doi)}/addarticle/${encodeURIComponent(item.doi)}`)
    } else if (item.type.toLowerCase() === 'issue') {
      this.props.reduxControlModal({showModal: false})
      browserHistory.push(`/publications/${encodeURIComponent(publication.doi)}?modal=${encodeURIComponent(item.doi)}`)
    }
  }

  parseIssue (item, publication) {
    return (
      <div>
        {issueReviewGenerator(publication,item.content)}
      </div>
    )
  }

  parseArticle (item, publication) {
    return (
      <div>
        {articleReviewGenerator(publication,item.content)}
      </div>
    )
  }

  render () {
    const { item, publication } = this.props
    return (
        <div className='depositReviewItem'>
            <div className='itemTitle'>
              <div className='titleinnholder' onClick={() => {this.toggleInfoSection()}}>
                <span className={'arrowHolder' + (this.state.showInfoSection ? ' openArrowHolder' : '')}>
                    <img src="/images/AddArticle/Triangle.svg" />
                </span>
                <span>{item.title.title}</span>
              </div>
                <div className='addholder'>
                    <a onClick={()=>{this.gotoPage()}}>Edit</a>
                </div>
            </div>
            <div className={'itemInfo' + (this.state.showInfoSection ? ' showItemInfo' : ' hideItemInfo')}>
                {(item.type.toLowerCase() === 'article') ? this.parseArticle(item, publication) : this.parseIssue(item, publication)}
            </div>
        </div>
    )
  }
}
