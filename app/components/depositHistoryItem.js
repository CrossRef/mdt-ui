import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import _ from 'lodash'
import Moment from 'react-moment';

import { stateTrackerII } from 'my_decorators'
import objectSearch from '../utilities/objectSearch'
import xmldoc from '../utilities/xmldoc'

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
//    console.log(this.props.history)
    return (
        <tr>
          <td className='firstTd'>{this.props.history.id}</td>
          <td>{this.props.history.title}</td>
          <td><Moment format="MMM DD">{this.props.history.date}</Moment></td>
          <td>article</td>
          <td>{this.props.history.status}</td>
          <td>{this.props.history.doi}</td>
        </tr>
    )
  }
}
