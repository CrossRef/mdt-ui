import React, { Component } from 'react'
import is from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { editForm } from '../../../../actions/application'
import FormInput from '../../../Common/formInput'



const mapStateToProps = (state, props) => {
  return ({
    reduxValue: state.reduxForm.getIn(props.keyPath) || '',
    errors: state.reduxForm.getIn([props.keyPath[0], props.keyPath[1], 'errors']) || {}
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
    errors: is.object.isRequired,
    trackErrors: is.array,
    setErrorMessages: is.func,
    errorUtility: is.object,
    keyPath: is.array,
    handler:is.func
  }

  handler = (e) => {
    if(this.props.handler) this.props.handler(e);
    this.props.reduxEditForm(this.props.keyPath, e.target.value)
  }

  render() {
    let error = !!this.props.errors[`${this.props.keyPath[0]} ${this.props.keyPath[2]}`]
    if(this.props.keyPath[2] === 'doi') {
      error =
        !!this.props.errors[`${this.props.keyPath[0]} doi`] ||
        !!this.props.errors[`${this.props.keyPath[0]} doiInvalid`] ||
        !!this.props.errors[`${this.props.keyPath[0]} doiNotExist`]
    }

    return(
      <FormInput
        label={this.props.label}
        name={this.props.name || ''}
        value={this.props.reduxValue|| this.props.keyPath[2]!=='href'?this.props.reduxValue:'http://'}
        changeHandler={this.handler}
        required={this.props.required}
        error={error}
        allErrors={this.props.errors}
        trackErrors={this.props.trackErrors}
        setErrorMessages={this.props.setErrorMessages}
        errorUtility={this.props.errorUtility}
        subItemIndex={String(this.props.keyPath[1])}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        tooltipUtility={this.props.tooltipUtility}
        tooltip={this.props.tooltip}/>
    )
  }
}

