import React, { Component } from 'react'

import articleReviewGenerator from '../Common/articleReviewGenerator'
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
      api.getItem(this.props.issue.doi || {title: this.props.issue.title, pubDoi: this.props.publication.message.doi}).then((issueData) => {

        this.setState({
          loaded: true,
          issue: issueData.message.contains[0].title
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
