import React, { Component } from 'react'
import { stateTrackerII } from 'my_decorators'


export default class LoginCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  onSubmit (e) {
    e.preventDefault()

    this.props.onLogin(
      this.state.username,
      this.state.password
    )
  }

  handleUsernameChange (e) {
    this.setState({
      username: e.target.value
    })
  }

  handlePasswordChange (e) {
    this.setState({
      password: e.target.value
    })
  }

  render () {
    const error = (this.props.loginState || {}).error
    return (
      <div className={'login-card' + (error ? ' invalid-credentials' : '')}>
        <form onSubmit={this.onSubmit.bind(this)}>
          <span className='left-indent-16 card-title'>Login</span>
          <label>
            <span className='left-indent-16'>Username</span>
            <input
              type='text'
              name='username'
              value={this.state.username}
              onChange={this.handleUsernameChange.bind(this)} />
          </label>
          <label>
            <span className='left-indent-16'>Password</span>
            <input
              type='password'
              name='password'
              value={this.state.password}
              onChange={this.handlePasswordChange.bind(this)} />
          </label>
          <input
            type='submit'
            className='button-anchor'
            value='Log In' />
          {error && <div className='invalid-credentials'>Please enter a correct username and password.</div>}
          <div className='forgot-password'>
            <a href='#'>Forgot password?</a>
          </div>
        </form>
      </div>
    )
  }
}
