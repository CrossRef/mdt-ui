import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { editForm, authenticate } from '../actions/application'



const mapStateToProps = (state) => {
  if(state.reduxForm.submit) {
    return {
      reduxForm: state.reduxForm
    }
  } else return {}
}

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxEditForm: editForm,
  authenticate: authenticate
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class ReduxRelay extends Component {

  componentWillReceiveProps (nextProps) {
    if(nextProps.reduxForm && nextProps.reduxForm.submit) {
      nextProps.reduxForm.submit(nextProps.reduxForm);
      this.props.reduxEditForm({submit:false})
    }
  }

  render() {


    return(<button onClick={this.props.authenticate}>Test</button>)
  }
}



