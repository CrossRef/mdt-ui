import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import client from '../../../client'
import { stateTrackerII } from 'my_decorators'


export class ArticlesPage extends Component {

  componentDidMount () {
    console.log(this.state)
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.state)
  }

  render () {
    return (
      <div className='articles'>
        Articles
        <b>Click <Link to='/publications'>here</Link> to test State Post BACK to publications.</b>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
    }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticlesPage)
