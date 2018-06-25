import React, { Component } from 'react'
import is from 'prop-types'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import { ToastContainer, ToastMessageAnimated } from "react-toastr"

import {pascaleCase} from '../../utilities/helpers'
import { routes } from '../../routing'
import TourModal from '../Publication/tourModal';

const ToastMessageFactory = React.createFactory(ToastMessageAnimated)


export default class NavBar extends Component {
  static propTypes = {
    cart: is.array.isRequired,
    toast: is.object.isRequired,
    reduxClearToast: is.func.isRequired,
    reduxControlModal: is.func.isRequired,
    firstLogin: is.bool
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
      addToCart: 'added for deposit',
      removeFromCart: 'removed from deposit',
      updateCart: 'updated for deposit'
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


  showTour = () => {
    this.props.reduxControlModal({
      showModal: true,
      title: '',
      style: 'tourModal',
      Component: TourModal
    })
  }


  render () {
    return (
      <div className='publications-nav'>
        <div className='publications-nav-contents'>
          <div className='links'>
            <Link to={routes.publications}>Home</Link>
            <Link to={routes.depositHistory}>Deposit history</Link>
            <Link className='depositCartHolder' to={routes.depositCart}>
              To deposit
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
                  {this.props.firstLogin === false && <p onMouseDown={this.showTour}>Tutorial</p>}
                  <p onMouseDown={this.logout}>Logout</p>
                </div>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
