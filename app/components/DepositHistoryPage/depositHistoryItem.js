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
    return (
        <tr>
          <td className='firstTd'>{this.props.history.id}</td>
          <td><Link className='pull-left add-record' to={`${routes.publications}/${encodeURIComponent(this.props.history.pubDoi)}/addarticle/${encodeURIComponent(this.props.history.doi)}`}>{title}</Link></td>
          <td><Moment format="MMM DD">{this.props.history.date}</Moment></td>
          <td>Article</td>
          <td>{this.props.history.status}</td>
          <td className="errorCell">
            {this.props.history.status === 'Failed' &&
              <img
                className="errorButton"
                src={`${routes.images}/Deposit/Asset_Icons_Red_Caution.png`}
                onClick={()=>this.props.errorMessageHandler(this.props.name)}/>}
            {this.props.name === this.props.activeErrorMessage &&
              <ErrorMessage errorMessage={this.props.history.errorMessage} errorMessageHandler={this.props.errorMessageHandler}/>}
          </td>
          <td>{this.props.history.doi}</td>
        </tr>
    )
  }
}
