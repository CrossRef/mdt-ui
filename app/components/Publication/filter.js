import React, { Component } from 'react'
import { Link } from 'react-router'
import { stateTrackerII } from 'my_decorators'


export default class PublicationFilter extends Component {
  render () {
    return (<div className='publication-header'>
      <div className='publication-status-selector'>
        <Link className='selected'>All</Link>
        <Link>Draft</Link>
        <Link>Accepted</Link>
        <Link>Failed</Link>
      </div>
    </div>)
  }
}
