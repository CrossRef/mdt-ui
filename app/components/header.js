import React, { Component } from 'react'
import { stateTrackerII } from 'my_decorators'
import is from 'prop-types'

import PublicationsNav from './navBar'
import { routes } from '../routing'



export default class Header extends Component {
  static propTypes = {
    cart : is.array.isRequired,
    reduxControlModal : is.func.isRequired,
    reduxLogout: is.func.isRequired
  };

  render () {
    const isOnHome = this.props.path === routes.base
    var showPublicationsNav = false
    if(String(this.props.path).startsWith(routes.publications) || String(this.props.path).startsWith(routes.depositCart) || String(this.props.path).startsWith(routes.depositHistory)) {
      showPublicationsNav = true
    }

    return (
      <div className={'header' + (isOnHome ? ' large' : '')}>
        <div className='header-contents'>
          <a target='_blank' href="https://www.crossref.org/services/content-registration/"><img src={`${routes.images}/App/crossref-content-registration-logo-200.svg`} /></a>
          <img className='second-logo-img' src={`${routes.images}/App/crossref-depositor-logo-200.svg`} />
        </div>
        { (showPublicationsNav) && <PublicationsNav cart={this.props.cart} reduxControlModal={this.props.reduxControlModal} reduxLogout={this.props.reduxLogout} /> }
      </div>
    )
  }
}
