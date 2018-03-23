import React, { Component } from 'react'
import update from 'immutability-helper'

import {routes} from '../../../routing'
import {urlEntered} from '../../../utilities/helpers'
import FormInput from '../../Common/formInput'
import FormSelect from '../../Common/formSelect'
import FormDate from '../../Common/formDate'
import ErrorIndicator from '../../Common/errorIndicator'
import {articleTooltips as tooltips} from '../../../utilities/lists/tooltipMessages'
const AppliesTo = require('../../../utilities/lists/appliesTo.json')



export default class License extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showSubItem: true
    }
  }


  componentWillReceiveProps (nextProps) {
    if(
      nextProps.openSubItems ||
      (nextProps.freetolicense === 'yes' && this.props.freetolicense !== 'yes' && !this.state.showSubItem)
    ) {
      this.setState({showSubItem: true})
    }
  }


  toggle = () => {
    this.setState({
      showSubItem: !this.state.showSubItem
    })
    this.props.handler({})
  }


  handleLicense = (e) => {
    let license = {
      ...this.props.license,
      [e.target.name]: e.target.value
    }

    this.props.handler({
      license: update(this.props.data, {[this.props.index]: {$set: license }})
    })
  }


  render () {
    const {acceptedDateYear, acceptedDateMonth, acceptedDateDay, licenseurl, appliesto} = this.props.license;
    const errors = this.props.license.errors || {};
    const thereIsDate = !!(acceptedDateYear || acceptedDateMonth || acceptedDateDay);

    const subItemErrorIndicator = React.cloneElement(
      this.props.ErrorIndicator,
      {
        openSubItem: this.toggle,
        allErrors: errors,
        subItemIndex: String(this.props.index),
        subItem: 'license'
      }
    )

    return (
      <div>
        <div className='row subItemRow' onClick={this.toggle}>
          <div className='subItemHeader subItemTitle'>
            <span className={'arrowHolder' + (this.state.showSubItem ? ' openArrowHolder' : '')}>
              <img src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </span>
            <span>License {this.props.index + 1}</span>
          </div>
          {this.props.index > 0 &&
            <div className='subItemHeader subItemButton'>
              <a onClick={() => {this.props.remove(this.props.index)}}>Remove</a>
            </div>
          }
          {!this.state.showSubItem && subItemErrorIndicator}
        </div>

        {this.state.showSubItem &&
          <div>
            <div className='row'>
              <div className='fieldHolder'>
                <FormDate
                  label="Start date"
                  name="acceptedDate"
                  changeHandler={this.handleLicense}
                  onSelect={this.props.validate}
                  indicatorErrors={['licenseDateInvalid', 'licenseDateIncomplete']}
                  allErrors={errors}
                  subItemIndex={String(this.props.index)}
                  subItem="license"
                  tooltip={this.props.tooltip && tooltips.licenseDate}
                  tooltipUtility={this.props.tooltipUtility}
                  errorUtility={this.props.errorUtility}
                  activeCalendar={this.props.activeCalendar}
                  calendarHandler={this.props.calendarHandler}
                  fields={{
                    year: {
                      value: acceptedDateYear,
                      error: errors.licenseYear,
                    },
                    month: {
                      value: acceptedDateMonth,
                      error: errors.licenseMonth
                    },
                    day: {
                      value: acceptedDateDay,
                      error: errors.licenseDay
                    }
                  }}/>
              </div>

              <ErrorIndicator
                style="dateErrorHolder"
                indicatorErrors={['licenseDateInvalid', 'licenseDateIncomplete']}
                errorMessages={this.props.errorMessages}
                errorUtility={this.props.errorUtility}
                tooltipUtility={this.props.tooltipUtility}
                allErrors={errors}
                subItem='license'
                subItemIndex={String(this.props.index)}/>
            </div>

            <div className='row'>
              <div className='fieldHolder'>
                <FormInput
                  label="License URL"
                  name="licenseurl"
                  required={!!(this.props.freetolicense === 'yes' || (thereIsDate || appliesto))}
                  error={errors.freetolicense || errors.licenseUrl || errors.licenseUrlInvalid}
                  value={ urlEntered(licenseurl) ? licenseurl : 'http://'}
                  changeHandler={this.handleLicense}
                  indicatorErrors={['licenseUrl', 'licenseUrlInvalid', 'freetolicense']}
                  allErrors={errors}
                  subItemIndex={String(this.props.index)}
                  errorUtility={this.props.errorUtility}
                  tooltip={this.props.tooltip && tooltips.licenseUrl}
                  tooltipUtility={this.props.tooltipUtility}
                  onBlur={this.props.validate}/>

                <FormSelect
                  label="Applies to"
                  name="appliesto"
                  value={appliesto}
                  options={AppliesTo}
                  changeHandler={this.handleLicense}
                  errorUtility={this.props.errorUtility}
                  tooltip={this.props.tooltip && tooltips.licenseAppliesTo}
                  tooltipUtility={this.props.tooltipUtility}
                  subItemIndex={String(this.props.index)}
                  onSelect={this.props.validate}/>
              </div>

              <ErrorIndicator
                indicatorErrors={['licenseUrl', 'licenseUrlInvalid', 'freetolicense']}
                errorMessages={this.props.errorMessages}
                errorUtility={this.props.errorUtility}
                tooltipUtility={this.props.tooltipUtility}
                allErrors={errors}
                subItem='license'
                subItemIndex={String(this.props.index)}/>
            </div>
          </div>
        }
      </div>
    )
  }
}
