import React, { Component } from 'react'
import Listing from './Listing'
import Filter from './Filter'
import ActionBar from './ActionBar'
import TitleBar from './TitleBar'
import { stateTrackerII } from 'my_decorators'

export default class Publication extends Component {
  render () {
    const { doi, handle } = this.props
    const doiMessage = doi.message || {}
    const contains = doiMessage.contains || []
    const id = doiMessage.doi
    return (
      <div className='publication'>
        <Filter />
        <TitleBar doi={doi} />
        <ActionBar doi={id} doiMessage={doi} handle={handle} />
        <div className='publication-children'>
          {contains.length ? <Listing doi={doi} /> : <div className='empty-message'>No articles, please create one!</div>}
        </div>
      </div>
    )
  }
}
