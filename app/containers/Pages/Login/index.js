import React, { Component } from 'react'
import LoginCard from '../../../components/LoginCard'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { SET_AUTH_BEARER } from '../../../actions/application'

import client from '../../../client'
import { stateTrackerII } from 'my_decorators'


export class Login extends Component {
  componentDidMount () {
    if (client.isLoggedIn()) {
      this.props.actions.loginReset({})
    }
  }

  render () {
    const { actions, loginState } = this.props
    const { login } = actions || {}

    return (
      <div className='login'>
        <LoginCard
          onLogin={login}
          loginState={loginState} />
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
      login: (usr, pwd) => client.actions.login.sync({}, {
        body: JSON.stringify({ usr, pwd })
      }),
      loginReset: () => {
        client.actions.login.reset()
        dispatch(SET_AUTH_BEARER())
      }
    }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
