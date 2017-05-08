import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactModal from 'react-modal'
import { updateReporterII } from 'my_decorators'

import client from '../../client'
import AddPublication from './AddPublication'



Modal.propTypes = {
  reduxControlModal: is.func.isRequired,
  modalState: is.shape({
    showModal: is.bool.isRequired,
    title: is.string.isRequired,
    Component: is.func.isRequired,
    props: is.object.isRequired
  }).isRequired
}

export default function Modal (props) {
  ReactModal.setAppElement('#root'); // need to include this so modal know where to append itself

  const Component = props.modalState.Component;
  return (
    <div className='modalContainer'>
      <ReactModal
          isOpen={props.modalState.showModal}
          contentLabel="Minimal Modal Example"
      >
        <div className='modal'>
          <div className='titlebar'>
            <div className='titlebarinner'>
              <div className='title'>
                {props.modalState.title}
              </div>
              <div className='titleclose'>
                <a onClick={ () => props.reduxControlModal({showModal:false}) }>X</a>
              </div>
            </div>
          </div>
          <div className='modalbody'>
            <div className='modalboddyinner'>
              <Component {...props.modalState.props} reduxControlModal={props.reduxControlModal} />
            </div>
          </div>
        </div>
      </ReactModal>
    </div>
  )
}