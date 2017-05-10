import React, { Component } from 'react'
import is from 'prop-types'
import { Link } from 'react-router'
import { stateTrackerII } from 'my_decorators'
import { ToastContainer, ToastMessage } from "react-toastr"

import update from 'immutability-helper'
import pascaleCase from '../utilities/pascaleCase'

const ToastMessageFactory = React.createFactory(ToastMessage.animation);

export default class PublicationNav extends Component {
  static propTypes = {
    cart: is.array.isRequired,
    reduxControlModal: is.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      type: 'add'
    }
  }

  componentDidUpdate(prevProps) { //need to update this to do cause REACTJS to rerender
    if (this.props.cart !== prevProps.cart) {
      if(this.props.cart.length > prevProps.cart.length) {
        var type = 'add'
      }
      if(this.props.cart.length < prevProps.cart.length) {
        type = 'remove'
      }

      if (this.props.cart.length > 0) {
        if (this.props.cart[this.props.cart.length - 1].article) {
          this.addAlert(type, this.props.cart[this.props.cart.length - 1].article)
        } else {
          this.addAlert(type, this.props.cart[this.props.cart.length - 1])
        }
      }
    }
  }

  addAlert(type, item) {
    const title = typeof item.title !== 'object' ? item.title : item.title.title
    this.setState({type: type})
    this.refs.container.success(
      <div className='toastMessage'>
        <div className={'iconHolder' + (type === 'remove' ? ' remove-message' : '') }><img src='/images/Toast/Asset_Icons_White_Check.svg' /></div>
        <div className='message'>{pascaleCase(item.type)} {type === 'add' ? 'Added to Deposit Cart' : 'Removed From Deposit Cart'} ({title})</div>
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

  render () {
    return (
      <div className='publications-nav'>
        <div className='publications-nav-contents'>
          <div className='links'>
            <Link to='/publications'>Publications</Link>
            <a href='#'>Deposit History</a>
            <Link className='depositCartHolder' to='/cart'>
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
            Testing
          </div>
        </div>
      </div>
    )
  }
}
