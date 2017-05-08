import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactModal from 'react-modal'
import client from '../../client'

import { stateTrackerII } from 'my_decorators'


export default class ModalCard extends React.Component {
  constructor () {
    ReactModal.setAppElement('#root'); // need to include this so modal know where to append itself
    super();
    this.state = {
      showModal: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }
  componentDidMount () {
    this.props.onRef(this)
  }
  componentWillUnmount () {
    this.props.onRef(undefined)
  }

  handleOpenModal () {
   document.body.classList.add("openModal");
   this.setState({ showModal: true });
  }

  handleCloseModal () {
    document.body.classList.remove("openModal");
    this.setState({ showModal: false });
  }

  render () {
    const childrenWithProps = React.Children.map(this.props.children,
     (child) => React.cloneElement(child)
    );


    return (
      <div className='modalContainer'>
        <button className={this.props.buttonClassStyle} onClick={this.handleOpenModal}>{this.props.buttonTitle}</button>
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
                  <a onClick={this.handleCloseModal}><img src='/images/Modal/Asset_Icons_White_Close.svg' /></a>
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