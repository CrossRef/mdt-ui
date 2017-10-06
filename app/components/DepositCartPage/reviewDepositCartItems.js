import React, { Component } from 'react'
import is from 'prop-types'
import { browserHistory } from 'react-router'

import articleReviewGenerator from '../AddArticlePage/articleReviewGenerator'
import issueReviewGenerator from  '../AddIssueModal/issueReviewGenerator'
import {routes} from '../../routing'


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
    const { item, publication, issue } = this.props
    if (item.type.toLowerCase() === 'article') {
      this.props.reduxControlModal({showModal: false})
      if (issue) {
        browserHistory.push(`${routes.publications}/${encodeURIComponent(publication.doi)}/${encodeURIComponent(issue)}/addarticle/${encodeURIComponent(item.doi)}`)
      } else {
        browserHistory.push(`${routes.publications}/${encodeURIComponent(publication.doi)}/addarticle/${encodeURIComponent(item.doi)}`)
      }
    } else if (item.type.toLowerCase() === 'issue') {
      this.props.reduxControlModal({
        showModal: false
      })
      //Change this to open modal with correct issue DOI
      browserHistory.push(`${routes.publications}/${encodeURIComponent(publication.doi)}?modal=${encodeURIComponent(item.doi)}`)
    }
  }

  parseIssue (item, publication) {
    //need to get issue content, to tell if there is validation needs to be corrected
    return (
      <div>
        {issueReviewGenerator(publication,item.content)}
      </div>
    )
  }

  parseArticle (item, publication, parentIssue) {
    return (
      <div>
        {articleReviewGenerator(publication, item.content, parentIssue)}
      </div>
    )
  }

  render () {
    const { item, publication, parentIssue } = this.props
    return (
        <div className='depositReviewItem'>
            <div className='itemTitle'>
              <div className='titleinnholder' onClick={() => {this.toggleInfoSection()}}>
                <span className={'arrowHolder' + (this.state.showInfoSection ? ' openArrowHolder' : '')}>
                    <img src={`${routes.images}/AddArticle/Triangle.svg`} />
                </span>
                <span>{item.title.title || `Issue ${item.title.issue || 'NA'}, Volume ${item.title.volume || 'NA'}`}</span>
              </div>
                <div className='addholder'>
                    <a onClick={()=>{this.gotoPage()}}>Edit</a>
                </div>
            </div>
            <div className={'itemInfo' + (this.state.showInfoSection ? ' showItemInfo' : ' hideItemInfo')}>
                {(item.type.toLowerCase() === 'article') ? this.parseArticle(item, publication, parentIssue) : this.parseIssue(item, publication)}
            </div>
        </div>
    )
  }
}