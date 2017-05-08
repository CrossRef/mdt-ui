import React, { Component } from 'react'
import ModalCard from '../../../components/ModalCard'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import client from '../../../client'
import { stateTrackerII } from 'my_decorators'


export class ModalPage extends Component {
  render () {
    const { actions, loginState } = this.props

    return (
      <div className='modal'>
        <ModalCard />
      </div>
    )
  }
}

export default connect(
)(ModalPage)
