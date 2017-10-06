import React, { Component } from 'react'
import is from 'prop-types'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import { ToastContainer, ToastMessage } from "react-toastr"

import {pascaleCase} from '../../utilities/helpers'
import { routes } from '../../routing'

const ToastMessageFactory = React.createFactory(ToastMessage.animation)


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

  handleClick = () => {
    this.setState({profileMenu: false})
  }

  componentWillUpdate(nextProps, nextState) { //need to update this to do cause REACTJS to rerender

    if(nextState.profileMenu) {
      document.addEventListener('click', this.handleClick, false)
    } else if (this.state.profileMenu && !nextState.profileMenu) {
      document.removeEventListener('click', this.handleClick, false)
    }

    if (nextProps.toast.title !== '') {

      const nothingRemoved = (nextProps.toast.updateType === 'removeFromCart' && this.props.cart.length === nextProps.cart.length)
      if(!nothingRemoved) {
        this.addAlert(nextProps.toast)
      }
      this.props.reduxClearToast()
    }
  }


  componentWillUnmount () {
    document.removeEventListener('click', this.handleClick, false)
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
        <div className={'iconHolder' + (updateType === 'remove' ? ' remove-message' : '') }><img src={`${routes.images}/Toast/Asset_Icons_White_Check.svg`} /></div>
        <div className='message'>{pascaleCase(recordType)} {messages[updateType]} ({title})</div>
      </div>,
      <div className='toastTitle'><div className='arrow'></div></div>,
      {
        closeButton: false,
        showDuration: '300',
        hideDuration: '1000',
        timeOut: '5000',
        extendedTimeOut: '1000',
        showAnimation: false,
        hideAnimation: false,
        showEasing: 'none',
        hideEasing: 'linear',
        showMethod: 'show',
        hideMethod: 'hide',
        preventDuplicates: true,
        limit: 1
    })
  }

  openProfileMenu () {
    this.setState({
      profileMenu: !this.state.profileMenu
    })
  }

  logout () {
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
              <span className='cartItemCount'>{this.props.cart.length}</span>
              <ToastContainer
                toastMessageFactory={ToastMessageFactory}
                ref="container"
                className={'toast-top-right topnav' + (this.state.type !== 'add' ? ' remove-message' : '')}
              />
              </Link>
          </div>
          <div className='user'>
            <div className='userProfileMenuHolder'>
              <span className='profileMenuTrigger tooltips' onClick={() => {this.openProfileMenu()}}>{localStorage.user} <img className={'profileActions' + ((this.state.profileMenu) ? ' menuOpen':'')} src={`${routes.images}/AddArticle/DarkTriangle.svg`} /></span>
              {this.state.profileMenu && <div className='profileMenu'>
                <span onClick={()=>{this.logout()}}>Logout</span>
              </div>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}