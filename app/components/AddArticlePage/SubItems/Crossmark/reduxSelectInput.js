import React, { Component } from 'react'
import is from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { editForm } from '../../../../actions/application'
import FormSelect from '../../../Common/formSelect'



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
export default class ReduxSelectInput extends Component {

  static propTypes = {
    className: is.string,
    options: is.array.isRequired,
    reduxValue: is.string,
    errors: is.object.isRequired,
    trackErrors: is.array,
    setErrorMessages: is.func,
    errorUtility: is.object,
    keyPath: is.array,
    handler:is.func
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.reduxValue !== this.props.reduxValue) {
      this.props.onSelect()
    }
  }

  handler = (e) => {
    if(this.props.handler) this.props.handler(e);
    this.props.reduxEditForm(this.props.keyPath, e.target.value)
  }

  render() {
    return(
      <FormSelect
        label={this.props.label}
        name={this.props.name || ''}
        value={this.props.reduxValue}
        required={this.props.required}
        error={!!this.props.errors[`${this.props.keyPath[0]} ${this.props.keyPath[2]}`]}
        allErrors={this.props.errors}
        trackErrors={this.props.trackErrors}
        setErrorMessages={this.props.setErrorMessages}
        subItemIndex={String(this.props.keyPath[1])}
        errorUtility={this.props.errorUtility}
        options={this.props.options}
        changeHandler={this.handler}
        style={this.props.style}
        deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
        tooltip={this.props.tooltip}/>
    )
  }
}
