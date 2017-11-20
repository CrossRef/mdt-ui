import React from 'react'
import is from 'prop-types'

import {routes} from '../../routing'




export default class FormSelect extends React.Component {

  static propTypes = {
    label: is.string.isRequired,
    name: is.string.isRequired,
    value: is.string.isRequired,
    options: is.array.isRequired,
    required: is.bool,
    error: is.bool,
    trackErrors: is.array,
    allErrors: is.object,
    setErrorMessages: is.func.isRequired,
    changeHandler: is.func.isRequired,
    onSelect: is.func,
    onBlur: is.func,
    onFocus: is.func,
    disabled: is.bool,
    tooltip: is.oneOfType([is.string, is.bool]),
    deferredTooltipBubbleRefresh: is.object
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


  onSelect = async (e) => {
    await this.props.changeHandler(e)
    if(this.props.onSelect) {
      this.props.onSelect()
    }
    this.node.blur()
  }


  options = () => {
    var options = [
      <option key='-1'></option>,
      ...this.props.options.map((option, i) => (<option key={i} value={option.value || option}>{option.name || option}</option>))
    ]

    return (
      <select
        name={this.props.name}
        onChange={this.onSelect}
        className={
          `height32 ${
          this.props.error ? 'fieldError' : ''} ${
          this.state.focus && this.props.tooltip ? 'infoFlagBorder' : ''} ${
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

            {this.state.focus && this.props.tooltip && <img className='infoFlag infoFlagInput' src={`${routes.images}/AddArticle/Asset_Icons_GY_HelpFlag.svg`} />}

            {this.options()}
          </div>
        </div>
      </div>
    )

  }
}