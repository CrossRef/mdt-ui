import React, { Component } from 'react'
import { stateTrackerII } from 'my_decorators'
import is from 'prop-types'

import NavBar from './navBar'
import { routes } from '../../routing'



export default class Header extends Component {
  static propTypes = {
    cart : is.array.isRequired,
    toast: is.object.isRequired,
    reduxClearToast: is.func.isRequired
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
          <a target='_blank' href="https://www.crossref.org/services/content-registration/"><img src={`${routes.images}/App/crossref-content-registration-logo-200.svg`} /></a>
          <img className='second-logo-img' src={`${routes.images}/App/crossref-depositor-logo-200.svg`} />
        </div>
        { (showNavBar) && <NavBar cart={this.props.cart} toast={this.props.toast} reduxClearToast={this.props.reduxClearToast}/> }
      </div>
    )
  }
}
