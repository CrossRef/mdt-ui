import React, { Component } from 'react'
import update from 'immutability-helper'
import { stateTrackerII } from 'my_decorators'

const AppliesTo = require('../../../utilities/appliesTo.json')



export default class License extends Component {
  constructor (props) {
    super(props)
    const {index} = this.props
    this.state = {
      showSubItem: index === 0 ? true : false,
    }
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
    var license = {}
    for(var i in this.refs){
      if(this.refs[i]){
        license[i] = this.refs[i].value
      }
    }

    this.props.handler({ // this situation, state did NOT update immediately to see change, must pass in a call back
      license: update(this.props.data, {[this.props.index]: {$set: license }})
    })

  }

  render () {
    return (
        <div>
            <div className='row subItemRow' onClick={this.toggle.bind(this)}>
                <div className='subItemHeader subItemTitle'>
                    <span className={'arrowHolder' + (this.state.showSubItem ? ' openArrowHolder' : '')}>
                        <img src="images/AddArticle/DarkTriangle.svg" />
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
                                    <div className={'requiredholder' + (this.props.freetoread === 'yes' ? ' dateselectrequire' : ' norequire')}>
                                        <div className='required height32'>
                                            {(this.props.freetoread === 'yes' ?  <span>*</span> : '' )}
                                        </div>
                                    </div>
                                    <div className='field'>
                                        <div className='datepickerholder'>
                                            <div className='dateselectholder'>
                                                <div>Year {(this.props.freetoread === 'yes' ? '(*)' : '')}</div>
                                                <div>{this.props.makeDateDropDown(this.handleLicense, 'acceptedDateYear', 'y', this.props.license.acceptedDateYear, this.props.errorLicenseStartDate)}</div>
                                            </div>
                                            <div className='dateselectholder'>
                                                <div>Month</div>
                                                <div>
                                                {this.props.makeDateDropDown(this.handleLicense, 'acceptedDateMonth', 'm', this.props.license.acceptedDateMonth, false)}
                                                </div>
                                            </div>
                                            <div className='dateselectholder'>
                                                <div>Day</div>
                                                <div>
                                                {this.props.makeDateDropDown(this.handleLicense, 'acceptedDateDay', 'd', this.props.license.acceptedDateDay, false)}
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
                                    <div className='requiredholder norequire'>
                                        <div className='required height32'>
                                        </div>
                                    </div>
                                    <div className='field'>
                                        <input
                                            className='height32'
                                            type='text'
                                            ref='licenseurl'
                                            onChange={this.handleLicense}
                                            value={this.props.license.licenseurl}
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
