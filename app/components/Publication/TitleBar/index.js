import React, { Component } from 'react'
import { stateTrackerII } from 'my_decorators'


export default class TitleBar extends Component {
  render () {
    const { doi } = this.props
    const publication = doi.message || {}
    const title = (publication.title || {}).title || ''

    return (<div className='publication-title'>
      <h1>{title}</h1>
    </div>)
  }
}
