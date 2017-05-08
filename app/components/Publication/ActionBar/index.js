import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import AddIssueCard from '../../AddIssueCard'
import { stateTrackerII } from 'my_decorators'


export default class ActionBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      actionMenuOpen: false
    }
  }

  toggleMenu () {
    this.setState({
      actionMenuOpen : !this.state.actionMenuOpen
    })
  }

  render () {
    const { doi, doiMessage, handle } = this.props
    return (<div className='publication-actions'>
      <Link className='pull-left add-record' doi={doi} to={`/publications/${encodeURIComponent(doi)}/addarticle`}>Add Record</Link>
      <div className='pull-right'>
        <div className='actions' onClick={()=>this.toggleMenu()}>Action</div>
        <div className={'menuHolder' + (this.state.actionMenuOpen ? ' menu-on': '')}>
          <ul className='actions-menu'>
            <li><AddIssueCard doi={doi} publication={doiMessage} handle={handle} /></li>
          </ul>
        </div>
      </div>
      <div className='clear-both' />
    </div>)
  }
}

