import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { stateTrackerII } from 'my_decorators'


import LoginCard from '../components/loginCard'
import { SET_AUTH_BEARER, authenticate } from '../actions/application'
import client from '../client'



const mapStateToProps = (state) => ({
  loginState: state.login
})

const mapDispatchToProps = (dispatch) => ({
  authenticate: (...args) => dispatch(authenticate(...args)),
  actions: bindActionCreators({
      login: (usr, pwd) => client.actions.login.sync({}, {
        body: JSON.stringify({ usr, pwd })
      }),
      loginReset: () => {
        client.actions.login.reset()
        dispatch(SET_AUTH_BEARER())
      }
    }, dispatch)
})


@connect(mapStateToProps, mapDispatchToProps)
export default class LoginPage extends Component {

  static propTypes = {

  }

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
          authenticate={this.props.authenticate}
          onLogin={login}
          loginState={loginState} />
      </div>
    )
  }
}

