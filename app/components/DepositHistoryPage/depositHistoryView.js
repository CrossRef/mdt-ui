import React, { Component } from 'react'
import is from 'prop-types'

//import ReactPaginate from 'react-paginate';
import Pagination from 'rc-pagination';
import {makeDateDropDown} from '../../utilities/date'
import {routes} from '../../routing'
import Calendar from './calendar'




export default class DepositHistoryView extends Component {
  static propTypes = {
    listDepositHistory: is.func.isRequired,
    boundSetState: is.func.isRequired,
    handleChange: is.func.isRequired,
    handlePageClick: is.func.isRequired
  }



  render () {
    const { order, 'sort-field': sortField } = this.props.query;

    const textItemRender = (current, type, element) => {
      if (type === 'prev') {
        return (<img className='prev' src={`${routes.images}/AddArticle/DarkTriangle.svg`} />)
      }
      if (type === 'next') {
        return (<img className='nex' src={`${routes.images}/AddArticle/DarkTriangle.svg`} />)
      }
      if (type === 'jump-prev' || type==='jump-next'){
        return (<a>...</a>)
      }
      return element
    };

    return (
      <div className='depositHistory'>
        <div className='pageTitle'>
          Deposit History
        </div>
        <div className='dateSearchHolder'>
          <div className='start'>
            <div className='datepickerholder'>
              <div className='dateselectholder'>
                <div>&nbsp;</div>
                <div className='labelHolder'>Date From</div>
              </div>
              <div className='dateselectholder'>
                <div>Year</div>
                <div>{makeDateDropDown(this.props.handleChange,'startYear','y', this.props.startYear)}</div>
              </div>
              <div className='dateselectholder'>
                <div>Month</div>
                <div>
                  {makeDateDropDown(this.props.handleChange,'startMonth','m', this.props.startMonth)}
                </div>
              </div>
              <div className='dateselectholder'>
                <div>Day</div>
                <div>
                  {makeDateDropDown(this.props.handleChange,'startDate','d', this.props.startDate)}
                </div>
              </div>
              <div className='dateselectholder dateicon'>
                <div>&nbsp;</div>
                <div className='iconHolder'>
                  {this.props.startCalendarOpen && <Calendar type='start' setParentState={this.props.boundSetState} date={this.props.startFullDate} query={this.props.query}/>}
                  <a className="calendarButton" onClick={()=>this.props.boundSetState({startCalendarOpen: !this.props.startCalendarOpen, endCalendarOpen: false})}>
                    <img className='calendarIcon' src={`${routes.images}/DepositHistory/Asset_Icons_Black_Calandar.svg`} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className='end'>
            <div className='datepickerholder'>
              <div className='dateselectholder'>
                <div>&nbsp;</div>
                <div className='labelHolder'>Date To</div>
              </div>
              <div className='dateselectholder'>
                <div>Year</div>
                <div>{makeDateDropDown(this.props.handleChange,'endYear','y', this.props.endYear)}</div>
              </div>
              <div className='dateselectholder'>
                <div>Month</div>
                <div>
                  {makeDateDropDown(this.props.handleChange,'endMonth','m', this.props.endMonth)}
                </div>
              </div>
              <div className='dateselectholder'>
                <div>Day</div>
                <div>
                  {makeDateDropDown(this.props.handleChange,'endDate','d', this.props.endDate)}
                </div>
              </div>
              <div className='dateselectholder dateicon'>
                <div>&nbsp;</div>
                <div className='iconHolder'>
                  {this.props.endCalendarOpen && <Calendar type='end' setParentState={this.props.boundSetState} date={this.props.endFullDate} query={this.props.query}/>}
                  <a className="calendarButton" onClick={()=>this.props.boundSetState({endCalendarOpen: !this.props.endCalendarOpen, startCalendarOpen: false})}>
                    <img className='calendarIcon' src={`${routes.images}/DepositHistory/Asset_Icons_Black_Calandar.svg`} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='doiSearchHolder'>
          <input
            type='text'
            className='doiSearch'
            placeholder='Search by DOI'
            name='pubid'
            onChange={this.props.handleChange}
          />
        </div>
        <table className='historyData'>
          <tr>
            <th className='first'>Deposit ID</th>
            <th className="titleCell">
              <span
                className={`cursor ${(sortField === 'title') && 'sorted'}`}
                onClick={()=>{this.props.handleChange(this, {'sort-field': {$set: 'title'}, order: {$set: (sortField !== 'title') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
              >Title</span>
              <img
                onClick={()=>{this.props.handleChange(this, {'sort-field': {$set: 'title'}, order: {$set: (sortField !== 'title') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
                className={'orderBy' + ((sortField === 'title' && order === 'asc') ? ' ordered' : '')}
                src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </th>
            <th className="dateCell">
              <span
                className={`cursor ${(sortField === 'event_timestamp') && 'sorted'}`}
                onClick={()=>{this.props.handleChange(this, {'sort-field': {$set: 'event_timestamp'}, order: {$set: (sortField !== 'event_timestamp') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
              >Date</span>
              <img
                onClick={()=>{this.props.handleChange(this, {'sort-field': {$set: 'event_timestamp'}, order: {$set: (sortField !== 'event_timestamp') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
                className={'orderBy' + ((sortField === 'event_timestamp' && order === 'asc') ? ' ordered' : '')}
                src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </th>
            <th className="typeCell">
              <span
                className={`cursor ${(sortField === 'type') && 'sorted'}`}
                onClick={()=>{this.props.handleChange(this, {'sort-field': {$set: 'type'}, order: {$set: (sortField !== 'type') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
              >Type</span>
              <img
                onClick={()=>{this.props.handleChange(this, {'sort-field': {$set: 'type'}, order: {$set: (sortField !== 'type') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
                className={'orderBy' + ((order === 'asc' && sortField === 'type') ? ' ordered' : '')}
                src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </th>
            <th className="statusCell">
              <span
                className={`cursor ${(sortField === 'event_status') && 'sorted'}`}
                onClick={()=>{this.props.handleChange(this, {'sort-field': {$set: 'event_status'}, order: {$set: (sortField !== 'event_status') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
              >Status</span>
              <img
                onClick={()=>{this.props.handleChange(this, {'sort-field': {$set: 'event_status'}, order: {$set: (sortField !== 'event_status') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
                className={'orderBy' + ((order === 'asc' && sortField === 'event_status') ? ' ordered' : '')}
                src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </th>
            <th className='last'>
              <span
                className={`cursor ${(sortField === 'doi') && 'sorted'}`}
                onClick={()=>{this.props.handleChange(this, {'sort-field': {$set: 'doi'}, order: {$set: (sortField !== 'doi') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
              >DOI</span>
              <img
                onClick={()=>{this.props.handleChange(this, {'sort-field': {$set: 'doi'}, order: {$set: (sortField !== 'doi') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
                className={'orderBy' + ((order === 'asc' && sortField === 'doi') ? ' ordered' : '')}
                src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </th>
          </tr>
          {
            this.props.listDepositHistory()
          }
        </table>
        <Pagination className="pagination"
          total={this.props.total}
          itemRender={textItemRender}
          defaultPageSize={20}
          showTitle={false}
          onChange={this.props.handlePageClick}
        />

      </div>
    )
  }
}