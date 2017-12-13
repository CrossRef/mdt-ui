import React from 'react'
import is from 'prop-types'

import {routes} from '../../routing'




export default class FormInput extends React.Component {

  static propTypes = {
    label: is.string.isRequired,
    name: is.oneOfType([is.string, is.array]).isRequired,
    value: is.string.isRequired,
    placeholder: is.string,
    required: is.bool,
    error: is.bool,
    indicatorErrors: is.array,
    allErrors: is.object,
    subItemIndex: is.string,
    errorUtility: is.object.isRequired,
    changeHandler: is.func.isRequired,
    onBlur: is.func,
    onFocus: is.func,
    disabled: is.bool,
    tooltip: is.object,
    tooltipUtility: is.object.isRequired,
    inputProps: is.object
  }


  generateId = () => {
    if(Array.isArray(this.props.name)) {
      return `${this.props.name.join('-')}`
    }

    return `${this.props.name}-${this.props.subItemIndex}`
  }


  onFocus = () => {
    if(this.props.onFocus) {
      this.props.onFocus()
    }

    if(this.props.error && this.props.indicatorErrors) {
      if(this.props.subItemIndex) {
        this.props.errorUtility.subItemIndex = this.props.subItemIndex
      }
      this.props.errorUtility.setErrorMessages(this.props.indicatorErrors, this.props.allErrors)

    } else if (this.props.tooltip) {
      this.props.errorUtility.setErrorMessages([])
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

            {isFocus && this.props.tooltip && <img className='infoFlag infoFlagInput' src={`${routes.images}/AddArticle/Asset_Icons_GY_HelpFlag.svg`} />}

            <input
              className={
                `height32 ${
                this.props.error ? 'fieldError' : ''} ${
                this.props.disabled ? 'disabledDoi' : ''} ${
                isFocus && this.props.tooltip ? 'infoFlagBorder' : ''} ${
                this.props.disabled ? 'disabledDoi' : ''}`
              }
              type='text'
              name={this.props.name}
              onChange={this.props.changeHandler}
              value={this.props.value || this.props.defaultValue || ''}
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