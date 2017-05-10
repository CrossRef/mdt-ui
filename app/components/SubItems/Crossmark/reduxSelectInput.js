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
export default class ReduxSelectInput extends Component {

  handler = (e) => {

    this.props.reduxEditForm({
      [e.target.name]:e.target.value
    })
  }

  render() {
    return(
      <select
        className={this.props.className}
        type='text'
        name={this.props.name}
        onChange={this.handler}
        value={this.props.reduxValue}
      >
        {this.props.options.map((value, index)=>{
          return ( <option key={index}>{value}</option> )
        })}
      </select>
    )
  }
}
