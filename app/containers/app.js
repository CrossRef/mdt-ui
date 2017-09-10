import React, { Component } from 'react'
import {bindActionCreators} from 'redux'
import is from 'prop-types'
import { connect } from 'react-redux'
import { stateTrackerII } from 'my_decorators'

import Header from '../components/header'
import Footer from '../components/footer'
import Modal from './modal'
import {clearCartToast} from '../actions/application'


const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    cartToast: state.cartToast
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  reduxClearCartToast: clearCartToast
}, dispatch)

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {

  static propTypes = {}

  render () {
    return (
      <div className='app'>
        <div className='app-contents'>
          <Header cart={this.props.cart} cartToast={this.props.cartToast} reduxClearCartToast={this.props.reduxClearCartToast}/>
          <div className='page-contents'>
            {this.props.children}
          </div>
        </div>
        <Footer />
        <Modal />
      </div>
    )
  }
}
