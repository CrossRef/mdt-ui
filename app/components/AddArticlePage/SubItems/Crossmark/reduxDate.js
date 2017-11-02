import React, { Component } from 'react'
import is from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { editForm } from '../../../../actions/application'
import FormDate from '../../../Common/formDate'



const mapStateToProps = (state, props) => {
  return ({
    yearValue: state.reduxForm.getIn([...props.keyPath, 'year']) || '',
    monthValue: state.reduxForm.getIn([...props.keyPath, 'month']) || '',
    dayValue: state.reduxForm.getIn([...props.keyPath, 'day']) || '',
    yearError: !!(state.reduxForm.getIn([...props.keyPath, 'errors']) || {}).year,
    monthError: !!(state.reduxForm.getIn([...props.keyPath, 'errors']) || {}).month,
    dayError: !!(state.reduxForm.getIn([...props.keyPath, 'errors']) || {}).day
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
    error: is.bool,
    keyPath: is.array,
    handler:is.func
  }

  componentWillReceiveProps (nextProps) {
    const change = nextProps.yearValue !== this.props.yearValue ||
        nextProps.monthValue !== this.props.monthValue ||
        nextProps.dayValue !== this.props.dayValue
    if(change) {
      this.props.onSelect()
    }
  }

  handler = (e) => {
    if(this.props.handler) this.props.handler(e);
    this.props.reduxEditForm([...this.props.keyPath, e.target.name.toLowerCase()], e.target.value)
  }

  render() {
    return(
      <FormDate
        label={this.props.label}
        name={this.props.name || ''}
        value={this.props.reduxValue}
        required={this.props.required}
        error={this.props.error}
        options={this.props.options}
        changeHandler={this.handler}
        tooltip={this.props.tooltip}
        fields={{
          year: {
            value: this.props.yearValue,
            error: this.props.yearError
          },
          month: {
            value: this.props.monthValue,
            error: this.props.monthError
          },
          day: {
            value: this.props.dayValue,
            error: this.props.dayError
          }
        }}
      />
    )
  }
}
