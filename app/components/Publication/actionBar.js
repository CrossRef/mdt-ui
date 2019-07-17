import React, { Component } from 'react'
import $ from 'jquery'
import is from 'prop-types'
import { browserHistory } from 'react-router'

import AddIssueModal from '../../containers/addIssueModal'
import {routes} from '../../routing'



export default class ActionBar extends Component {

  static propTypes ={
    newArticle: is.func.isRequired,
    addIssue: is.func.isRequired,
    bulkUpdate: is.func.isRequired,
    transferTitle: is.func.isRequired,
    handleAddCart: is.func.isRequired,
    deleteSelections: is.func.isRequired,
    duplicateSelection: is.func.isRequired,
    selections: is.array.isRequired,
    newToCart: is.bool.isRequired
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


  onlyIssueSelected = () => {
    const selections = this.props.selections
    if(!selections.length) {
      return false
    }
    const types = selections.map((selection) => {
      return selection.type
    })
    return !(types.indexOf('article') !== -1)
  }


  render () {
    const onlyIssue = this.onlyIssueSelected()
    const { handleAddCart, deleteSelections, duplicateSelection, moveSelection, addIssue, newArticle, bulkUpdate, transferTitle, newToCart } = this.props
    return (<div className='publication-actions'>
      <div className="pull-left add-record tooltips" onClick={() => this.setState({ addRecordMenuOpen: !this.state.addRecordMenuOpen, actionMenuOpen: false })}>
        New record
        {this.state.addRecordMenuOpen && <div className='actionBarDropDown'>
          <p onClick={newArticle}>New article</p>
          <p onClick={addIssue}>New volume/issue</p>
          <p onClick={bulkUpdate}>Bulk update</p>
        </div>}
      </div>
      <div className='pull-right'>
        <div className={`actions tooltips activeAction`}
          onClick={() => this.setState({ actionMenuOpen : !this.state.actionMenuOpen, addRecordMenuOpen: false })}
        >
          Action
          {this.state.actionMenuOpen && <div className='actionBarDropDown'>
            {this.props.selections.length && !onlyIssue && newToCart ? <p onClick={handleAddCart}>Add to deposit</p> : <p className="grayedOut">Add to deposit</p>}
            {this.props.selections.length && !onlyIssue ? <p onClick={moveSelection}>Move to</p> : <p className="grayedOut">Move to</p>}
            {this.props.selections.length && !onlyIssue ? <p onClick={duplicateSelection}>Duplicate</p> : <p className="grayedOut">Duplicate</p>}
            {this.props.selections.length ? <p onClick={deleteSelections}>Remove</p> : <p className="grayedOut">Remove</p>}
            <p onClick={transferTitle}>Transfer title</p>
          </div>}
        </div>
      </div>
      <div className='clear-both' />
    </div>)
  }
}

