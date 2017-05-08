import React, { Component } from 'react'
import Search from './Search'
import { stateTrackerII } from 'my_decorators'


export default class ManagementBar extends Component {
  render () {
    const { addDOIs, search, searchResults } = this.props
    return (
      <div className='management-bar'>
        <Search search={search} results={searchResults} addDOIs={addDOIs} />
        <button 
            className='addPublication' 
            onClick={this.props.openAddPublicationModal}
            >New Publication
         </button>
      </div>
    )
  }
}
