import React, { Component } from 'react'
import is from 'prop-types'
import Moment from 'react-moment'
import { Link } from 'react-router'
import {routes} from '../../routing'

export default class DepositHistoryItem extends Component {
  static propTypes = {
    history: is.object.isRequired
  };

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    var title=this.props.history.title
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
          <td>{this.props.history.doi}</td>
        </tr>
    )
  }
}
