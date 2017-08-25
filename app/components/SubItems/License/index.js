import React, { Component } from 'react'
import update from 'immutability-helper'

import {routes} from '../../../routing'
const AppliesTo = require('../../../utilities/appliesTo.json')



export default class License extends Component {
  constructor (props) {
    console.log(props.license.errors)
    super(props)
    const {index} = this.props
    this.state = {
      showSubItem: index === 0,
    }
  }

  componentWillReceiveProps (nextProps) {
    const {licenseUrl, licenseUrlInvalid, licenseDateIncomplete, licenseDateInvalid} = nextProps.license.errors || {};
    if(licenseUrl || licenseUrlInvalid || licenseDateIncomplete || licenseDateInvalid) {
      this.setState({showSubItem: true})
    }
  }

  componentDidUpdate () {
    this.props.positionErrorBubble();
  }

  displayAppliesTo () {
      var appliesTo = [
        <option key='-1'></option>,
        ...AppliesTo.map((appliesto, i) => (<option key={i} value={appliesto.value}>{appliesto.name}</option>))
      ]

      return (
          <select
            ref='appliesto'
            onChange={this.handleLicense}
            className='height32'
            value={this.props.license.appliesto}
            >
              {appliesTo}
          </select>
      )
  }

  toggle () {
      this.setState({
        showSubItem: !this.state.showSubItem
      })
  }

  handleLicense = () => {
    let license = {
      errors: this.props.license.errors
    }
    for(var i in this.refs){
      if(this.refs[i]){
        license[i] = this.refs[i].value
      }
    }

    this.props.handler({
      license: update(this.props.data, {[this.props.index]: {$set: license }})
    })

  }

  render () {
    const {acceptedDateYear, acceptedDateMonth, acceptedDateDay, licenseurl, appliesto} = this.props.license;
    const errors = this.props.license.errors || {};
    const { licenseDate, licenseDateIncomplete, licenseDateInvalid} = errors;
    const thereIsDate = !!(acceptedDateYear || acceptedDateMonth || acceptedDateDay);
    const yearError = licenseDateInvalid || licenseDate || (licenseDateIncomplete && !acceptedDateYear);
    const monthError = licenseDateInvalid || licenseDate || (licenseDateIncomplete && !acceptedDateMonth);
    const dayError = licenseDateInvalid || licenseDate || (licenseDateIncomplete && !acceptedDateDay);

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
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>Start Date</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className={'requiredholder' + (this.props.freetoread ? ' dateselectrequire' : ' norequire')}>
                                        <div className='required height32'>
                                            {(this.props.freetoread ?  <span>*</span> : '' )}
                                        </div>
                                    </div>
                                    <div className='field'>
                                        <div className='datepickerholder'>
                                            <div className='dateselectholder'>
                                                <div>Year {(this.props.freetoread ? '(*)' : '')}</div>
                                                <div>{this.props.makeDateDropDown(this.handleLicense, 'acceptedDateYear', 'y', acceptedDateYear, yearError)}</div>
                                            </div>
                                            <div className='dateselectholder'>
                                                <div>Month</div>
                                                <div>
                                                {this.props.makeDateDropDown(this.handleLicense, 'acceptedDateMonth', 'm', acceptedDateMonth, monthError)}
                                                </div>
                                            </div>
                                            <div className='dateselectholder'>
                                                <div>Day</div>
                                                <div>
                                                {this.props.makeDateDropDown(this.handleLicense, 'acceptedDateDay', 'd', acceptedDateDay, dayError)}
                                                </div>
                                            </div>
                                            <div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='errorHolder'>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='fieldHolder'>
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>License URL</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className={`requiredholder ${!(thereIsDate || appliesto) && 'norequire'}`}>
                                        <div className='required height32'>{(thereIsDate || appliesto) && <span>*</span>}</div>
                                    </div>
                                    <div className='field'>
                                        <input
                                            className={`height32 ${(errors.licenseUrl || errors.licenseUrlInvalid) && 'fieldError'}`}
                                            type='text'
                                            ref='licenseurl'
                                            onChange={this.handleLicense}
                                            value={licenseurl}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>Applies to</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className='requiredholder norequire'>
                                        <div className='required height32'>
                                        </div>
                                    </div>
                                    <div className='field'>
                                        {this.displayAppliesTo()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='errorHolder'>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
  }
}
