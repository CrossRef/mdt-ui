import React, { Component } from 'react'
import is from 'prop-types'

import DepositCartItemCard from './depositCartItemCard'
import DepositCartRecord from './depositCartRecord'



export default class DepositCartItem extends Component {
  static propTypes = {
    reduxCartUpdate: is.func.isRequired,
    reduxControlModal: is.func.isRequired,
    reduxRemoveFromCart: is.func.isRequired,
    cartItem: is.object.isRequired,
    reduxCart: is.array.isRequired,
    toggleDeposit: is.func.isRequired,
  };

  render () {
    var rows = []
    for(var i = 0; i < this.props.cartItem.contains.length; i++){
      rows.push(
        <DepositCartRecord
          key={i}
          pubDoi={this.props.cartItem.doi}
          reduxCartUpdate={this.props.reduxCartUpdate}
          reduxCart={this.props.reduxCart}
          reduxControlModal={this.props.reduxControlModal}
          reduxRemoveFromCart={this.props.reduxRemoveFromCart}
          cartItem={this.props.cartItem.contains[i]}
          showError={false}
        />
      )
      if (this.props.cartItem.contains[i].contains) {
        for(var j = 0; j < this.props.cartItem.contains[i].contains.length; j++){
          if(j === 0) rows.push(<tr className='articleUnderIssueSpace'><td/><td/><td/><td className="borderRight"/></tr>)
          rows.push(
            <DepositCartRecord
              key={`${i}-${j}`}
              underIssue={true}
              issueDoi={this.props.cartItem.contains[i].doi}
              pubDoi={this.props.cartItem.doi}
              reduxCartUpdate={this.props.reduxCartUpdate}
              reduxCart={this.props.reduxCart}
              reduxControlModal={this.props.reduxControlModal}
              reduxRemoveFromCart={this.props.reduxRemoveFromCart}
              cartItem={this.props.cartItem.contains[i].contains[j]}
              showError={false}
            />
          )
          if(j === this.props.cartItem.contains[i].contains.length - 1) rows.push(<tr className='articleUnderIssueSpace borderBottom'><td/><td/><td/><td className="borderRight"/></tr>)
        }
      }
    }

    return (
      <div>
        <div className='depositpage'>
          <table>
            <tr>
              <td className='titleHolderTD'>
                <table className='itemholder'>
                  <tr>
                    <td className='stateIcon deposittitle'>&nbsp;</td>
                    <td className='depositpubtitle' colSpan={3}><a href="">{this.props.cartItem.title}</a></td>
                    <td className='titlerror errorholder'>&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <table className='itemholder'>
                {rows}
              </table>
            </tr>
          </table>
        </div>
      </div>
    )
  }
}
