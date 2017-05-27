import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { stateTrackerII } from 'my_decorators'


import LoginCard from '../components/loginCard'
import { SET_AUTH_BEARER, login } from '../actions/application'



const mapStateToProps = (state) => ({
  loginState: state.login
})

const mapDispatchToProps = (dispatch) => ({
  asyncLogin: (...args) => dispatch(login(...args)),
})


@connect(mapStateToProps, mapDispatchToProps)
export default class LoginPage extends Component {

  static propTypes = {

  }

  componentDidMount () {
    localStorage.setItem('auth', '');
  }

  render () {
    const { actions, loginState, asyncLogin } = this.props
    const { login } = actions || {}

    return (
      <div className='login'>
        <LoginCard
          onLogin={asyncLogin}
          loginState={loginState} />
      </div>
    )
  }
}

