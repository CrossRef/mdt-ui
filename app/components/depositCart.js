import React, { Component } from 'react'
import is from 'prop-types'
import _ from 'lodash'
import $ from 'jquery'

import DepositCartItem from './depositCartItem'



export default class DepositCart extends Component {
  static propTypes = {
    reduxRemoveFromCart: is.func.isRequired,
    showDeposit: is.bool.isRequired,
    toggleDeposit: is.func.isRequired,
    fullCart: is.array.isRequired
  };

  componentWillMount(){
    document.addEventListener('click', this.handleClick, false)
  }

  componentWillUnmount(){
    document.removeEventListener('click', this.handleClick, false)
  }

  handleClick = (e) => {
    const target = $(e.target)
    if(!target.parents('.errorButton').length) {
      if($('.popup').length) {
        this.setState({})
      }
    }
  }

  closeErrors = () => {
    return new Promise(resolve=>{
      this.setState({}, resolve)
    })
  }

  render () {
    const items = []
    _.each(this.props.fullCart, (cartItem, i) => {
      let recordCount = cartItem.contains.length
      for(let record in cartItem.contains) {
        recordCount += cartItem.contains[record].contains.length
      }

      items.push(
        <DepositCartItem
            cartItem={cartItem}
            key={cartItem.doi}
            reduxRemoveFromCart={this.props.reduxRemoveFromCart}
            showDeposit={this.props.showDeposit}
            toggleDeposit={this.props.toggleDeposit}
            recordCount={recordCount}
            closeErrors={this.closeErrors}
        />
      )
    })

    return (
      <div className="cartContainer">
        <div className="rightBorderBox">&nbsp;</div>
        <table className='depositTopBorder'>
          <tbody>
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
          </tbody>
        </table>
        <div className='depositCartRows'>
          {items}
        </div>
      </div>
    )
  }
}
