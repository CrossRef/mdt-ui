import React, { Component } from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import { stateTrackerII } from 'my_decorators'


export default class Article extends Component {
  render () {
    let { title, status, type, date, doi } = this.props.doi
    const { publicationDoi } = this.props
    date = moment(date || undefined).format('MMM Do YYYY')
    title = title.title
    const url = doi && `http://dx.doi.org/${doi}`

    return (<tr className={status}>
      <td className='checkbox'><label><input type='checkbox' /><span>&nbsp;</span></label></td>
      <td className='title'><Link className='pull-left add-record' doi={doi} to={`/publications/${encodeURIComponent(publicationDoi)}/addarticle/${encodeURIComponent(doi)}`}>{title}</Link></td>
      <td className='date'>{date}</td>
      <td className='type'>{type}</td>
      <td className='status'>{status}</td>
      <td className='url'>{url && <a href={url}>{url}</a>}</td>
    </tr>)
  }
}
