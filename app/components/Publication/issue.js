import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import moment from 'moment'
import is from 'prop-types'
import { stateTrackerII } from 'my_decorators'

import AddIssueCard from '../addIssueCard'
import xmldoc from '../../utilities/xmldoc'
import objectSearch from '../../utilities/objectSearch'
import update from 'immutability-helper'

export default class Issue extends Component {
  static propTypes = {
    handleRemoveFromList: is.func.isRequired,
    handleAddToList: is.func.isRequired,
    fetchIssue: is.func.isRequired,
    reduxControlModal: is.func.isRequired,
    publication: is.object.isRequired,
    publicationDoi: is.string.isRequired,
    publicationMessage: is.object.isRequired,
    doi: is.object.isRequired,
    reduxCartUpdate: is.func.isRequired,
    ownerPrefix: is.string.isRequired,
    selections: is.array.isRequired,
  }

  constructor (props) {
    super(props)
    this.state = {
      issue: {}
    }
  }


  toggleCheckBox = (e) => {
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
      const parsedIssue = xmldoc(Issue.content);
      const issueTitle = objectSearch(parsedIssue, 'title') ? objectSearch(parsedIssue, 'title') : ''
      const issueNumber = objectSearch(parsedIssue, 'issue') ? objectSearch(parsedIssue, 'issue') : ''
      const journal_volume = objectSearch(parsedIssue, 'journal_volume')
      var theVolume = ''
      if (journal_volume) {
        theVolume = objectSearch(journal_volume, 'volume') ? objectSearch(journal_volume, 'volume') : ''
      }

      this.setState({
        issue: update(this.state.issue, {$set: {
          title: issueTitle,
          issue: issueNumber,
          volumetitle: theVolume
        }})
      })

    })
  }

  componentWillReceiveProps(nextProps) {
    if(!this.props.selections.length)
    if ((nextProps.doi !== this.props.doi) || (this.props.triggerModal !== nextProps.triggerModal)){
      const { doi } = nextProps.doi
      this.getTitles(doi)

      if (nextProps.triggerModal) { //its a doi
        if (nextProps.triggerModal === doi) {
          this.modalOpen();
        }
      }

    }
  }

  componentDidMount () {
    const { doi } = this.props.doi
    this.getTitles(doi)
  }

  modalOpen = (e) => {
    if(e && e.preventDefault) e.preventDefault();
    this.props.reduxControlModal({
      showModal: true,
      title: 'Edit Issue/Volume',
      style: 'addIssueModal',
      Component: AddIssueCard,
      props: {
        mode: 'edit',
        issue: this.props.doi,
        publication: this.props.publication,
        publicationMessage: this.props.publicationMessage,
        doiMessage: this.props.publicationDoi,
        handle: this.props.handle,
        fetchIssue: this.props.fetchIssue,
        postIssue: this.props.postIssue,
        reduxCartUpdate: this.props.reduxCartUpdate,
        handleAddCart: this.props.handleAddCart,
        handleAddToList: this.props.handleAddToList,
        triggerModal: this.props.triggerModal,
        ownerPrefix: this.props.ownerPrefix
      }
    })
  }

  render () {
    const { doiMessage, handle, fetchIssue, publicationMessage, publicationDoi, publication } = this.props
    let { status, type, date, doi } = this.props.doi
    date = moment(date || undefined).format('MMM Do YYYY')
    //title needs to be either issue title + volume title or either one
    const issueTitle = this.state.issue.title || this.state.issue.issue || '';
    const title = (this.state.issue.volumetitle ? ('Volume ' + this.state.issue.volumetitle) : '') + (this.state.issue.title || this.state.issue.issue ? ' Issue ' + issueTitle : '')
    const url = doi && `http://dx.doi.org/${doi}`

    const checked = !this.props.selections.length ? {checked:false} : {};

    return (<tr className='issue'>
      <td className='checkbox'><label><input type='checkbox' onClick={this.toggleCheckBox} {...checked} /><span>&nbsp;</span></label></td>
      <td className='title'>
        <a onClick={this.modalOpen} href="">{title}</a>
      </td>
      <td className='date'>{date}</td>
      <td className='type'>{type}</td>
      <td className='status'>{status}</td>
      <td className='url'>{url && <a className='issueDOILink' target='_blank' href={url}>{url}</a>}&nbsp;<Link className='issueDoiAddNew' to={`/publications/${encodeURIComponent(publicationDoi)}/${encodeURIComponent(doi)}/addarticle`}><span>Add Article</span></Link></td>
    </tr>)
  }
}
