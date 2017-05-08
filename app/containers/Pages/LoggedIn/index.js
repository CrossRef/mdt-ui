import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import client from '../../../client'
import { stateTrackerII } from 'my_decorators'


export class LoggedInPage extends Component {
  render () {
    return (
      <div className='login'>
        <div style={{background: 'white'}}>You are logged in!</div>
      </div>
    )
  }
}


function mapStateToProps (state) {
  return {
    loginState: state.login
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      login: client.actions.login.sync
    }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoggedInPage)
