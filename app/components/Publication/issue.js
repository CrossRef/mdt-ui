import React, { Component } from 'react'
import moment from 'moment'
import is from 'prop-types'
import { stateTrackerII } from 'my_decorators'
import AddIssueCard from '../addIssueCard'
import xmldoc from '../../utilities/xmldoc'
import objectSearch from '../../utilities/objectSearch'
import update from 'immutability-helper'

export default class Issue extends Component {
  static propTypes = {
    handleAddCart: is.func.isRequired,
    handleRemoveFromList: is.func.isRequired,
    handleAddToList: is.func.isRequired,
    fetchIssue: is.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      issue: {}
    }
  }


  toggleCheckBox (e) {
    const { doi } = this.props
    if(e.currentTarget.checked) {
      this.props.handleAddToList({ article: doi })
    } else {
      this.props.handleRemoveFromList({ article: doi })
    }
  }

  getTitles (doi) {
    this.props.fetchIssue(doi, (Publication) => {
      const message = Publication.message
      const Issue = message.contains[0]
      const parsedIssue = xmldoc(Issue.content)
      const issueTitle = objectSearch(parsedIssue, 'title') ? objectSearch(parsedIssue, 'title') : ''
      const journal_volume = objectSearch(parsedIssue, 'journal_volume')
      var theVolume = ''
      if (journal_volume) {
        theVolume = objectSearch(journal_volume, 'volume') ? objectSearch(journal_volume, 'volume') : ''
      }

      this.setState({
        issue: update(this.state.issue, {$set: {
          title: issueTitle,
          volumetitle: theVolume
        }})
      })

    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.doi !== this.props.doi) {
      const { doi } = nextProps.doi
      this.getTitles(doi)
    }
  }

  componentDidMount () {
    const { doi } = this.props.doi
    this.getTitles(doi)
  }


  render () {
    const { doiMessage, handle, fetchIssue, postIssue, publicationMessage, publicationDoi, publication } = this.props
    let { status, type, date } = this.props.doi
    date = moment(date || undefined).format('MMM Do YYYY')
    //title needs to be either issue title + volume title or either one
    const title = (this.state.issue.title ? 'Issue ' + this.state.issue.title : '') + (this.state.issue.volumetitle ? (' Volume ' + this.state.issue.volumetitle) : '')

    return (<tr className='issue'>
      <td className='checkbox'><label><input type='checkbox' onClick={this.toggleCheckBox.bind(this)} /><span>&nbsp;</span></label></td>
      <td className='title'>
        <AddIssueCard
          listtitle={title}
          mode={'edit'}
          issue={this.props.doi}
          publication={this.props.publication}
          publicationMessage={publicationMessage}
          doiMessage={publicationDoi}
          handle={handle}
          fetchIssue={fetchIssue}
          postIssue={postIssue}
          triggerModal={this.props.triggerModal}
          />
      </td>
      <td className='date'>{date}</td>
      <td className='type'>{type}</td>
      <td className='status'>{status}</td>
      <td className='url' />
    </tr>)
  }
}
