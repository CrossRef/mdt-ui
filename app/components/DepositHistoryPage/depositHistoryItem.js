import React, { Component } from 'react'
import is from 'prop-types'
import Moment from 'react-moment'

import { Link } from 'react-router'
import {routes} from '../../routing'
import ErrorMessage from './errorMessage'



export default class DepositHistoryItem extends Component {
  static propTypes = {
    history: is.object.isRequired,
    name: is.string.isRequired,
    activeErrorMessage: is.string.isRequired,
    errorMessageHandler: is.func.isRequired
  };

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    let title = this.props.history.title
    if(title.length > 35) {
      title = title.substring(0, 35) + '...'
    }

    const failedDeposit = this.props.history.status === 'Failed'
    const depositUpdate = this.props.history.depositTimestamp

    return (
        <tr>
          <td className='firstTd'>{this.props.history.id}</td>
          <td><Link className='pull-left add-record' to={`${routes.publications}/${encodeURIComponent(this.props.history.pubDoi)}/addarticle/${encodeURIComponent(this.props.history.doi)}`}>{title}</Link></td>
          <td><Moment format="MMM DD">{this.props.history.date}</Moment></td>
          <td>Article</td>
          <td>{this.props.history.status}</td>

          <td className="errorCell">
            {failedDeposit &&
              <img
                className="errorButton"
                src={`${routes.images}/${depositUpdate ? 'AddArticle/Asset_Icons_Black_Caution.svg' : 'Deposit/Asset_Icons_Red_Caution.png'}`}
                onClick={()=>this.props.errorMessageHandler(this.props.name)}/>}

            {this.props.name === this.props.activeErrorMessage &&
              <ErrorMessage errorMessage={this.props.history.errorMessage} errorMessageHandler={this.props.errorMessageHandler}/>}
          </td>

          <td>
            <a className={`doiLink ${failedDeposit && !depositUpdate ? 'failedDeposit' : ''}`}
               href={failedDeposit && !depositUpdate ? null : `https://doi.org/${this.props.history.doi}`}
            >
                https://doi.org/{this.props.history.doi}
            </a>
          </td>
        </tr>
    )
  }
}
