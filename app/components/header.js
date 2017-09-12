import React, { Component } from 'react'
import { stateTrackerII } from 'my_decorators'
import is from 'prop-types'

import PublicationsNav from './navBar'
import { routes } from '../routing'



export default class Header extends Component {
  static propTypes = {
    cart : is.array.isRequired,
    cartToast: is.object.isRequired,
    reduxClearCartToast: is.func.isRequired
  }

  render () {
    const path = window.location.pathname
    const isOnHome = path === routes.base
    var showPublicationsNav = false
    if(String(path) !== routes.base) {
      showPublicationsNav = true
    }

    return (
      <div className={'header' + (isOnHome ? ' large' : '')}>
        <div className='header-contents'>
          <a target='_blank' href="https://www.crossref.org/services/content-registration/"><img src={`${routes.images}/App/crossref-content-registration-logo-200.svg`} /></a>
          <img className='second-logo-img' src={`${routes.images}/App/crossref-depositor-logo-200.svg`} />
        </div>
        { (showPublicationsNav) && <PublicationsNav cart={this.props.cart} cartToast={this.props.cartToast} reduxClearCartToast={this.props.reduxClearCartToast}/> }
      </div>
    )
  }
}
