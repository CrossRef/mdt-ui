import React, { Component } from 'react'
import update from 'immutability-helper'

import {routes} from '../../../routing'
import {urlEntered} from '../../../utilities/helpers'
import FormInput from '../../Common/formInput'
import FormSelect from '../../Common/formSelect'
import FormDate from '../../Common/formDate'
const AppliesTo = require('../../../utilities/lists/appliesTo.json')



export default class License extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showSubItem: true
    }
  }


  componentWillReceiveProps (nextProps) {
    if(nextProps.openSubItems || nextProps.freetolicense === 'yes') {
      this.setState({showSubItem: true})
    }
  }


  componentDidUpdate () {
    this.props.deferredErrorBubbleRefresh.resolve()
  }


  toggle () {
    this.setState({
      showSubItem: !this.state.showSubItem
    })
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
    return (
      <div>
        <div className='row subItemRow' onClick={this.toggle.bind(this)}>
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
        </div>

        {this.state.showSubItem &&
          <div>
            <div className='row'>
              <div className='fieldHolder'>
                <FormDate
                  label="Start Date"
                  name="acceptedDate"
                  changeHandler={this.handleLicense}
                  onSelect={this.props.validate}
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
                  onBlur={this.props.validate}/>

                <FormSelect
                  label="Applies to"
                  name="appliesto"
                  value={appliesto}
                  options={AppliesTo}
                  changeHandler={this.handleLicense}
                  onSelect={this.props.validate}/>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}
