import React, { Component } from 'react'
import Modal from '../../components/Modal'
import { connect } from 'react-redux'

import { controlModal } from '../../actions/application'
import { stateTrackerII, updateReporterII } from 'my_decorators'



const mapStateToProps = state => ({
  modalState: state.modal,
})

const mapDispatchToProps = dispatch => ({
  reduxControlModal: (...args) => dispatch(controlModal(...args))
})


@connect(mapStateToProps, mapDispatchToProps)
@stateTrackerII
export default class ModalContainer extends Component {
  render () {
    return (
      <Modal {...this.props}/>
    )
  }
}

