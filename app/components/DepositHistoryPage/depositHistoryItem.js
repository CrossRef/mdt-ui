import React, { Component } from 'react'
import is from 'prop-types'
import Moment from 'react-moment';



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
    return (
        <tr>
          <td className='firstTd'>{this.props.history.id}</td>
          <td>{this.props.history.title}</td>
          <td><Moment format="MMM DD">{this.props.history.date}</Moment></td>
          <td>Article</td>
          <td>{this.props.history.status}</td>
          <td>{this.props.history.doi}</td>
        </tr>
    )
  }
}
