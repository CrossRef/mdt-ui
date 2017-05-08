import React, { Component } from 'react'
import Header from '../../components/App/Header'
import Footer from '../../components/App/Footer'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Modal from '../Modal'
import { stateTrackerII } from 'my_decorators'


export class App extends Component {
  render () {
    return (
      <div className='app'>
        <div className='app-contents'>
          <Header path={this.props.path} />
          <div className='page-contents'>
            {this.props.children}
          </div>
        </div>
        <Footer />
        <Modal />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    path: window.location.pathname
  }
}

function mapDispatchToProps (dispatch) {
  return { }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)