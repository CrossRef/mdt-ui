import React, { Component } from 'react'
import is from 'prop-types'
import { stateTrackerII } from 'my_decorators'

import SearchRecords from '../searchRecords'


export default class TitleBar extends Component {

  static propTypes = {
    publicationMessage: is.object.isRequired,
    asyncSearchRecords: is.func.isRequired,
    search: is.object.isRequired,
    asyncGetItem: is.func.isRequired,
    reduxControlModal: is.func.isRequired,
    asyncSubmitIssue: is.func.isRequired,
    publication: is.object.isRequired,
    asyncGetPublications: is.func.isRequired
  }

  render () {
    const { publicationMessage } = this.props
    const title = (publicationMessage.title || {}).title || ''

    return (<div className='publication-title'>
      <h1>{title}</h1>
      <SearchRecords
        search={this.props.search}
        pubTitle={title}
        publication={this.props.publication}

        reduxControlModal={this.props.reduxControlModal}

        asyncSubmitIssue={this.props.asyncSubmitIssue}
        asyncGetPublications={this.props.asyncGetPublications}
        asyncSearchRecords={this.props.asyncSearchRecords}
        asyncGetItem={this.props.asyncGetItem}
        />
    </div>)
  }
}
