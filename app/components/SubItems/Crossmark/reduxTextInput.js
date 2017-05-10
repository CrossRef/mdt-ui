import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { editForm } from '../../../actions/application'



const mapStateToProps = (state, props) => {
  return ({
    reduxValue: state.reduxForm[props.name]
  })
}

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxEditForm: editForm
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class ReduxTextInput extends Component {

  handler = (e) => {

    this.props.reduxEditForm({
      [e.target.name]:e.target.value
    })
  }

  render() {
    return(
      <input
        className={this.props.className}
        type='text'
        name={this.props.name}
        onChange={this.handler}
        value={this.props.reduxValue}
      />
    )
  }
}

