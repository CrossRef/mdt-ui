import React, { Component } from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import is from 'prop-types'
import { stateTrackerII } from 'my_decorators'


export default class Article extends Component {
  static propTypes = {
    handleRemoveFromList: is.func.isRequired,
    handleAddToList: is.func.isRequired,
    selections: is.array.isRequired,
    publicationDoi: is.string.isRequired,
    doi: is.object
  }

  toggleCheckBox (e) {
    const { doi } = this.props
    if(e.currentTarget.checked) {
      this.props.handleAddToList({ article: doi })
    } else {
      this.props.handleRemoveFromList({ article: doi })
    }
  }

  render () {
    let { title, status, type, date, doi } = this.props.doi
    const { publicationDoi, issue } = this.props
    date = moment(date || undefined).format('MMM Do YYYY')
    title = title.title
    const url = doi && `http://doi.org/${doi}`

    const checked = !this.props.selections.length ? {checked:false} : {};

    return (<tr className={status}>
      <td className='checkbox'><label><input type='checkbox' onClick={this.toggleCheckBox.bind(this)} {...checked} /><span>&nbsp;</span></label></td>
      <td className='title'>
        {issue ?
          <Link className='pull-left add-record' to={`/mdt/publications/${encodeURIComponent(publicationDoi)}/${encodeURIComponent(issue)}/addarticle/${encodeURIComponent(doi)}`}>{title}</Link>
          :
          <Link className='pull-left add-record' to={`/mdt/publications/${encodeURIComponent(publicationDoi)}/addarticle/${encodeURIComponent(doi)}`}>{title}</Link>
        }
      </td>
      <td className='date'>{date}</td>
      <td className='type'>{type}</td>
      <td className='status'>{status}</td>
      <td className='url'>{url && <a target='_blank' href={url}>{url}</a>}</td>
    </tr>)
  }
}
