import React from 'react'
import is from 'prop-types'

import {routes} from '../../routing'
import {MakeDateDropDown} from '../../utilities/date'




export default class FormDate extends React.Component {

  static propTypes = {
    label: is.string.isRequired,
    name: is.string.isRequired,
    required: is.bool,
    error: is.bool,
    changeHandler: is.func.isRequired,
    onSelect: is.func,
    onBlur: is.func,
    onFocus: is.func,
    tooltip: is.oneOfType([is.string, is.bool]),
    deferredTooltipBubbleRefresh: is.object,
    fields: is.shape({
      year: is.shape({
        value: is.string.isRequired,
        error: is.bool,
        required: is.bool
      }).isRequired,
      month: is.shape({
        value: is.string.isRequired,
        error: is.bool,
        required: is.bool
      }).isRequired,
      day: is.shape({
        value: is.string.isRequired,
        error: is.bool,
        required: is.bool
      }).isRequired
    }).isRequired
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


  onSelect = async (e) => {
    await this.props.changeHandler(e)
    if(this.props.onSelect) {
      this.props.onSelect()
    }
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
          <div className={`requiredholder ${this.props.required ? 'dateselectrequire': 'norequire'}`}>
            <div className='required height32'>
              {this.props.required && <span>*</span>}
            </div>
          </div>
          <div className='field' onBlur={this.onBlur} onFocus={this.onFocus}>

            {this.state.focus && this.props.tooltip && <img className='infoFlagDate' src={`${routes.images}/AddArticle/Asset_Icons_GY_HelpFlag.svg`} />}

            <div className='datepickerholder'>
              <div className='dateselectholder'>
                <div>Year {this.props.fields.year.required ? '(*)' : ''}</div>
                <div>
                  <MakeDateDropDown
                    handler={this.onSelect}
                    name={`${this.props.name}Year`}
                    type="y"
                    value={this.props.fields.year.value}
                    validation={this.props.error || this.props.fields.year.error}
                    style={`${this.state.focus && this.props.tooltip ? 'infoFlagBorder' : ''}`}/>
                </div>
              </div>
              <div className='dateselectholder'>
                <div>Month</div>
                <div>
                  <MakeDateDropDown
                    handler={this.onSelect}
                    name={`${this.props.name}Month`}
                    type="m"
                    value={this.props.fields.month.value}
                    validation={this.props.error || this.props.fields.month.error}
                    style={`${this.state.focus && this.props.tooltip ? 'infoFlagBorder' : ''}`}/>
                </div>
              </div>
              <div className='dateselectholder'>
                <div>Day</div>
                <div>
                  <MakeDateDropDown
                    handler={this.onSelect}
                    name={`${this.props.name}Day`}
                    type="d"
                    value={this.props.fields.day.value}
                    validation={this.props.error || this.props.fields.day.error}
                    style={`${this.state.focus && this.props.tooltip ? 'infoFlagBorder' : ''}`}/>
                </div>
              </div>
              <div className='dateicon'>
                <div>&nbsp;</div>
                <div className={`iconHolder ${this.state.focus && this.props.tooltip ? 'infoFlag infoFlagIconHolder' : ''}`}>
                  <a className="calendarButton">
                    <img className='calendarIcon' src={`${routes.images}/DepositHistory/Asset_Icons_Black_Calandar.svg`} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  }
}