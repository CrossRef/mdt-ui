import React, {Component} from 'react'
import DatePicker from 'react-datepicker'
import $ from 'jquery'



export default class Calendar extends Component {

  componentDidMount() {
    const selector = $(`.${this.props.type}Calendar input`);
    selector.focus();
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  handleClick = e => {
    const element = $(e.target);
    if(!(element.parents('.iconHolder').length || element.is('.iconHolder'))) {
      this.props.setParentState({[`${this.props.type}CalendarOpen`]: false})
    }
  }

  render() {
    const startOrEnd = this.props.type;
    return (
      <div className={`${startOrEnd}Calendar`}>
        <DatePicker
          selected={this.props.date}
          onChange={(date)=>{
            const d = date.format('D'), m = date.format('M'), y = date.format('Y');
            const payload = {
              [`${startOrEnd}FullDate`]: date,
              [`${startOrEnd}Date`]: d,
              [`${startOrEnd}Month`]: m,
              [`${startOrEnd}Year`]: y,
              query: {...this.props.query, [startOrEnd]: `${y}-${m}-${d}`}
            }
            this.props.setParentState(payload)
          }}
        />
      </div>
    )
  }

}