import React, { Component } from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import is from 'prop-types'
import { stateTrackerII } from 'my_decorators'
import {routes} from '../../routing'
import AddIssueCard from '../addIssueCard'


export default class Issue extends Component {
  static propTypes = {
    ownerPrefix: is.string.isRequired,
    triggerModal: is.string,
    cart: is.array,

    publication: is.object.isRequired,
    record: is.object.isRequired,
    selections: is.array.isRequired,

    handleRemoveFromList: is.func.isRequired,
    handleAddToList: is.func.isRequired,

    reduxControlModal: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,

    asyncGetPublications: is.func.isRequired,
  }

  toggleCheckBox = (e) => {
    const { record } = this.props
    if(e.currentTarget.checked) {
      this.props.handleAddToList({ article: record })
    } else {
      this.props.handleRemoveFromList({ article: record })
    }
  }

  componentDidMount() {
    if (this.props.triggerModal === this.props.record.doi) {
      this.modalOpen();
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
        issue: this.props.record,
        triggerModal: this.props.triggerModal,
        ownerPrefix: this.props.ownerPrefix,
        publication: this.props.publication,
        cart: this.props.cart,

        handleAddCart: this.props.handleAddCart,
        handleAddToList: this.props.handleAddToList,

        reduxCartUpdate: this.props.reduxCartUpdate,

        asyncGetPublications: this.props.asyncGetPublications,
      }
    })
  }

  render () {
    const publicationDoi = this.props.publication.message.doi;
    let { status, type, date, doi } = this.props.record;
    date = moment(date || undefined).format('MMM Do YYYY')
    const { volume, issue} = this.props.record.title;
    const displayTitle = `${volume && `Volume ${volume}, `}Issue ${issue}`
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
