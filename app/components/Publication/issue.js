import React, { Component } from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import is from 'prop-types'

import {routes} from '../../routing'
import AddIssueModal from '../../containers/addIssueModal'
import {recordTitle} from '../../utilities/helpers'


export default class Issue extends Component {
  static propTypes = {
    triggerModal: is.string,
    cart: is.array,

    pubDoi: is.string.isRequired,
    record: is.object.isRequired,
    selections: is.array.isRequired,

    handleRemoveFromList: is.func.isRequired,
    handleAddToList: is.func.isRequired,

    reduxControlModal: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
  }


  toggleCheckBox = (e) => {
    const { record } = this.props
    if(e.currentTarget.checked) {
      this.props.handleAddToList(record)
    } else {
      this.props.handleRemoveFromList(record)
    }
  }


  componentDidMount() {
    if (this.props.triggerModal === this.props.record.doi || this.props.triggerModal === JSON.stringify(this.props.record.title)) {
      this.modalOpen();
    }
  }


  modalOpen = (e) => {
    if(e && e.preventDefault) e.preventDefault();
    this.props.reduxControlModal({
      showModal: true,
      title: 'Edit Issue/Volume',
      style: 'addIssueModal',
      Component: AddIssueModal,
      props: {
        mode: 'edit',
        pubDoi: this.props.pubDoi,
        issue: this.props.record,
        triggerModal: this.props.triggerModal,
        cart: this.props.cart,

        handleAddCart: this.props.handleAddCart,
        handleAddToList: this.props.handleAddToList,
      }
    })
  }


  render () {
    let { status, type, date, doi, title } = this.props.record;
    date = moment(date || undefined).format('MMM Do YYYY')
    const displayTitle = recordTitle(type, title)
    const url = doi && `https://doi.org/${doi}`

    const checked = !this.props.selections.length ? {checked:false} : {};

    return (<tr className='issue'>
      <td className='checkbox'><label><input type='checkbox' onClick={this.toggleCheckBox} {...checked} /><span>&nbsp;</span></label></td>
      <td className='title'>
        <a onClick={this.modalOpen} href="">{displayTitle}</a>
      </td>
      <td className='date'>{date}</td>
      <td className='type'>{type}</td>
      <td className='status'>{status}</td>
      <td className='url'>
        {url &&
        <a
          className='issueDOILink'
          target='_blank'
          href={url}>
          {url}
        </a>}
        &nbsp;
        <Link
          className='issueDoiAddNew'
          to={`${routes.publications}/${encodeURIComponent(this.props.pubDoi)}/${encodeURIComponent(doi || JSON.stringify(title))}/addarticle`}>
          <span>Add Article</span>
        </Link>
      </td>
    </tr>)
  }
}
