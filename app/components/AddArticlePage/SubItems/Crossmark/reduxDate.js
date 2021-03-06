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
    errors: state.reduxForm.getIn([...props.keyPath, 'errors']) || {}
  })
}

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxEditForm: editForm
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class ReduxDate extends Component {

  static propTypes = {
    label: is.string.isRequired,
    className: is.string,
    reduxValue: is.string,
    name: is.string,
    errors: is.object.isRequired,
    keyPath: is.array.isRequired,
    handler:is.func,
    indicatorErrors: is.array,
    errorUtility: is.object.isRequired,
    tooltip: is.object,
    tooltipUtility: is.object.isRequired,
    activeCalendar: is.string.isRequired,
    calendarHandler: is.func.isRequired
  }

  componentWillReceiveProps (nextProps) {
    const change =
      nextProps.yearValue !== this.props.yearValue ||
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


  reduxCalendarHandler = (name, dateObj) => {
    if(dateObj) {
      this.props.reduxEditForm(this.props.keyPath, {
        year: dateObj.year,
        month: dateObj.month,
        day: dateObj.day
      })
    }
    this.props.calendarHandler(name)
  }


  render() {
    return(
      <FormDate
        label={this.props.label}
        name={[...this.props.keyPath, 'date']}
        value={this.props.reduxValue}
        required={this.props.required}
        allErrors={this.props.errors}
        indicatorErrors={this.props.indicatorErrors}
        subItemIndex={String(this.props.keyPath[1])}
        errorUtility={this.props.errorUtility}
        changeHandler={this.handler}
        tooltip={this.props.tooltip}
        tooltipUtility={this.props.tooltipUtility}
        activeCalendar={this.props.activeCalendar}
        calendarHandler={this.reduxCalendarHandler}
        calendarIconStyle={{backgroundColor: 'transparent'}}
        tooltipInfoFlagStyle={{right: -1}}
        fields={{
          year: {
            value: this.props.yearValue,
            error: this.props.errors.year
          },
          month: {
            value: this.props.monthValue,
            error: this.props.errors.month
          },
          day: {
            value: this.props.dayValue,
            error: this.props.errors.day
          }
        }}
      />
    )
  }
}
