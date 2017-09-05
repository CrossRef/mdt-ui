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



export default class DepositCart extends Component {
  static propTypes = {
    reduxCartUpdate: is.func.isRequired,
    reduxControlModal: is.func.isRequired,
    reduxRemoveFromCart: is.func.isRequired,
    reduxCart: is.array.isRequired,
    toggleDeposit: is.func.isRequired,
    fullCart: is.array.isRequired
  };

  render () {
    var items = []
    _.each(this.props.fullCart, (cartItem, i) => {
      items.push(
        <DepositCartItem
            cartItem={cartItem}
            key={i}
            reduxCartUpdate={this.props.reduxCartUpdate}
            reduxCart={this.props.reduxCart}
            reduxControlModal={this.props.reduxControlModal}
            reduxRemoveFromCart={this.props.reduxRemoveFromCart}
            toggleDeposit={this.props.toggleDeposit}
        />
      )
    })


    return (
      <div>
        <table className='depositTopBorder'>
          <div className="rightBorderBox">&nbsp;</div>
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
