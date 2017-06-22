import React, { Component } from 'react'
import is from 'prop-types'

import SearchRecords from '../searchRecords'


export default class TitleBar extends Component {

  static propTypes = {
    publicationMessage: is.object.isRequired,
    asyncSearchRecords: is.func.isRequired,
    search: is.object.isRequired,
    asyncGetItem: is.func.isRequired,
    reduxControlModal: is.func.isRequired,
    postIssue: is.func.isRequired,
    publication: is.object.isRequired,
    asyncGetPublications: is.func.isRequired
  }

  render () {
    const { publicationMessage } = this.props
    const title = (publicationMessage.title || {}).title || ''

    return (<div className='publication-title'>
      <h1>{title}</h1>
      <SearchRecords
        reduxControlModal={this.props.reduxControlModal}
        asyncSearchRecords={this.props.asyncSearchRecords}
        search={this.props.search} pubTitle={title}
        asyncGetItem={this.props.asyncGetItem}
        publication={this.props.publication}
        postIssue={this.props.postIssue}
        asyncGetPublications={this.props.asyncGetPublications}/>
    </div>)
  }
}
