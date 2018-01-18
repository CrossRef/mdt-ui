import React, { Component } from 'react'
import is from 'prop-types'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import { ToastContainer, ToastMessageAnimated } from "react-toastr"

import {pascaleCase} from '../../utilities/helpers'
import { routes } from '../../routing'

const ToastMessageFactory = React.createFactory(ToastMessageAnimated)


export default class NavBar extends Component {
  static propTypes = {
    cart: is.array.isRequired,
    toast: is.object.isRequired,
    reduxClearToast: is.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      type: 'add',
      profileMenu: false
    }
  }


  componentWillUpdate(nextProps) {
    if (nextProps.toast.title !== '') {
      const nothingRemoved = (nextProps.toast.updateType === 'removeFromCart' && this.props.cart.length === nextProps.cart.length)
      if(!nothingRemoved) {
        this.addAlert(nextProps.toast)
      }
      this.props.reduxClearToast()
    }
  }


  addAlert({title, recordType, updateType}) {
    this.setState({type: updateType !== 'removeFromCart' ? 'add' : 'remove'})
    const messages = {
      addToCart: 'Added to Deposit Cart',
      removeFromCart: 'Removed From Deposit Cart',
      updateCart: 'Updated in Deposit Cart'
    }
    this.refs.container.success(
      <div className='toastMessage'>
        <div className={'iconHolder' + (updateType === 'remove' ? ' remove-message' : '') }>
          <img src={`${routes.images}/Toast/Asset_Icons_White_Check.svg`} />
        </div>
        <div className='message'>{pascaleCase(recordType)} {messages[updateType]} ({title})</div>
      </div>,
      <div className='toastTitle'><div className='arrow'/></div>,
      )
  }


  toggleProfileMenu = () => {
    this.setState({
      profileMenu: !this.state.profileMenu
    })
  }


  closeProfileMenu = () => {
    this.setState((prevState) => {
      return prevState.profileMenu ? {profileMenu: false} : null
    })
  }


  logout = () => {
    browserHistory.push(routes.base)
  }


  render () {
    return (
      <div className='publications-nav'>
        <div className='publications-nav-contents'>
          <div className='links'>
            <Link to={routes.publications}>Publications</Link>
            <Link to={routes.depositHistory}>Deposit History</Link>
            <Link className='depositCartHolder' to={routes.depositCart}>
              Deposit Cart
              {!!this.props.cart.length && <span className='cartItemCount'>{this.props.cart.length}</span>}
              <ToastContainer
                toastMessageFactory={ToastMessageFactory}
                ref="container"
                className={'toast-top-right topnav' + (this.state.type !== 'add' ? ' remove-message' : '')} />
              </Link>
          </div>
          <div className='user'>
            <div className='userProfileMenuHolder' >
              <div
                className='profileMenuTrigger tooltips'
                tabIndex="0"
                onBlur={this.closeProfileMenu}
                onClick={this.toggleProfileMenu}>
                  {localStorage.user}
                  <img
                    className={'profileActions' + ((this.state.profileMenu) ? ' menuOpen':'')}
                    src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
              </div>
              {this.state.profileMenu &&
                <div className='profileMenu'>
                  <p onMouseDown={this.logout}>Logout</p>
                </div>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
