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

    this.setState({focus: true}, ()=>{
      if(this.props.tooltip) {
        this.props.deferredTooltipBubbleRefresh.resolve(this.props.tooltip)
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


  options = () => {
    var options = [
      <option key='-1'></option>,
      ...this.props.options.map((option, i) => (<option key={i} value={option.value || option}>{option.name || option}</option>))
    ]

    return (
      <select
        name={this.props.name}
        onChange={ async (e) => {
          await this.props.changeHandler(e)
          if(this.props.onSelect) {
            this.props.onSelect(e)
          }
        }}
        className={`height32 ${this.props.error ? 'fieldError' : ''} ${this.state.focus && this.props.tooltip ? 'infoFlagBorder' : ''}`}
        value={this.props.value}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
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