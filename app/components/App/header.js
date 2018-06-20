import React, { Component } from 'react'
import is from 'prop-types'

import NavBar from './navBar'
import { routes } from '../../routing'



export default class Header extends Component {
  static propTypes = {
    cart : is.array.isRequired,
    toast: is.object.isRequired,
    reduxClearToast: is.func.isRequired,
    reduxControlModal: is.func.isRequired,
    firstLogin: is.bool
  }

  render () {
    const path = window.location.pathname
    const isOnHome = path === routes.base
    var showNavBar = false
    if(String(path) !== routes.base) {
      showNavBar = true
    }

    return (
      <div className={'header' + (isOnHome ? ' large' : '')}>
        <div className='header-contents'>
          <a target='_blank' href="https://www.crossref.org/services/content-registration/">
            <img src="https://assets.crossref.org/logo/crossref-logo-landscape-200.svg" width="120" height="58" alt="Crossref logo"/>
          </a>
          <img className='second-logo-img' src={`${routes.images}/App/crossref-depositor-logo-200-BETA.svg`} />

        </div>
        { (showNavBar) &&
          <NavBar
            cart={this.props.cart}
            toast={this.props.toast}
            firstLogin={this.props.firstLogin}
            reduxControlModal={this.props.reduxControlModal}
            reduxClearToast={this.props.reduxClearToast}/> }
      </div>
    )
  }
}
