import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import moment from 'moment'
import is from 'prop-types'
import { stateTrackerII } from 'my_decorators'
import {routes} from '../../routing'
import AddIssueCard from '../addIssueCard'
import xmldoc from '../../utilities/xmldoc'
import objectSearch from '../../utilities/objectSearch'
import update from 'immutability-helper'

export default class Issue extends Component {
  static propTypes = {
    publicationDoi: is.string.isRequired,
    ownerPrefix: is.string.isRequired,

    publication: is.object.isRequired,
    publicationMessage: is.object.isRequired,
    doi: is.object.isRequired,
    selections: is.array.isRequired,

    handleRemoveFromList: is.func.isRequired,
    handleAddToList: is.func.isRequired,

    reduxControlModal: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,

    asyncGetItem: is.func.isRequired,
    asyncGetPublications: is.func.isRequired,
    asyncSubmitIssue: is.func.isRequired
  }

  toggleCheckBox = (e) => {
    const { doi } = this.props
    if(e.currentTarget.checked) {
      this.props.handleAddToList({ article: doi })
    } else {
      this.props.handleRemoveFromList({ article: doi })
    }
  }

  componentWillReceiveProps(nextProps) {
    if(!this.props.selections.length)
    if ((nextProps.doi !== this.props.doi) || (this.props.triggerModal !== nextProps.triggerModal)){
      const { doi } = nextProps.doi
      if (nextProps.triggerModal) { //its a doi
        if (nextProps.triggerModal === doi) {
          this.modalOpen();
        }
      }

    }
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
        triggerModal: this.props.triggerModal,
        ownerPrefix: this.props.ownerPrefix,

        publication: this.props.publication,
        publicationMessage: this.props.publicationMessage,
        doiMessage: this.props.publicationDoi,

        handleAddCart: this.props.handleAddCart,
        handleAddToList: this.props.handleAddToList,

        reduxCartUpdate: this.props.reduxCartUpdate,

        asyncGetPublications: this.props.asyncGetPublications,
        asyncGetItem: this.props.asyncGetItem,
        asyncSubmitIssue: this.props.asyncSubmitIssue,
      }
    })
  }

  render () {
    const { doiMessage, asyncGetItem, publicationMessage, publicationDoi, publication } = this.props
    let { status, type, date, doi } = this.props.doi;
    date = moment(date || undefined).format('MMM Do YYYY')
    //title needs to be either issue title + volume title or either one
    const { volume, issue, title} = this.props.doi.title;
    const issueTitle = title || issue || '';
    const displayTitle = `${volume && `Volume ${volume} `}${issueTitle && `Issue ${issueTitle}`}`
    const url = doi && `http://dx.doi.org/${doi}`

    const checked = !this.props.selections.length ? {checked:false} : {};

    return (<tr className='issue'>
      <td className='checkbox'><label><input type='checkbox' onClick={this.toggleCheckBox} {...checked} /><span>&nbsp;</span></label></td>
      <td className='title'>
        <a onClick={this.modalOpen} href="">{displayTitle}</a>
      </td>
      <td className='date'>{date}</td>
      <td className='type'>{type}</td>
      <td className='status'>{status}</td>
      <td className='url'>{url && <a className='issueDOILink' target='_blank' href={url}>{url}</a>}&nbsp;<Link className='issueDoiAddNew' to={`${routes.publications}/${encodeURIComponent(publicationDoi)}/${encodeURIComponent(doi)}/addarticle`}><span>Add Article</span></Link></td>
    </tr>)
  }
}
