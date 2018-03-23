import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { SET_AUTH_BEARER, login, resetLogin, resetPublications } from '../actions/application'



const mapStateToProps = (state) => ({
  loginState: state.login
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  asyncLogin: login,
  reduxResetLogin: resetLogin,
  reduxResetPublications: resetPublications
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class LoginPage extends Component {

  static propTypes = {
    loginState: is.object.isRequired,
    asyncLogin: is.func.isRequired,
    reduxResetLogin: is.func.isRequired,
    reduxResetPublications: is.func.isRequired
  }

  state = {
    username: '',
    password: ''
  }

  componentDidMount () {
    localStorage.setItem('auth', '');
    this.props.reduxResetLogin()
    this.props.reduxResetPublications()
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.asyncLogin(
      this.state.username,
      this.state.password
    )
  }

  inputHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render () {
    const error = this.props.loginState && this.props.loginState.error
    return (
      <div className='login'>
        <div className={'login-card' + (error ? ' invalid-credentials' : '')}>
          <form onSubmit={this.onSubmit}>
            <span className='left-indent-16 card-title'>Login</span>
            <label>
              <span className='left-indent-16'>Username</span>
              <input
                type='text'
                name='username'
                value={this.state.username}
                onChange={this.inputHandler} />
            </label>
            <label>
              <span className='left-indent-16'>Password</span>
              <input
                type='password'
                name='password'
                value={this.state.password}
                onChange={this.inputHandler} />
            </label>
            <input
              type='submit'
              className='button-anchor loginButton'
              value='Log in' />
            {error && <div className='invalid-credentials'>Please enter a correct username and password.</div>}
            <div className='forgot-password'>
              <a href='#'>Forgot password?</a>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

