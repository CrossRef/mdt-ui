import React, { Component } from 'react'
import is from 'prop-types'
import { Link, browserHistory } from 'react-router'
import { stateTrackerII } from 'my_decorators'

import AddIssueCardRefactor from '../addIssueCardRefactor'



export default class ActionBar extends Component {

  static propTypes ={
    reduxControlModal: is.func.isRequired,
    handle: is.func.isRequired,
    doi: is.string.isRequired,
    publication: is.object.isRequired,
    handleAddCart: is.func.isRequired
  }


  constructor (props) {
    super(props)
    this.state = {
      actionMenuOpen: false
    }
  }

  toggleMenu = () => {
    this.setState({
      actionMenuOpen : !this.state.actionMenuOpen
    })
  }

  openAddIssueModal = () => {
    this.props.reduxControlModal({
      showModal: true,
      title: 'Create New Issue/Volume',
      style: 'addIssueModal',
      Component: AddIssueCardRefactor,
      props: {
        handle: this.props.handle,
        publication: this.props.publication,
        reduxControlModal: this.props.reduxControlModal
      }
    })
  }

  addToCart = () => {
    this.props.handleAddCart()
  }


  render () {
    const { doi, publication, handle } = this.props
    return (<div className='publication-actions'>
      <Link className='pull-left add-record' to={`/publications/${encodeURIComponent(doi)}/addarticle`}>Add Record</Link>
      <div className='pull-right'>
        <div className='actions' onClick={this.toggleMenu}>Action</div>
        <div className={'menuHolder' + (this.state.actionMenuOpen ? ' menu-on': '')}>
          <ul className='actions-menu'>
            <li><button onClick={this.openAddIssueModal} className="addIssue" >Create New Issue/Volume</button></li>
            <li><button onClick={this.addToCart} className="addIssue" >Add to Deposit Cart</button></li>
          </ul>
        </div>
      </div>
      <div className='clear-both' />
    </div>)
  }
}

