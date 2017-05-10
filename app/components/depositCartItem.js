import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import update from 'immutability-helper'
import Switch from 'react-toggle-switch'
import _ from 'lodash'

import { stateTrackerII } from 'my_decorators'
import checkDupeDOI from '../utilities/dupeDOI'
import isDOI from '../utilities/isDOI'
import isURL from '../utilities/isURL'
import objectSearch from '../utilities/objectSearch'
import DepositCartItemCard from './depositCartItemCard'
import { controlModal, getPublications, cartUpdate, getItem } from '../actions/application'
import xmldoc from '../utilities/xmldoc'

let errorState = []

export default class DepositCartItem extends Component {
  static propTypes = {
    reduxCartUpdate: is.func.isRequired,
    reduxControlModal: is.func.isRequired,
    reduxRemoveFromCart: is.func.isRequired,
    cartItem: is.object.isRequired,
    reduxCart: is.array.isRequired,
    index: is.number.isRequired,
    updateError: is.func.isRequired,
    toggleDeposit: is.func.isRequired,
    errorIndex: is.number.isRequired,
    errorPubIndex:  is.number.isRequired,
    errorPubDoi: is.string.isRequired
  };

  constructor (props) {
    super(props)
    this.state = {
      publication: {},
      publicationMetaData: {},
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.props.errorIndex !== nextProps.errorIndex) {
      for(var i = 0; i < nextProps.cartItem.contains.length; i++){
        if(i===nextProps.errorIndex && nextProps.cartItem.doi === nextProps.errorPubDoi && nextProps.index === nextProps.errorPubIndex){
          this.props.toggleDeposit(false)
          break
        }
      }
      this.props.toggleDeposit(true)
    }
  }

  displayItem () {
    var row = []
    for(var i = 0; i < this.props.cartItem.contains.length; i++){
      row.push(
          <DepositCartItemCard
            key={i}
            index={i}
            pubIndex={this.props.index}
            pubDoi={this.props.cartItem.doi}
            reduxCartUpdate={this.props.reduxCartUpdate}
            reduxCart={this.props.reduxCart}
            reduxControlModal={this.props.reduxControlModal}
            reduxRemoveFromCart={this.props.reduxRemoveFromCart}
            publication={this.state.publication}
            cartItem={this.props.cartItem.contains[i]}
            updateError={this.props.updateError}
            showError={(i===this.props.errorIndex && this.props.cartItem.doi === this.props.errorPubDoi && this.props.index === this.props.errorPubIndex) ? true : false}
        />
      )
    }

    return (
      <div className='depositpage'>
        <table>
          <tr>
            <td className='titleHolderTD'>
              <table className='itemholder'>
                <tr>
                  <td className='stateIcon deposittitle'>&nbsp;</td>
                  <td className='depositpubtitle' colSpan={3}>{this.props.cartItem.title}</td>
                  <td className='titlerror errorholder'>&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <table className='itemholder'>
              {row}
            </table>
          </tr>
        </table>
      </div>
    )
  }

  render () {
    return (
      <div>
        {this.displayItem()}
      </div>
    )
  }
}
