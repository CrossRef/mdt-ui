import React, {Component} from 'react'
import is from 'prop-types'
import DatePicker from 'react-datepicker'
import $ from 'jquery'




export default class Calendar extends Component {

  static propTypes = {
    name: is.string.isRequired,
    date: is.object.isRequired,
    calendarHandler: is.func.isRequired,
    activeCalendar: is.string.isRequired
  }


  componentDidMount() {
    const selector = $(`.${this.props.name}Calendar input`)
    selector.focus()
    document.addEventListener('click', this.handleClick, false)

  }


  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false)
  }


  handleClick = e => {
    const element = $(e.target)
    if(!(element.parents(`.${this.props.name}Container`).length || element.is(`.${this.props.name}Container`))) {
      this.props.calendarHandler('')
    }
  }


  render() {
    return (
      <div className={`${this.props.name}Calendar`}>
        <DatePicker
          selected={this.props.date}
          onChange={(date)=>{
            const d = date.format('D'), m = date.format('M'), y = date.format('Y');
            const dateObj = {
              fullDate: date,
              day: d,
              month: m,
              year: y,
            }
            this.props.calendarHandler('', dateObj)
          }}
        />
      </div>
    )
  }

}