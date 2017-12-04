import React from 'react'
import is from 'prop-types'

import {routes} from '../../routing'




export default class FormTextArea extends React.Component {

  static propTypes = {
    label: is.string.isRequired,
    name: is.string.isRequired,
    value: is.string.isRequired,
    required: is.bool,
    error: is.bool,
    trackErrors: is.array,
    allErrors: is.object,
    setErrorMessages: is.func,
    errorUtility: is.object,
    subItemIndex: is.string,
    changeHandler: is.func.isRequired,
    onBlur: is.func,
    onFocus: is.func,
    tooltip: is.oneOfType([is.string, is.bool]),
    tooltipUtility: is.object
  }


  generateId = () => {
    return `${this.props.name}-${this.props.subItemIndex}`
  }


  onFocus = () => {
    if(this.props.onFocus) {
      this.props.onFocus()
    }

    if(this.props.setErrorMessages && this.props.error && this.props.trackErrors) {
      if(this.props.subItemIndex) {
        this.props.errorUtility.subItemIndex = this.props.subItemIndex
      }
      this.props.setErrorMessages(this.props.trackErrors, this.props.allErrors)

    } else if (this.props.tooltip) {
      this.props.setErrorMessages([])
    }

    this.props.tooltipUtility.assignFocus(this.generateId(), this.props.tooltip)
  }


  onBlur = () => {
    if(this.props.onBlur) {
      this.props.onBlur()
    }
  }


  render() {
    const isFocus = this.props.tooltipUtility.getFocusedInput() === this.generateId()

    return (
      <div className='fieldinnerholder fulllength'>
        <div className='labelholder'>
          <div className='labelinnerholder'>
            <div className='label'>{this.props.label}</div>
          </div>
        </div>
        <div className='requrefieldholder'>
          <div className={`requiredholder ${!this.props.required && 'norequire'}`}>
            <div className='required height64'>{this.props.required && <span>*</span>}</div>
          </div>
          <div className='field'>
            {isFocus && this.props.tooltip && <img className='infoFlag infoFlagTextArea' src={`${routes.images}/AddArticle/Asset_Icons_GY_HelpFlag.svg`} />}
            <textarea
              className={`height64 ${this.props.error ? 'fieldError' : ''} ${isFocus && this.props.tooltip ? 'infoFlagBorder' : ''}`}
              type='text'
              name={this.props.name}
              onChange={this.props.changeHandler}
              value={this.props.value}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            />
          </div>
        </div>
      </div>
    )

  }
}
