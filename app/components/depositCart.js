import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import update from 'immutability-helper'
import Switch from 'react-toggle-switch'
import _ from 'lodash'

import fetch from '../utilities/fetch'
import checkDupeDOI from '../utilities/dupeDOI'
import xmldoc from '../utilities/xmldoc'
import { stateTrackerII } from 'my_decorators'
import objectSearch from '../utilities/objectSearch'
import DepositCartItem from './depositCartItem'



@stateTrackerII
export default class DepositCart extends Component {
  static propTypes = {
    reduxCartUpdate: is.func.isRequired,
    reduxControlModal: is.func.isRequired,
    reduxRemoveFromCart: is.func.isRequired,
    reduxCart: is.array.isRequired,
    toggleDeposit: is.func.isRequired,
    fullCart: is.array.isRequired
  };

  constructor (props) {
    super(props)
    this.state = {
      depositerrors: true,
      errors: []
    }
  }

  updateError (index, pubDoi, pubIndex) {

    var errorState = this.state.errors

    errorState.push({
      errorIndex: index,
      errorPubDoi: pubDoi,
      errorPubIndex: pubIndex
    })

    this.setState({
      errors: update(this.state.errors, {$set: errorState})
    })
  }

  render () {

    var errors = _.orderBy(
        _.filter(this.state.errors, (error) => {
          return (typeof error.errorIndex !== 'undefined')
        }), ['errorIndex', 'errorPubIndex']
    ) // ordering, the reporting of errors are not always 1 to 1, there are time it will lag

    var items = []
    _.each(this.props.fullCart, (cartItem, i) => {
      items.push(
        <DepositCartItem
            cartItem={cartItem}
            key={i}
            index={i}
            reduxCartUpdate={this.props.reduxCartUpdate}
            reduxCart={this.props.reduxCart}
            reduxControlModal={this.props.reduxControlModal}
            reduxRemoveFromCart={this.props.reduxRemoveFromCart}
            updateError={this.updateError.bind(this)}
            errorIndex={errors.length > 0 ? errors[0].errorIndex : -1}
            errorPubIndex={errors.length > 0 ? errors[0].errorPubIndex : -1}
            errorPubDoi={errors.length > 0 ?  errors[0].errorPubDoi : ''}
            toggleDeposit={this.props.toggleDeposit}
        />
      )
    })


    return (
      <div>
        <table className='depositTopBorder'>
          <tr className='item'>
            <td className='stateIcon'>
              &nbsp;
            </td>
            <td className='aboveTitle'>
              &nbsp;
            </td>
            <td className='status'>
              Status
            </td>
            <td className='action'>
              &nbsp;
            </td>
            <td className='errorholder'>
              &nbsp;
            </td>
          </tr>
        </table>
        <div className='depositCartRows'>
          {items}
        </div>
      </div>
    )
  }
}
