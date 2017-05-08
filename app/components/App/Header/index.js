import React, { Component } from 'react'
import PublicationsNav from '../../Publications/Nav'
import { stateTrackerII } from 'my_decorators'


export default class Header extends Component {
  render () {
    const isOnHome = this.props.path === '/'
    const showPublicationsNav = this.props.path.startsWith('/publications')
    return (
      <div className={'header' + (isOnHome ? ' large' : '')}>
        <div className='header-contents'>
          <img src='/images/App/Crossref_Logo_Stacked_RGB.svg' />
          <div className='header-logo-name'>Metadata Deposit Tool</div>
        </div>
        { showPublicationsNav && <PublicationsNav /> }
      </div>
    )
  }
}
