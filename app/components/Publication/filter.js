import React, { Component } from 'react'
import is from 'prop-types'
import { Link } from 'react-router'
import { stateTrackerII } from 'my_decorators'


export default class PublicationFilter extends Component {
  static propTypes = {
    handleFilter: is.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      current: 'all'
    }
  }

  filter = (type) => {
    this.setState({
      current: type
    })
    this.props.handleFilter(type)
  }

  render () {
    return (<div className='publication-header'>
      <div className='publication-status-selector'>
        <Link onClick={()=>{this.filter('all')}} className={(this.state.current === 'all') ? 'selected' : ''}>All</Link>
        <Link onClick={()=>{this.filter('draft')}} className={(this.state.current === 'draft') ? 'selected' : ''}>Draft</Link>
        <Link onClick={()=>{this.filter('accepted')}} className={(this.state.current === 'accepted') ? 'selected' : ''}>Accepted</Link>
        <Link onClick={()=>{this.filter('failed')}} className={(this.state.current === 'failed') ? 'selected' : ''}>Failed</Link>
      </div>
    </div>)
  }
}
