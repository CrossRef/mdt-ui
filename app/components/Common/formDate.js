import React from 'react'
import is from 'prop-types'

import {routes} from '../../routing'
import {makeDateDropDown} from '../../utilities/date'




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
    tooltip: is.bool.isRequired,
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
    if(this.props.tooltip) {
      console.log('do tooltip stuff')
    }
    this.setState({focus: true})
  }


  onBlur = () => {
    if(this.props.onBlur) {
      this.props.onBlur()
    }
    this.setState({focus: false})
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

            {this.state.focus && this.props.tooltip && <img className='infoFlag' src={`${routes.images}/AddArticle/Asset_Icons_Grey_Help.svg`} />}

            <div className='datepickerholder'>
              <div className='dateselectholder'>
                <div>Year {this.props.fields.year.required ? '(*)' : ''}</div>
                <div>
                  {makeDateDropDown(this.onSelect, `${this.props.name}Year`, 'y', this.props.fields.year.value, this.props.error || this.props.fields.year.error)}
                </div>
              </div>
              <div className='dateselectholder'>
                <div>Month</div>
                <div>
                  {makeDateDropDown(this.onSelect, `${this.props.name}Month`, 'm', this.props.fields.month.value, this.props.error || this.props.fields.month.error)}
                </div>
              </div>
              <div className='dateselectholder'>
                <div>Day</div>
                <div>
                  {makeDateDropDown(this.onSelect, `${this.props.name}Day`, 'd', this.props.fields.day.value, this.props.error || this.props.fields.day.error)}
                </div>
              </div>
              <div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  }
}