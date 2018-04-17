import React, { Component } from 'react'
import is from 'prop-types'
import Pagination from 'rc-pagination';

import {routes} from '../../routing'
import HistoryDate from './historyDate'




export default class DepositHistoryView extends Component {
  static propTypes = {
    listDepositHistory: is.func.isRequired,
    calendarHandler: is.func.isRequired,
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
          Deposit history
        </div>
        <div className='dateSearchHolder'>
          <div className='start'>
            <HistoryDate
              title="Date from"
              name="start"
              changeHandler={this.props.handleChange}
              fullDate={this.props.startFullDate}
              activeCalendar={this.props.activeCalendar}
              calendarHandler={this.props.calendarHandler}
              yearValue={this.props.startYear}
              monthValue={this.props.startMonth}
              dayValue={this.props.startDate}/>

          </div>
          <div className='end'>
            <HistoryDate
              title="Date to"
              name="end"
              changeHandler={this.props.handleChange}
              fullDate={this.props.endFullDate}
              activeCalendar={this.props.activeCalendar}
              calendarHandler={this.props.calendarHandler}
              yearValue={this.props.endYear}
              monthValue={this.props.endMonth}
              dayValue={this.props.endDate}/>
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
        <tbody>
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

            <th className='errorCell'/>

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

          {this.props.listDepositHistory()}

          </tbody>
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