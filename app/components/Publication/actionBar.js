import React, { Component } from 'react'
import $ from 'jquery'
import is from 'prop-types'
import { browserHistory } from 'react-router'

import AddIssueCard from '../addIssueCard'
import {routes} from '../../routing'



export default class ActionBar extends Component {

  static propTypes ={
    reduxControlModal: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    asyncGetPublications: is.func.isRequired,
    doi: is.string.isRequired,
    publication: is.object.isRequired,
    handleAddCart: is.func.isRequired,
    deleteSelections: is.func.isRequired,
    ownerPrefix: is.string.isRequired,
    selections: is.array.isRequired
  }


  constructor (props) {
    super(props)
    this.state = {
      actionMenuOpen: false,
      addRecordMenuOpen: false
    }
  }

  handleClick = e => {
    const element = $(e.target)
    if(!(element.parents('.actionBarDropDown').length || element.is('.actionBarDropDown, .tooltips'))) {
      this.setState({ actionMenuOpen: false, addRecordMenuOpen: false })
    }
  }

  componentWillUpdate (nextProps, nextState) {
    const aMenuIsOpen = nextState.actionMenuOpen || nextState.addRecordMenuOpen
    const aMenuClosed = (this.state.actionMenuOpen && !nextState.actionMenuOpen) || (this.state.addRecordMenuOpen && !nextState.addRecordMenuOpen)

    if(aMenuIsOpen) {
      document.addEventListener('click', this.handleClick, false)
    } else if (aMenuClosed) {
      document.removeEventListener('click', this.handleClick, false)
    }
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleClick, false)
  }

  openAddIssueModal = () => {
    this.props.reduxControlModal({
      showModal: true,
      title: 'Create New Issue/Volume',
      style: 'addIssueModal',
      Component: AddIssueCard,
      props: {
        asyncGetPublications: this.props.asyncGetPublications,
        publication: this.props.publication,
        reduxControlModal: this.props.reduxControlModal,
	      reduxCartUpdate: this.props.reduxCartUpdate,
        ownerPrefix: this.props.ownerPrefix
      }
    })
  }

  onlyIssueSelected = () => {
    const selections = this.props.selections
    if(!selections.length) {
      return false
    }
    const types = selections.map((selection) => {
      return selection.article.type
    })
    return !(types.indexOf('article') !== -1)
  }


  render () {
    const onlyIssue = this.onlyIssueSelected()
    console.log(this.props.selections.length === 1 && !onlyIssue)
    const { doi, publication, handleAddCart, deleteSelections, duplicateSelection } = this.props
    return (<div className='publication-actions'>
      <div className="pull-left add-record tooltips" onClick={() => this.setState({ addRecordMenuOpen: !this.state.addRecordMenuOpen, actionMenuOpen: false })}>
        Add Record
        {this.state.addRecordMenuOpen && <div className='actionBarDropDown'>
          <p onClick={()=>browserHistory.push(`${routes.publications}/${encodeURIComponent(doi)}/addarticle`)}>New Article</p>
          <p onClick={this.openAddIssueModal}>New Volume/Issue</p>
        </div>}
      </div>
      <div className='pull-right'>
        <div className={`actions tooltips ${this.props.selections.length ? 'activeAction' : ''}`}
          onClick={this.props.selections.length ? () => this.setState({ actionMenuOpen : !this.state.actionMenuOpen, addRecordMenuOpen: false }) : null}
        >
          Action
          {this.state.actionMenuOpen && <div className='actionBarDropDown'>
            {!onlyIssue ? <p onClick={handleAddCart}>Add to Cart</p> : <p className="grayedOut">Add to Cart</p>}
            {this.props.selections.length === 1 && !onlyIssue ? <p onClick={duplicateSelection}>Duplicate</p> : <p className="grayedOut">Duplicate</p>}
            <p onClick={deleteSelections}>Remove</p>
          </div>}
        </div>
      </div>
      <div className='clear-both' />
    </div>)
  }
}

