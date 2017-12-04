import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'

import ErrorIndicator from '../../../Common/errorIndicator'



const mapStateToProps = (state, props) => {
  return ({
    allErrors: state.reduxForm.getIn(props.errorsKeyPath) || {}
  })
}


@connect(mapStateToProps)
export default class ReduxIndicator extends Component {

  static propTypes = {
    className: is.string,
    errorsKeyPath: is.array.isRequired,
    trackErrors: is.array.isRequired,
    errorMessages: is.array.isRequired,
    errorUtility: is.object.isRequired,
    tooltipUtility: is.object.isRequired,
    style: is.string
  }


  render() {
    return(
      <ErrorIndicator
        style={this.props.style}
        trackErrors={this.props.trackErrors}
        allErrors={this.props.allErrors}
        errorMessages={this.props.errorMessages}
        errorUtility={this.props.errorUtility}
        tooltipUtility={this.props.tooltipUtility}
        subItem={this.props.errorsKeyPath[0]}
        subItemIndex={String(this.props.errorsKeyPath[1])}
      />
    )
  }
}
