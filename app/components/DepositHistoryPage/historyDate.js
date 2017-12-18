import React from 'react'
import is from 'prop-types'

import DateSelect from '../Common/dateSelect'
import Calendar from '../Common/calendar'
import {routes} from '../../routing'


export default class HistoryDate extends React.Component {

  static propTypes = {
    name: is.string.isRequired,
    changeHandler: is.func.isRequired,
    fullDate: is.object,
    yearValue: is.string.isRequired,
    monthValue: is.string.isRequired,
    dayValue: is.string.isRequired,
    activeCalendar: is.string.isRequired,
    calendarHandler: is.func.isRequired
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
          <DateSelect handler={this.props.changeHandler} name={`${this.props.name}Year`} type="y" value={this.props.yearValue}/>
        </div>
        <div className='dateselectholder'>
          <div>Month</div>
          <div>
            <DateSelect handler={this.props.changeHandler} name={`${this.props.name}Month`} type="m" value={this.props.monthValue}/>
          </div>
        </div>
        <div className='dateselectholder'>
          <div>Day</div>
          <div>
            <DateSelect handler={this.props.changeHandler} name={`${this.props.name}Day`} type="d" value={this.props.dayValue}/>
          </div>
        </div>

        <div className='dateicon'>
          <div>&nbsp;</div>
          <div className={`iconHolder ${this.props.name}Container`}>
            {this.props.activeCalendar === this.props.name &&
            <Calendar
              name='end'
              date={this.props.fullDate}
              activeCalendar={this.props.activeCalendar}
              calendarHandler={this.props.calendarHandler}/>}

            <a className="calendarButton"
               onClick={()=>{
                 this.props.calendarHandler(this.props.activeCalendar === this.props.name ? '' : this.props.name)
               }}>
              <img className='calendarIcon' src={`${routes.images}/DepositHistory/Asset_Icons_Black_Calandar.svg`} />
            </a>
          </div>
        </div>
      </div>

    )
  }
}



