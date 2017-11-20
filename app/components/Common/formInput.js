import React from 'react'
import is from 'prop-types'

import {routes} from '../../routing'




export default class FormInput extends React.Component {

  static propTypes = {
    label: is.string.isRequired,
    name: is.string.isRequired,
    value: is.string.isRequired,
    placeholder: is.string,
    required: is.bool,
    error: is.bool,
    setErrorMessages: is.func,
    trackErrors: is.array,
    allErrors: is.object,
    changeHandler: is.func.isRequired,
    onBlur: is.func,
    onFocus: is.func,
    disabled: is.bool,
    tooltip: is.oneOfType([is.string, is.bool]),
    deferredTooltipBubbleRefresh: is.object,
    inputProps: is.object
  }


  state = {
    focus: false
  }


  onFocus = () => {
    if(this.props.onFocus) {
      this.props.onFocus()
    }

    const setErrorMessages = () => {
      if(this.props.setErrorMessages && this.props.error && this.props.trackErrors) {
        if(this.props.subItemIndex) {
          this.props.errorUtility.subItemIndex = this.props.subItemIndex
        }
        this.props.setErrorMessages(this.props.trackErrors, this.props.allErrors)
      }
    }

    this.setState({focus: true}, ()=>{
      if(this.props.tooltip) {
        this.props.setErrorMessages([])
        setErrorMessages()
        this.props.deferredTooltipBubbleRefresh.resolve(this.props.tooltip)
      } else {
        setErrorMessages()
      }
    })
  }


  onBlur = () => {
    if(this.props.onBlur) {
      this.props.onBlur()
    }

    this.setState({focus: false}, ()=>{
      if(this.props.tooltip) {
        this.props.deferredTooltipBubbleRefresh.resolve()
      }
    })
  }


  render() {
    return (
      <div className='fieldinnerholder halflength'>
        <div className='labelholder'>
          <div className='labelinnerholder'>
            <div className='label'>{this.props.label}</div>
          </div>
        </div>
        <div className='requrefieldholder'>
          <div className={`requiredholder ${!this.props.required && 'norequire'}`}>
            <div className='required height32'>{this.props.required && <span>*</span>}</div>
          </div>
          <div className='field'>

            {this.state.focus && this.props.tooltip && <img className='infoFlag infoFlagInput' src={`${routes.images}/AddArticle/Asset_Icons_GY_HelpFlag.svg`} />}

            <input
              className={
                `height32 ${
                this.props.error ? 'fieldError' : ''} ${
                this.props.disabled ? 'disabledDoi' : ''} ${
                this.state.focus && this.props.tooltip ? 'infoFlagBorder' : ''} ${
                this.props.disabled ? 'disabledDoi' : ''}`
              }
              type='text'
              name={this.props.name}
              onChange={this.props.changeHandler}
              value={this.props.value || this.props.defaultValue}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              disabled={this.props.disabled}
              {...(this.props.inputProps ? this.props.inputProps : {})}

            />
          </div>
        </div>
      </div>
    )

  }
}