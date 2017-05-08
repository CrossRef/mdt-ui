import React, { Component } from 'react'
import moment from 'moment'
import { stateTrackerII } from 'my_decorators'


export default class Issue extends Component {
  render () {
    let { title, status, type, date } = this.props.doi
    date = moment(date || undefined).format('MMM Do YYYY')
    title = title.title || ([title.volume ? `Volume ${title.volume}` : null, title.issue ? `Issue ${title.issue}` : null].filter((titleElement) => titleElement).join(', '))

    return (<tr className='issue'>
      <td className='checkbox'><label><input type='checkbox' /><span>&nbsp;</span></label></td>
      <td className='title'>{title}</td>
      <td className='date'>{date}</td>
      <td className='type'>{type}</td>
      <td className='status'>{status}</td>
      <td className='url' />
    </tr>)
  }
}
