import React, { Component } from 'react'
import { stateTrackerII } from 'my_decorators'
import is from 'prop-types'

import PublicationsNav from './navBar'



export default class Header extends Component {
  static propTypes = {
    cart : is.array.isRequired,
    reduxControlModal : is.func.isRequired,
    reduxLogout: is.func.isRequired
  };

  render () {
    const isOnHome = this.props.path === '/mdt/'
    var showPublicationsNav = false
    if(String(this.props.path).startsWith('/mdt/publications') || String(this.props.path).startsWith('/mdt/cart') || String(this.props.path).startsWith('/mdt/deposit-history')) {
      showPublicationsNav = true
    }

    return (
      <div className={'header' + (isOnHome ? ' large' : '')}>
        <div className='header-contents'>
          <img src='images/App/crossref-content-registration-logo-200.svg' />
          <img className='second-logo-img' src='images/App/crossref-depositor-logo-200.svg' />
        </div>
        { (showPublicationsNav) && <PublicationsNav cart={this.props.cart} reduxControlModal={this.props.reduxControlModal} reduxLogout={this.props.reduxLogout} /> }
      </div>
    )
  }
}
