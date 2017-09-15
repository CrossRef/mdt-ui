import React, { Component } from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import is from 'prop-types'

import {routes} from '../../routing'


export default class Article extends Component {
  static propTypes = {
    record: is.object.isRequired,
    selections: is.array.isRequired,

    handleRemoveFromList: is.func.isRequired,
    handleAddToList: is.func.isRequired,
  }

  toggleCheckBox (e) {
    const { record } = this.props
    if(e.currentTarget.checked) {
      this.props.handleAddToList({ article: record })
    } else {
      this.props.handleRemoveFromList({ article: record })
    }
  }

  render () {
    let { title, status, type, date, doi } = this.props.record
    const publicationDoi = this.props.publication.message.doi
    const issue = this.props.issue
    date = moment(date || undefined).format('MMM Do YYYY')
    title = title.title

    if(title.length > 35) title = title.substring(0, 35) + '...'
    const url = doi && `http://doi.org/${doi}`

    const checked = !this.props.selections.length ? {checked:false} : {};

    return (<tr className={status}>
      <td className='checkbox'><label><input type='checkbox' onClick={this.toggleCheckBox.bind(this)} {...checked} /><span>&nbsp;</span></label></td>
      <td className='title'>
        {issue ?
          <Link className='pull-left add-record' to={`${routes.publications}/${encodeURIComponent(publicationDoi)}/${encodeURIComponent(issue)}/addarticle/${encodeURIComponent(doi)}`}>{title}</Link>
          :
          <Link className='pull-left add-record' to={`${routes.publications}/${encodeURIComponent(publicationDoi)}/addarticle/${encodeURIComponent(doi)}`}>{title}</Link>
        }
      </td>
      <td className='date'>{date}</td>
      <td className='type'>{type}</td>
      <td className='status'>{status}</td>
      <td className='url'>{url && <a target='_blank' href={url}>{url}</a>}</td>
    </tr>)
  }
}
