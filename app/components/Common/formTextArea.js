import React from 'react'
import is from 'prop-types'

import {routes} from '../../routing'




export default class FormInput extends React.Component {

  static propTypes = {
    label: is.string.isRequired,
    name: is.string.isRequired,
    value: is.string.isRequired,
    required: is.bool,
    error: is.bool,
    changeHandler: is.func.isRequired,
    onBlur: is.func,
    onFocus: is.func,
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


  render() {
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
            {this.state.focus && this.props.tooltip && <img className='infoFlag infoFlagTextArea' src={`${routes.images}/AddArticle/Asset_Icons_GY_HelpFlag.svg`} />}
            <textarea
              className={`height64 ${this.props.error ? 'fieldError' : ''} ${this.state.focus && this.props.tooltip ? 'infoFlagBorder' : ''}`}
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
