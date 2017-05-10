import React, { Component } from 'react'
import { stateTrackerII } from 'my_decorators'
import is from 'prop-types'

import PublicationsNav from './navBar'



export default class Header extends Component {
  static propTypes = {
    cart : is.array.isRequired,
    reduxControlModal : is.func.isRequired
  };

  render () {
    const isOnHome = this.props.path === '/'
    var showPublicationsNav = false
    if(String(this.props.path).startsWith('/publications') || String(this.props.path).startsWith('/cart')) {
      showPublicationsNav = true
    }

    return (
      <div className={'header' + (isOnHome ? ' large' : '')}>
        <div className='header-contents'>
          <img src='/images/App/Crossref_Logo_Stacked_RGB.svg' />
          <div className='header-logo-name'>Metadata Deposit Tool</div>
        </div>
        { (showPublicationsNav) && <PublicationsNav cart={this.props.cart} reduxControlModal={this.props.reduxControlModal} /> }
      </div>
    )
  }
}
