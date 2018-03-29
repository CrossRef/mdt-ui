import React from 'react'
import is from 'prop-types'

import {routes} from '../../routing'




export default class FormSelect extends React.Component {

  static propTypes = {
    label: is.string.isRequired,
    name: is.oneOfType([is.string, is.array]).isRequired,
    value: is.string.isRequired,
    options: is.array.isRequired,
    required: is.bool,
    error: is.bool,
    indicatorErrors: is.array,
    allErrors: is.object,
    subItemIndex: is.string,
    errorUtility: is.object.isRequired,
    changeHandler: is.func.isRequired,
    onSelect: is.func,
    onBlur: is.func,
    onFocus: is.func,
    disabled: is.bool,
    tooltip: is.object,
    tooltipUtility: is.object.isRequired
  }


  generateId = () => {
    if(Array.isArray(this.props.name)) {
      return `${this.props.name.join('-')}`.replace(/\s+/g, '')
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


  onSelect = async (e) => {
    await this.props.changeHandler(e)
    if(this.props.onSelect) {
      this.props.onSelect()
    }
    this.node.blur()
  }


  options = () => {
    const isFocus = this.props.tooltipUtility.getFocusedInput() === this.generateId()

    var options = [
      <option key='-1'></option>,
      ...this.props.options.map((option, i) => (
        <option key={i} value={typeof option === 'object' ? option.value : option}>{option.name || option}</option>
      ))
    ]

    return (
      <select
        name={this.props.name}
        onChange={this.onSelect}
        className={
          `height32 ${
          this.props.error ? 'fieldError' : ''} ${
          isFocus && this.props.tooltip ? 'infoFlagBorder' : ''} ${
          this.props.disabled ? 'disabledDoi' : ''}`
        }
        value={this.props.value}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        disabled={this.props.disabled}
        ref={(node)=>this.node=node}
      >
        {options}
      </select>
    )
  }


  render() {
    const isFocus = this.props.tooltipUtility.getFocusedInput() === this.generateId()

    return (
      <div className={`fieldinnerholder halflength ${this.props.style || ''}`}>
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

            {isFocus && this.props.tooltip && <img className='infoFlag infoFlagInput' src={`${routes.images}/common/Asset_Icons_GY_HelpFlag.svg`} />}

            {this.options()}
          </div>
        </div>
      </div>
    )

  }
}