import React, { Component } from 'react'
import is from 'prop-types'

import DepositCartItemCard from './depositCartItemCard'



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
    errorPubDoi: is.string.isRequired,
  };

  constructor (props) {
    super(props)
    this.state = {
      publication: {},
      publicationMetaData: {},
    }
  }

  componentWillUpdate(nextProps) {
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


  render () {
    var row = []
    var counter = 0
    for(var i = 0; i < this.props.cartItem.contains.length; i++){
      row.push(
        <DepositCartItemCard
          key={counter}
          index={counter}
          pubIndex={this.props.index}
          pubDoi={this.props.cartItem.doi}
          reduxCartUpdate={this.props.reduxCartUpdate}
          reduxCart={this.props.reduxCart}
          reduxControlModal={this.props.reduxControlModal}
          reduxRemoveFromCart={this.props.reduxRemoveFromCart}
          publication={this.state.publication}
          cartItem={this.props.cartItem.contains[i]}
          updateError={this.props.updateError}
          showError={(counter===this.props.errorIndex && this.props.cartItem.doi === this.props.errorPubDoi && this.props.index === this.props.errorPubIndex) ? true : false}
        />
      )
      if (this.props.cartItem.contains[i].contains) {
        for(var j = 0; j < this.props.cartItem.contains[i].contains.length; j++){
          counter++
          row.push(
            <DepositCartItemCard
              className='issueArticle'
              key={counter}
              index={counter}
              underIssue={true}
              issueDoi={this.props.cartItem.contains[i].doi}
              pubIndex={this.props.index}
              pubDoi={this.props.cartItem.doi}
              reduxCartUpdate={this.props.reduxCartUpdate}
              reduxCart={this.props.reduxCart}
              reduxControlModal={this.props.reduxControlModal}
              reduxRemoveFromCart={this.props.reduxRemoveFromCart}
              publication={this.state.publication}
              cartItem={this.props.cartItem.contains[i].contains[j]}
              updateError={this.props.updateError}
              showError={(counter===this.props.errorIndex && this.props.cartItem.doi === this.props.errorPubDoi && this.props.index === this.props.errorPubIndex) ? true : false}
            />
          )
        }
      }
      counter++
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
      </div>
    )
  }
}
