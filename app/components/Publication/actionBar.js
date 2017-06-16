import React, { Component } from 'react'
import is from 'prop-types'
import { Link, browserHistory } from 'react-router'
import { stateTrackerII } from 'my_decorators'

import AddIssueCard from '../addIssueCard'



export default class ActionBar extends Component {

  static propTypes ={
    reduxControlModal: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    handle: is.func.isRequired,
    doi: is.string.isRequired,
    publication: is.object.isRequired,
    handleAddCart: is.func.isRequired,
    deleteSelections: is.func.isRequired,
    postIssue: is.func.isRequired,
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

  openAddIssueModal = () => {
    this.props.reduxControlModal({
      showModal: true,
      title: 'Create New Issue/Volume',
      style: 'addIssueModal',
      Component: AddIssueCard,
      props: {
        handle: this.props.handle,
        publication: this.props.publication,
        reduxControlModal: this.props.reduxControlModal,
	      reduxCartUpdate: this.props.reduxCartUpdate,
        postIssue: this.props.postIssue,
        ownerPrefix: this.props.ownerPrefix
      }
    })
  }

  onlyIssueSelected = () => {
    const selections = this.props.selections;
    if(!selections.length) return false;
    const types = selections.map((selection) => {
      return selection.article.type
    });
    return !types.includes('article')
  }


  render () {
    const onlyIssue = this.onlyIssueSelected();
    const { doi, publication, handle, handleAddCart, deleteSelections, duplicateSelection } = this.props
    return (<div className='publication-actions'>
      <div className="pull-left add-record tooltips" onClick={() => this.setState({ addRecordMenuOpen: !this.state.addRecordMenuOpen, actionMenuOpen: false })}>
        Add Record
        {this.state.addRecordMenuOpen && <div>
          <p onClick={()=>browserHistory.push(`/publications/${encodeURIComponent(doi)}/addarticle`)}>New Article</p>
          <p onClick={this.openAddIssueModal}>New Volume/Issue</p>
        </div>}
      </div>
      <div className='pull-right'>
        <div className={`actions tooltips ${this.props.selections.length ? 'activeAction' : ''}`}
          onClick={this.props.selections.length ? () => this.setState({ actionMenuOpen : !this.state.actionMenuOpen, addRecordMenuOpen: false }) : null}
        >
          Action
          {this.state.actionMenuOpen && <div>
            <p className={onlyIssue ? 'grayedOut' : ''} onClick={onlyIssue ? null : handleAddCart}>Add to Cart</p>
            <p onClick={duplicateSelection}>Duplicate</p>
            <p onClick={deleteSelections}>Remove</p>
          </div>}
        </div>
      </div>
      <div className='clear-both' />
    </div>)
  }
}

