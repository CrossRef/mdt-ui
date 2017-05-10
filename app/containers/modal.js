import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { stateTrackerII, updateReporterII } from 'my_decorators'

import { controlModal } from '../actions/application'
import Modal from '../components/modal'




const mapStateToProps = state => ({
  modalState: state.modal,
  crossmarkAuth: state.crossmarkAuth
})

const mapDispatchToProps = dispatch => ({
  reduxControlModal: (...args) => dispatch(controlModal(...args))
})


@connect(mapStateToProps, mapDispatchToProps)
export default class ModalContainer extends Component {

  static propTypes = {
    crossmarkAuth: is.bool.isRequired,
    modalState: is.object.isRequired,
    reduxControlModal: is.func.isRequired
  }

  render () {
    return (
      <Modal {...this.props}/>
    )
  }
}

