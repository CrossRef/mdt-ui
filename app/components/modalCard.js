import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactModal from 'react-modal'
import { stateTrackerII } from 'my_decorators'

import client from '../client'
import { Link } from 'react-router'

export default class ModalCard extends React.Component {
  constructor (props) {
    ReactModal.setAppElement('#root'); // need to include this so modal know where to append itself
    super(props)
    const { emitshowModal, closeModal } = this.props
    this.state = {
      showModal: false,
      emitshowModal: emitshowModal ? emitshowModal : undefined,
      closeModal: closeModal ? closeModal : undefined
    };

    this.handleOpenModal = this.handleOpenModal.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
  }
  componentDidMount () {
    this.props.onRef(this)
  }
  componentWillUnmount () {
    this.props.onRef(undefined)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      emitshowModal: nextProps.emitshowModal,
      closeModal: nextProps.closeModal
    })
  }

  handleOpenModal () {
   document.body.classList.add("openModal")
   if (this.state.emitshowModal) {
     this.state.emitshowModal()
   }
   this.setState({ showModal: true });
  }

  handleCloseModal () {
    document.body.classList.remove("openModal")
    this.setState({ showModal: false })
  }

  render () {
    const childrenWithProps = React.Children.map(this.props.children,
     (child) => React.cloneElement(child)
    );


    return (
      <div className='modalContainer'>
        {!this.props.link ? <button className={this.props.buttonClassStyle} onClick={this.handleOpenModal}>{this.props.buttonTitle}</button> : <Link className='pull-left add-record button-left' onClick={this.handleOpenModal}>{this.props.buttonTitle}</Link>}
        <ReactModal
            isOpen={this.state.showModal}
            contentLabel="Minimal Modal Example"
            className={(this.props.modalContentStyle ? this.props.modalContentStyle:'')}
        >
          <div className='modal'>
            <div className='titlebar'>
              <div className='titlebarinner'>
                <div className='title'>
                  {this.props.cardtitle}
                </div>
                <div className='titleclose'>
                  <a onClick={this.state.closeModal ? () => {this.state.closeModal()} : this.handleCloseModal}><img src='/images/Modal/Asset_Icons_White_Close.svg' /></a>
                </div>
              </div>
            </div>
            <div className='modalbody'>
              <div className={(this.props.modalInnerBodyStyle ? ' '+this.props.modalInnerBodyStyle : 'modalboddyinner')}>
              {childrenWithProps}
              </div>
            </div>
          </div>
        </ReactModal>
      </div>
    )
  }
}