import React, { Component } from 'react'
import { Link } from 'react-router'
import { stateTrackerII } from 'my_decorators'


export default class PublicationNav extends Component {
  render () {
    return (
      <div className='publications-nav'>
        <div className='publications-nav-contents'>
          <div className='links'>
            <Link to='/publications'>Publications</Link>
            <a href='#'>Deposit History</a>
            <a href='#'>Deposit Card</a>
          </div>
          <div className='user'>
            Testing
          </div>
        </div>
      </div>
    )
  }
}
