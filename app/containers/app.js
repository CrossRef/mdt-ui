import React, { Component } from 'react'
import {bindActionCreators} from 'redux'
import is from 'prop-types'
import { connect } from 'react-redux'

import Header from '../components/App/header'
import Footer from '../components/App/footer'
import Modal from '../components/App/modal'
import {clearToast, controlModal} from '../actions/application'


const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    toast: state.toast,
    modalState: state.modal
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  reduxClearToast: clearToast,
  reduxControlModal: controlModal
}, dispatch)

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {

  static propTypes = {
    cart: is.array.isRequired,
    toast: is.object.isRequired,
    modalState: is.object.isRequired,
    reduxClearToast: is.func.isRequired,
    reduxControlModal: is.func.isRequired
  }

  render () {
    return (
      <div className='app'>
        <div className='app-contents'>
          <Header cart={this.props.cart} toast={this.props.toast} reduxClearToast={this.props.reduxClearToast}/>
          <div className='page-contents'>
            {this.props.children}
          </div>
        </div>
        <Modal modalState={this.props.modalState} reduxControlModal={this.props.reduxControlModal}/>
      </div>
    )
  }
}
