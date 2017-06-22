import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'


const mapDispatchToProps = dispatch => ({})


@connect(mapDispatchToProps)
export default class ArticlesPage extends Component {

  static propTypes = {}

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
        <b>Click <Link to=''>here</Link> to test State Post BACK to publications.</b>
      </div>
    )
  }
}






