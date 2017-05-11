import React, { Component } from 'react'
import { stateTrackerII } from 'my_decorators'

const AppliesTo = require('../../../utilities/appliesTo.json')


@stateTrackerII
export default class License extends Component {
  constructor (props) {
    super(props)
    const {index, handler, remove, makeDateDropDown, license} = this.props
    this.state = {
      showSubItem: index === 0 ? true : false,
      index: index,
      handler: handler,
      remove: remove,
      makeDateDropDown: makeDateDropDown,
      license: license
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      index: nextProps.index,
      license: nextProps.license
    })
  }
  displayAppliesTo () {
      var appliesTo = [
        <option key='-1'></option>,
        ...AppliesTo.map((appliesto, i) => (<option key={i} value={appliesto.value}>{appliesto.name}</option>))
      ]

      return (
          <select
            ref='appliesto'
            onChange={() => {this.state.handler(this.state.index, this)}}
            className='height32'
            value={this.state.license.appliesto}
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

  render () {
    return (
        <div>
            <div className='row subItemRow' onClick={this.toggle.bind(this)}>
                <div className='subItemHeader subItemTitle'>
                    <span className={'arrowHolder' + (this.state.showSubItem ? ' openArrowHolder' : '')}>
                        <img src="/images/AddArticle/DarkTriangle.svg" />
                    </span>
                    <span>License {this.state.index + 1}</span>
                </div>
                {this.state.index > 0 &&
                    <div className='subItemHeader subItemButton'>
                        <a onClick={() => {this.state.remove(this.state.index)}}>Remove</a>
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
                                                <div>{this.state.makeDateDropDown('acceptedDateYear', 'y', this.state.license.acceptedDateYear, this.props.errorLicenseStartDate, this.state.index, this, 'license')}</div>
                                            </div>
                                            <div className='dateselectholder'>
                                                <div>Month</div>
                                                <div>
                                                {this.state.makeDateDropDown('acceptedDateMonth', 'm', this.state.license.acceptedDateMonth, false, this.state.index, this, 'license')}
                                                </div>
                                            </div>
                                            <div className='dateselectholder'>
                                                <div>Day</div>
                                                <div>
                                                {this.state.makeDateDropDown('acceptedDateDay', 'd', this.state.license.acceptedDateDay, false, this.state.index, this, 'license')}
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
                                            onChange={() => {this.state.handler(this.state.index, this)}}
                                            value={this.state.license.licenseurl}
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
