import React, { Component } from 'react'
import is from 'prop-types'
import { Link } from 'react-router'

import {routes} from '../routing'


export default class DepositCartRecord extends Component {
  static propTypes = {
    cartItem: is.object.isRequired,
    reduxCartUpdate: is.func.isRequired,
    reduxControlModal: is.func.isRequired,
    reduxCart: is.array.isRequired,
    reduxRemoveFromCart: is.func.isRequired,
    pubDoi: is.string.isRequired,
    showError: is.bool.isRequired,
    underIssue: is.bool
  };


  remove () {
    this.props.reduxRemoveFromCart(this.props.cartItem.doi)
  }

  displayError () {
    return (
      <div className='errorBox'><img src={`${routes.images}/AddArticle/Asset_Icons_White_Caution.svg`} /></div>

    )
  }

  getLink = () => {
    if(this.props.cartItem.type === 'issue') {
      return `${routes.publications}/${encodeURIComponent(this.props.pubDoi)}?modal=${encodeURIComponent(this.props.cartItem.doi)}`
    } else if (this.props.underIssue) {
      return `${routes.publications}/${encodeURIComponent(this.props.pubDoi)}/${encodeURIComponent(this.props.issueDoi)}/addarticle/${encodeURIComponent(this.props.cartItem.doi)}`
    } else {
      return `${routes.publications}/${encodeURIComponent(this.props.pubDoi)}/addarticle/${encodeURIComponent(this.props.cartItem.doi)}`
    }

  }

  render () {
    const { cartItem } = this.props;
    const cartType = cartItem.type
    const status =  cartItem.status.charAt(0).toUpperCase() + cartItem.status.slice(1).toLowerCase()
    const title = cartType === 'issue' ? `${cartItem.title.volume && `Volume ${cartItem.title.volume}, `}Issue ${cartItem.title.issue}` : cartItem.title.title
    const height = this.props.underIssue ? ' short' : ' tall';
    return (
      <tr className={`item ${!this.props.underIssue && 'borderBottom'}`}>
        <td className={'stateIcon' + (this.props.showError ? ' rowError' : '') + ((cartType === 'issue') ? ' issuerow' : '') + height}>
        </td>
        <td className={'title' + (this.props.showError ? ' rowError' : '') + ((cartType === 'issue') ? ' issuerow' : '') + ((this.props.underIssue) ? ' underIssue' : '') + height}>
          <Link to={this.getLink()}>{title}</Link>
        </td>
        <td className={'status' + (this.props.showError ? ' rowError' : '') + ((cartType === 'issue') ? ' issuerow' : '') + height}>
          {status}
        </td>
        <td className={'action' + (this.props.showError ? ' rowError' : '') + ((cartType === 'issue') ? ' issuerow' : '') + height}>
          {(cartType !== 'issue') && <a onClick={() => {this.remove()}}>Remove</a>}
        </td>
        <td className={'errorholder'}>
          {
            this.props.showError? this.displayError() : ''
          }
        </td>
      </tr>
    )
  }
}