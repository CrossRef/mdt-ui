import React, { Component } from 'react'
import is from 'prop-types'
import update from 'immutability-helper'
import _ from 'lodash'
import { stateTrackerII } from 'my_decorators'

import Listing from './listing'
import Filter from './filter'
import ActionBar from './actionBar'
import TitleBar from './titleBar'

@stateTrackerII
export default class Publication extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    publication: is.shape({
      status: is.string.isRequired,
      'message-type': is.string.isRequired,
      'message-version': is.string.isRequired,
      message: is.object.isRequired
    }).isRequired,
    handle: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    fetchIssue: is.func.isRequired,
    postIssue: is.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      toDepositCartItems: []
    }
  }

  handleAddToList (item) {
    var toDepositCartItems = this.state.toDepositCartItems
    item.article.pubDoi = this.props.publication.message.doi;
    toDepositCartItems.push(item)
    this.setState({
      toDepositCartItems: update(this.state.toDepositCartItems, {$set: toDepositCartItems })
    })
  }

  handleRemoveFromList(item) {
    var toDepositCartItems = this.state.toDepositCartItems
    toDepositCartItems.splice(toDepositCartItems.indexOf(item),1)
    this.setState({
      toDepositCartItems: update(this.state.toDepositCartItems, {$set: toDepositCartItems })
    })
  }

  handleAddCart = () => {
    for(var i=0; i<this.state.toDepositCartItems.length; i++){
      this.props.reduxCartUpdate([this.state.toDepositCartItems[i].article])
    }
  }

  render () {
    const { publication, handle, reduxControlModal } = this.props
    const publicationMessage = publication.message || emptyObject
    const contains = publicationMessage.contains || emptyArray
    const doi = publicationMessage.doi
    return (
      <div className='publication'>
        <Filter />
        <TitleBar publicationMessage={publicationMessage} />
        <ActionBar doi={doi} publication={publication} handle={handle} reduxControlModal={reduxControlModal} handleAddCart={this.handleAddCart}  />
        <div className='publication-children'>
          {contains.length ?
            <Listing
              handle={this.props.handle}
              publication={publication}
              publicationDoi={doi}
              publicationMessage={publicationMessage}
              handleAddCart={this.handleAddCart.bind(this)}
              handleRemoveFromList={this.handleRemoveFromList.bind(this)}
              handleAddToList={this.handleAddToList.bind(this)}
              fetchIssue={this.props.fetchIssue}
              postIssue={this.props.postIssue}
              triggerModal={this.props.triggerModal}
            /> : <div className='empty-message'>No articles, please create one!</div>}
        </div>
      </div>
    )
  }
}

const emptyObject = {};
const emptyArray = [];
