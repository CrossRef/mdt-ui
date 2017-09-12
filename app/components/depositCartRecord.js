import React, { Component } from 'react'
import is from 'prop-types'
import { Link } from 'react-router'
import $ from 'jquery'
import {updateReporterII} from 'my_decorators'

import {routes} from '../routing'
import {asyncValidateArticle, asyncValidateIssue} from '../utilities/validation'
import parseXMLArticle from '../utilities/parseXMLArticle'
import parseXMLIssue from '../utilities/parseXMLIssue'
import {ArticleMessages, IssueMessages} from '../utilities/validationMessages'



export default class DepositCartRecord extends Component {
  static propTypes = {
    cartItem: is.object.isRequired,
    reduxRemoveFromCart: is.func.isRequired,
    pubDoi: is.string.isRequired,
    issueDoi: is.string,
    underIssue: is.bool,
    closeErrors: is.func.isRequired,
    reportErrors: is.func.isRequired
  }

  constructor () {
    super()
    this.state = {
      status: 'validating',
      errorMessage: []
    }
  }

  componentDidMount () {
    this.validate()
  }

  validate = async () => {
    const record = this.props.cartItem
    const type = record.type

    const {criticalErrors, warnings} = type === 'issue' ? await getIssueErrors() : await getArticleErrors()

    function getIssueErrors () {
      const parsedIssue = parseXMLIssue(record.content)
      return asyncValidateIssue(parsedIssue.issue, parsedIssue.optionalIssueInfo, record['owner-prefix'])
    }

    function getArticleErrors () {
      const parsedArticle = parseXMLArticle(record.content)
      const crossmark = (parsedArticle.crossmark || {}).reduxForm

      return asyncValidateArticle(parsedArticle, crossmark, record['owner-prefix'])
    }

    const errorMessage = []
    let showError = false
    const ignoreDupe = type === 'issue' ? 'dupeissuedoi' : 'dupedoi'

    for (const error in criticalErrors) {
      if(criticalErrors[error] && error !== ignoreDupe) {
        showError = true
        errorMessage.push(error)
      }
    }

    for (const error in warnings) {
      if(warnings[error] && (type === 'issue' ? error !== 'dupevolumedoi' : true)) {
        showError = true
        errorMessage.push(error)
      }
    }

    this.setState({
      status: showError ? 'error' : 'valid',
      errorMessage: errorMessage
    })
  }

  displayError = () => {
    const type = this.props.cartItem.type
    const messages = type === 'issue' ? IssueMessages : ArticleMessages
    let hasDateError = false

    const errorMessage = this.state.errorMessage.map((error, i)=>{
      if(error === 'printDateYear' || error === 'onlineDateYear') {
        if(!hasDateError) {
          hasDateError = true
        } else return null
      }
      return <div key={i}>
        <p><b>{messages[error].bold}</b></p>
        <p className="errorText">{messages[error].message}</p>
      </div>
    })
    return (
      <div className='errorBox'><ErrorBox closeErrors={this.props.closeErrors} errorMessage={errorMessage}/></div>
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

  remove () {
    const cartItem = this.props.cartItem
    const cartType = this.props.cartItem.type
    const title = cartType === 'issue' ? `${cartItem.title.volume && `Volume ${cartItem.title.volume}, `}Issue ${cartItem.title.issue}` : cartItem.title.title
    this.props.reduxRemoveFromCart(cartItem.doi, title, cartType)
  }

  render () {
    const showError = this.state.status === 'error'
    if(this.state.status !== 'validating') {
      this.props.reportErrors(showError)
    }
    const cartItem = this.props.cartItem
    const cartType = cartItem.type
    const title = cartType === 'issue' ? `${cartItem.title.volume && `Volume ${cartItem.title.volume}, `}Issue ${cartItem.title.issue}` : cartItem.title.title

    const status =  cartItem.status.charAt(0).toUpperCase() + cartItem.status.slice(1).toLowerCase()
    const height = this.props.underIssue ? ' short' : ' tall'
    return (
      <tr className={`item ${!this.props.underIssue && 'borderBottom'}`}>
        <td className={'stateIcon' + (showError ? ' rowError' : '') + ((cartType === 'issue') ? ' issuerow' : '') + height}>
        </td>
        <td className={'title' + (showError ? ' rowError' : '') + ((cartType === 'issue') ? ' issuerow' : '') + ((this.props.underIssue) ? ' underIssue' : '') + height}>
          <Link to={this.getLink()}>{title}</Link>
        </td>
        <td className={'status' + (showError ? ' rowError' : '') + ((cartType === 'issue') ? ' issuerow' : '') + height}>
          {status}
        </td>
        <td className={'action' + (showError ? ' rowError' : '') + ((cartType === 'issue') ? ' issuerow' : '') + height}>
          {(cartType !== 'issue') && <a onClick={() => {this.remove()}}>Remove</a>}
        </td>
        <td className={'errorholder'}>
          {
            this.state.status === 'error' && this.displayError()
          }
        </td>
      </tr>
    )
  }
}




class ErrorBox extends Component {
  state = {errorBoxShow: false}

  componentWillReceiveProps () {
    this.setState({errorBoxShow: false})
  }

  toggleError = async (e) => {
    const target = $(e.target)
    if((target.parents('.popup').length || target.hasClass('popup')) && !target.hasClass('closeButton')) {
      return
    }

    if(!this.state.errorBoxShow) {
      await this.props.closeErrors()
      this.setState({errorBoxShow: true})
    } else {
      this.setState({errorBoxShow: false})
    }
  }

  render () {
    return (
      <ul className="errorButton">
        <li onClick={this.toggleError}>
          <a className="tooltips">
            {this.state.errorBoxShow && <div className="popup">
              <div className="scrollContainer">{this.props.errorMessage}</div><img className='closeButton' src={`${routes.images}/Deposit/x.png`}/>
            </div>}

            <img src={`${routes.images}/AddArticle/Asset_Icons_White_Caution.svg`}/>
          </a>
        </li>
      </ul>
    )
  }
}
