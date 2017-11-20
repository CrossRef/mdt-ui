import React, { Component } from 'react'
import is from 'prop-types'

import SearchRecords from './searchRecords'


export default class TitleBar extends Component {

  static propTypes = {
    ownerPrefix: is.string.isRequired,
    publication: is.shape({
      title: is.shape({
        title: is.string.isRequired
      }),
      status: is.string.isRequired,
      'message-type': is.string.isRequired,
      'message-version': is.string.isRequired,
      message: is.object.isRequired
    }).isRequired,
    search: is.object.isRequired,
    cart: is.array,

    reduxControlModal: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,

    asyncSearchRecords: is.func.isRequired,
  }

  render () {
    const { publication } = this.props
    const title = publication.message.title.title;

    return (<div className='publication-title'>
      <h1>{title}</h1>
      <SearchRecords
        ownerPrefix={this.props.ownerPrefix}
        search={this.props.search}
        pubTitle={title}
        publication={this.props.publication}
        cart={this.props.cart}

        reduxControlModal={this.props.reduxControlModal}
        reduxCartUpdate={this.props.reduxCartUpdate}

        asyncSearchRecords={this.props.asyncSearchRecords}
        />
    </div>)
  }
}
