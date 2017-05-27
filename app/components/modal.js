import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactModal from 'react-modal'
import { updateReporterII } from 'my_decorators'



export default class Modal extends React.Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    modalState: is.shape({
      showModal: is.bool.isRequired,
      title: is.oneOfType([
        is.string,
        is.object
      ]).isRequired,
      style: is.string,
      Component: is.func.isRequired,
      props: is.object.isRequired,
    }).isRequired
  }

  constructor() {
    super();
    ReactModal.setAppElement('#root'); // need to include this so modal know where to append itself
  }

  render() {
    const { modalState, reduxControlModal } = this.props;
    const Component = modalState.Component;
    return (
      <div className='modalContainer'>
        <ReactModal
          isOpen={modalState.showModal}
          contentLabel="Minimal Modal Example"
          className={modalState.style}
        >
          <div className='modal'>
            <div className='titlebar'>
              <div className='titlebarinner'>
                <div className='title'>
                  {modalState.title}
                </div>
                <div className='titleclose'>
                  <a onClick={ () => reduxControlModal({showModal:false}) }><img src='/images/Modal/Asset_Icons_White_Close.svg' /></a>
                </div>
              </div>
            </div>
            <div className='modalbody'>
              <div className='modalboddyinner'>
                <Component {...modalState.props} reduxControlModal={reduxControlModal} close={() => reduxControlModal({showModal:false})}/>
              </div>
            </div>
          </div>
        </ReactModal>
      </div>
    )
  }
}
