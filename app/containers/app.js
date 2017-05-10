import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { stateTrackerII } from 'my_decorators'

import { controlModal, getPublications, addDOIs, submitPublication, cartUpdate } from '../actions/application'
import Header from '../components/header'
import Footer from '../components/footer'
import Modal from './modal'
import ReduxRelay from './reduxRelay'


const mapStateToProps = (state) => ({
  path: window.location.pathname,
  reduxControlModal: controlModal,
  cart: state.cart
})

@connect(mapStateToProps)
export default class App extends Component {

  static propTypes = {}

  render () {
    return (
      <div className='app'>
        <div className='app-contents'>
          <Header path={this.props.path} cart={this.props.cart} reduxControlModal={this.props.reduxControlModal} />
          <div className='page-contents'>
            {this.props.children}
          </div>
        </div>
        <Footer />
        <Modal />
        <ReduxRelay/>
      </div>
    )
  }
}