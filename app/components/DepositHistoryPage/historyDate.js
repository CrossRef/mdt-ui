import React from 'react'
import is from 'prop-types'

import { MakeDateDropDown } from '../../utilities/date'


export default class HistoryDate extends React.Component {

  static propTypes = {
    name: is.string.isRequired,
    changeHandler: is.func.isRequired,
    yearValue: is.string.isRequired,
    monthValue: is.string.isRequired,
    dayValue: is.string.isRequired,
  }


  render () {
    return (
      <div className='datepickerholder'>
        <div className='dateselectholder'>
          <div>&nbsp;</div>
          <div className='labelHolder'>Date From</div>
        </div>
        <div className='dateselectholder'>
          <div>Year</div>
          <MakeDateDropDown handler={this.props.changeHandler} name='startYear' type="y" value={this.props.yearValue}/>
        </div>
        <div className='dateselectholder'>
          <div>Month</div>
          <div>
            <MakeDateDropDown handler={this.props.changeHandler} name='startMonth' type="m" value={this.props.monthValue}/>
          </div>
        </div>
        <div className='dateselectholder'>
          <div>Day</div>
          <div>
            <MakeDateDropDown handler={this.props.changeHandler} name='startDay' type="d" value={this.props.dayValue}/>
          </div>
        </div>
        <div className='dateicon'>
          <div>&nbsp;</div>
          <div className='iconHolder' onClick={()=>this.props.calendarHandler(this.props.name)}>
            {this.props.activeCalendar === this.props.name &&
              <Calendar
                type='start'
                calendarHandler={this.props.calendarHandler}
                date={this.props.startFullDate}
                query={this.props.query}/>}

            <a className="calendarButton">
              <img className='calendarIcon' src={`${routes.images}/DepositHistory/Asset_Icons_Black_Calandar.svg`} />
            </a>
          </div>
        </div>
      </div>

    )
  }
}



