import React from 'react'
import ReactDOM from 'react-dom'
import is from 'prop-types'

import {routes} from '../../routing'
import {MakeDateDropDown} from '../../utilities/date'




export default class FormDate extends React.Component {

  static propTypes = {
    label: is.string.isRequired,
    name: is.oneOfType([is.string, is.array]).isRequired,
    required: is.bool,
    error: is.bool,
    indicatorErrors: is.array,
    allErrors: is.object,
    errorUtility: is.object.isRequired,
    subItemIndex: is.string,
    changeHandler: is.func.isRequired,
    onSelect: is.func,
    onBlur: is.func,
    onFocus: is.func,
    tooltip: is.object,
    tooltipUtility: is.object.isRequired,
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

    const fieldErrors = this.props.fields
    const isError = this.props.error || fieldErrors.year.error || fieldErrors.month.error || fieldErrors.day.error

    if(isError && this.props.indicatorErrors) {
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
    const name = e.target.name
    await this.props.changeHandler(e)
    if(this.props.onSelect) {
      this.props.onSelect()
    }
    this.nodeRef[name].blur()
  }


  nodeRef = {}


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
          <div className={`requiredholder ${this.props.required ? 'dateselectrequire': 'norequire'}`}>
            <div className='required height32'>
              {this.props.required && <span>*</span>}
            </div>
          </div>
          <div className='field' onBlur={this.onBlur} ref={(node)=>this.node=node} onFocus={this.onFocus}>

            {isFocus && this.props.tooltip && <img className='infoFlagDate' src={`${routes.images}/AddArticle/Asset_Icons_GY_HelpFlag.svg`} />}

            <div className={this.props.issue ? 'issuedatepickerholder' : 'datepickerholder'}>
              <div className='dateselectholder'>
                <div>Year {this.props.fields.year.required ? '(*)' : ''}</div>
                <div>
                  <MakeDateDropDown
                    handler={this.onSelect}
                    name={`${typeof this.props.name === 'string' ? this.props.name : ''}Year`}
                    type="y"
                    value={this.props.fields.year.value}
                    validation={this.props.error || this.props.fields.year.error}
                    nodeRef={this.nodeRef}
                    style={`${isFocus && this.props.tooltip ? 'infoFlagBorder' : ''}`}/>
                </div>
              </div>
              <div className='dateselectholder'>
                <div>Month</div>
                <div>
                  <MakeDateDropDown
                    handler={this.onSelect}
                    name={`${typeof this.props.name === 'string' ? this.props.name : ''}Month`}
                    type="m"
                    value={this.props.fields.month.value}
                    validation={this.props.error || this.props.fields.month.error}
                    nodeRef={this.nodeRef}
                    style={`${isFocus && this.props.tooltip ? 'infoFlagBorder' : ''}`}/>
                </div>
              </div>
              <div className='dateselectholder'>
                <div>Day</div>
                <div>
                  <MakeDateDropDown
                    handler={this.onSelect}
                    name={`${typeof this.props.name === 'string' ? this.props.name : ''}Day`}
                    type="d"
                    value={this.props.fields.day.value}
                    validation={this.props.error || this.props.fields.day.error}
                    nodeRef={this.nodeRef}
                    style={`${isFocus && this.props.tooltip ? 'infoFlagBorder' : ''}`}/>
                </div>
              </div>
              <div className='dateicon'>
                <div>&nbsp;</div>
                <div className={`iconHolder ${isFocus && this.props.tooltip ? 'infoFlag infoFlagIconHolder' : ''}`}>
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