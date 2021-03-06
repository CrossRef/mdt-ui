import React, { Component } from 'react'
import is from 'prop-types'
import { Link } from 'react-router'

import {routes} from '../../routing'
import {asyncValidateArticle, asyncValidateIssue} from '../../utilities/validation'
import parseXMLArticle from '../../utilities/parseXMLArticle'
import parseXMLIssue from '../../utilities/parseXMLIssue'
import {recordTitle, pascaleCase} from '../../utilities/helpers'
import {ArticleMessages, IssueMessages} from '../../utilities/lists/validationMessages'
import ErrorBox from './errorBox'



export default class DepositCartRecord extends Component {
  static propTypes = {
    cartItem: is.object.isRequired,
    reduxRemoveFromCart: is.func.isRequired,
    pubDoi: is.string.isRequired,
    issueDoi: is.string,
    issueTitle: is.object,
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
    const publicationDoiPrefix = this.props.pubDoi.split('/')[0]
    const articleOwnerPrefix = record['owner-prefix']
    //MM-429: We are getting a list of publications (object) from the depositCartTitle. We then use the publication doi(pubDoi) to get the publication owner prefix
    const publicationOwnerPrefix = this.props.publications[this.props.pubDoi]['message']['owner-prefix']

    const {criticalErrors, warnings} = type === 'issue' ? await getIssueErrors() : await getArticleErrors()
    const pubDoi=this.props.pubDoi
    function getIssueErrors () {
      const parsedIssue = parseXMLIssue(record.content)
      return asyncValidateIssue({
        issueData: parsedIssue.issue,
        optionalIssueInfo: parsedIssue.optionalIssueInfo,
        ownerPrefix: record['owner-prefix'],
        pubDoi: pubDoi
      })
    }


    function getArticleErrors () {
      const parsedArticle = parseXMLArticle(record.content)
      const crossmark = (parsedArticle.crossmark || {}).reduxForm

      return asyncValidateArticle(parsedArticle, crossmark, publicationDoiPrefix, false, publicationOwnerPrefix, articleOwnerPrefix)
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
      <div className='errorBox'><ErrorBox type='cart' closeErrors={this.props.closeErrors} errorMessage={errorMessage}/></div>
    )
  }

  getLink = () => {
    if(this.props.cartItem.type === 'issue') {
      return `${routes.publications}/${encodeURIComponent(this.props.pubDoi)}?modal=${encodeURIComponent(JSON.stringify({...this.props.cartItem.title,doi:this.props.cartItem.doi}))}`
    } else if (this.props.issueDoi || this.props.issueTitle) {
      return `${routes.publications}/${encodeURIComponent(this.props.pubDoi)}/${encodeURIComponent(JSON.stringify({...this.props.issueTitle,doi:this.props.issueDoi}))}/addarticle/${encodeURIComponent(this.props.cartItem.doi)}`
    } else {
      return `${routes.publications}/${encodeURIComponent(this.props.pubDoi)}/addarticle/${encodeURIComponent(this.props.cartItem.doi)}`
    }
  }

  remove = () => {
    const cartItem = this.props.cartItem
    const cartType = this.props.cartItem.type
    const title = recordTitle(cartType, cartItem.title)
    this.props.reduxRemoveFromCart(cartItem.doi, title, cartType)
  }

  render () {
    const underIssue = this.props.issueDoi || this.props.issueTitle
    const showError = this.state.status === 'error'
    if(this.state.status !== 'validating') {
      this.props.reportErrors(showError)
    }
    const cartItem = this.props.cartItem
    const cartType = cartItem.type
    const title = recordTitle(cartType, cartItem.title)

    const height = underIssue ? ' short' : ' tall'
    return (
      <tr className={`item ${!underIssue && 'borderBottom'}`}>
        <td className={'stateIcon' + (showError ? ' rowError' : '') + ((cartType === 'issue') ? ' issuerow' : '') + height}>
        </td>
        <td className={'title' + (showError ? ' rowError' : '') + ((cartType === 'issue') ? ' issuerow' : '') + (underIssue ? ' underIssue' : '') + height}>
          <Link to={this.getLink()}>{title}</Link>
        </td>
        <td className={'status' + (showError ? ' rowError' : '') + ((cartType === 'issue') ? ' issuerow' : '') + height}>
          {cartType === 'article' && pascaleCase(cartItem.status)}
        </td>
        <td className={'action' + (showError ? ' rowError' : '') + ((cartType === 'issue') ? ' issuerow' : '') + height}>
          {cartType === 'article' && <a onClick={this.remove}>Remove</a>}
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
