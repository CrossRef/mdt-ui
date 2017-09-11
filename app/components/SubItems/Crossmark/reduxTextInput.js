import React, { Component } from 'react'
import is from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { editForm } from '../../../actions/application'



const mapStateToProps = (state, props) => {
  return ({
    reduxValue: state.reduxForm.getIn(props.keyPath),
    error: !!(state.reduxForm.getIn([props.keyPath[0], props.keyPath[1], 'errors']) || {})[props.keyPath[2]]
  })
}

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxEditForm: editForm
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class ReduxTextInput extends Component {

  static propTypes = {
    className: is.string,
    reduxValue: is.string,
    error: is.bool,
    keyPath: is.array,
    handler:is.func
  }

  handler = (e) => {
    if(this.props.handler) this.props.handler(e);
    this.props.reduxEditForm(this.props.keyPath, e.target.value)
  }

  render() {
    return(
      <input
        className={`${this.props.className} ${this.props.error && 'fieldError'}`}
        type='text'
        name={this.props.name}
        onChange={this.handler}
        value={this.props.reduxValue|| this.props.keyPath[2]!=='href'?this.props.reduxValue:'http://'}
      />
    )
  }
}

