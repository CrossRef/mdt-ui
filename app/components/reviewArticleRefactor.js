import React, { Component } from 'react'
import is from 'prop-types'
import _ from 'lodash'
import { stateTrackerII } from 'my_decorators'

const Languages = require('../utilities/language.json')
import { ArchiveLocations } from '../utilities/archiveLocations'
const PublicationTypes = require('../utilities/publicationTypes.json')
const AppliesTo = require('../utilities/appliesTo.json')
const IdentifierTypes = require('../utilities/identifierTypes.json')
import objectSearch from '../utilities/objectSearch'
import articleReviewGenerator from '../utilities/articleReviewGenerator'

export default class ArticleReview extends Component {

  static propTypes = {
    cartUpdate: is.func.isRequired
  }

  constructor (props) {
    super(props)
  }

  addToCart = () => {
    this.props.reduxControlModal({showModal:false})
    this.props.cartUpdate([this.props.reviewData])
  }

  render () {
    const { reviewData, publication, publicationMetaData } = this.props
    return articleReviewGenerator(publicationMetaData, reviewData, true, this.addToCart.bind(this))

  }
}
