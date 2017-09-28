import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import update from 'immutability-helper'
import { bindActionCreators } from 'redux'
import { stateTrackerII, updateReporterII } from 'my_decorators'
import _ from 'lodash'
import DatePicker from 'react-datepicker'
import $ from 'jquery'

//import ReactPaginate from 'react-paginate';
import Pagination from 'rc-pagination';
import { getDepositHistory } from '../actions/application'
import DepositHistoryItem from '../components/depositHistoryItem'
import {objectSearch, xmldoc, cleanObj} from '../utilities/helpers'
import {makeDateDropDown} from '../utilities/date'

import {routes} from '../routing'


const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => bindActionCreators({
  asyncGetDepositHistory: getDepositHistory
}, dispatch)

@connect(mapStateToProps, mapDispatchToProps)
export default class DepositHistoryPage extends Component {

  static propTypes = {
    asyncGetDepositHistory: is.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      depositHistory: [],
      startCalendarOpen: false,
      startFullDate: '',
      startDate: '',
      startMonth: '',
      startYear: '',
      endCalendarOpen: false,
      endFullDate: '',
      endDate: '31',
      endMonth: '12',
      endYear: '',
      total: 0,
      query: {
        order: 'desc',
        'sort-field': 'event_timestamp',
        pubid: undefined,
        start: undefined,
        end: undefined,
        count: 20,
        offset: 0,
        worktype: 'article'
      },
      serverError: ''
    }
  }

  componentWillMount () {
    this.props.asyncGetDepositHistory(cleanObj(this.state.query), results => {
      this.setState({
        total: results['total-count'],
        depositHistory: results.message
      })
    }, error => {
      this.setState({ serverError: error })
    })
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.state.query !== nextState.query) {
      this.props.asyncGetDepositHistory(cleanObj(nextState.query), results => {
        this.setState({
          total: results['total-count'],
          depositHistory: results.message
        })
      }, error => {
        this.setState({ serverError: error })
      })
    }
  }

  handlePageClick (current,pageSize) {
    var selected = current
    let offset = Math.ceil(selected * this.state.query.count)
    this.setState({
     query: update(this.state.query, {offset: {$set: offset}})
    })
  }

  handleChange = (e, sortFields) => {
    if (e.target) {
      const name = e.currentTarget.name
      switch(name) {
          case 'startYear':
            this.setState({startYear: e.currentTarget.value})
            var startDate = [e.currentTarget.value, this.state.startMonth, this.state.startDate]
            startDate = _.filter(startDate, datePart => datePart.length > 0)
            if (startDate.join('').length > 0) {
              this.setState({
                query: update(this.state.query, {start: {$set: startDate.join('-')}})
              })
            }
            break
          case 'startMonth':
            this.setState({startMonth: e.currentTarget.value})
            var startDate = [this.state.startYear, e.currentTarget.value, this.state.startDate]
            startDate = _.filter(startDate, datePart => datePart.length > 0)
            if (startDate.join('').length > 0) {
              this.setState({
                query: update(this.state.query, {start: {$set: startDate.join('-')}})
              })
            }
            break
          case 'startDate':
            this.setState({startDate: e.currentTarget.value})
            var startDate = [this.state.startYear, this.state.startMonth, e.currentTarget.value]
            startDate = _.filter(startDate, datePart => datePart.length > 0)
            if (startDate.join('').length > 0) {
              this.setState({
                query: update(this.state.query, {start: {$set: startDate.join('-')}})
              })
            }
            break
          case 'endYear':
            this.setState({endYear: e.currentTarget.value})
            var endDate = [e.currentTarget.value, this.state.endMonth, this.state.endDate]
            endDate = _.filter(endDate, datePart => datePart.length > 0)
            if (endDate.join('').length > 0) {
              this.setState({
                query: update(this.state.query, {end: {$set: endDate.join('-')}})
              })
            }
            break
          case 'endMonth':
            this.setState({endMonth: e.currentTarget.value})
            var endDate = [this.state.endYear, e.currentTarget.value, this.state.endDate]
            endDate = _.filter(endDate, datePart => datePart.length > 0)
            if (endDate.join('').length > 0) {
              this.setState({
                query: update(this.state.query, {end: {$set: endDate.join('-')}})
              })
            }
            break
          case 'endDate':
            this.setState({endDate: e.currentTarget.value})
            var endDate = [this.state.endYear, this.state.endMonth, e.currentTarget.value]
            endDate = _.filter(endDate, datePart => datePart.length > 0)
            if (endDate.join('').length > 0) {
              this.setState({
                query: update(this.state.query, {end: {$set: endDate.join('-')}})
              })
            }
            break
          case 'pubid':
            this.setState({
              query: update(this.state.query, {pubid: {$set: e.currentTarget.value}})
            })
            break
      }
    } else {
      this.setState({
        query: update(this.state.query, sortFields)
      })
    }

  }
  
  listDeposityHistory () {
    var depositHistory = []
    _.each(this.state.depositHistory, (historyItem, i) => {
      const historyInfo = xmldoc(historyItem.eventInfo)
      const depositId = objectSearch(historyInfo, 'submission_id')
      const depositDate = historyItem.eventTime
      const mdtVersion = historyItem.MDTVersion
      const status = historyItem.evenStatus
      const doi = historyItem.doi
      var titleObj = JSON.parse(historyItem.title)
      const title = titleObj.title
      depositHistory.push({
        version: mdtVersion,
        id: depositId,
        date: depositDate,
        doi: doi,
        title: title,
        status: status === 'OK' ? 'Accepted' : 'Failed'
      })
    })

    return depositHistory.map((historyItem, i)=>{
      return (
        <DepositHistoryItem
          key={i}
          history={historyItem}
        />
      )
    })
  }

  boundSetState = (object) => {
    this.setState(object)
  }

  render () {
    const { order, 'sort-field': sortField } = this.state.query;
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
                <div>{makeDateDropDown(this.handleChange,'startYear','y', this.state.startYear)}</div>
              </div>
              <div className='dateselectholder'>
                <div>Month</div>
                <div>
                  {makeDateDropDown(this.handleChange,'startMonth','m', this.state.startMonth)}
                </div>
              </div>
              <div className='dateselectholder'>
                <div>Day</div>
                <div>
                  {makeDateDropDown(this.handleChange,'startDate','d', this.state.startDate)}
                </div>
              </div>
              <div className='dateselectholder dateicon'>
                <div>&nbsp;</div>
                <div className='iconHolder'>
                  {this.state.startCalendarOpen && <Calendar type='start' setParentState={this.boundSetState} date={this.state.startFullDate} query={this.state.query}/>}
                  <a className="calendarButton" onClick={()=>this.setState({startCalendarOpen: !this.state.startCalendarOpen, endCalendarOpen: false})}>
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
                <div>{makeDateDropDown(this.handleChange,'endYear','y', this.state.endYear)}</div>
              </div>
              <div className='dateselectholder'>
                <div>Month</div>
                <div>
                  {makeDateDropDown(this.handleChange,'endMonth','m', this.state.endMonth)}
                </div>
              </div>
              <div className='dateselectholder'>
                <div>Day</div>
                <div>
                  {makeDateDropDown(this.handleChange,'endDate','d', this.state.endDate)}
                </div>
              </div>
              <div className='dateselectholder dateicon'>
                <div>&nbsp;</div>
                <div className='iconHolder'>
                  {this.state.endCalendarOpen && <Calendar type='end' setParentState={this.boundSetState} date={this.state.endFullDate} query={this.state.query}/>}
                  <a className="calendarButton" onClick={()=>this.setState({endCalendarOpen: !this.state.endCalendarOpen, startCalendarOpen: false})}>
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
            onChange={this.handleChange}
          />
        </div>
        <table className='historyData'>
          <tr>
            <th className='first'>Deposit ID</th>
            <th className="titleCell">
              <span
                className={`cursor ${(sortField === 'title') && 'sorted'}`}
                onClick={()=>{this.handleChange(this, {'sort-field': {$set: 'title'}, order: {$set: (sortField !== 'title') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
              >Title</span>
              <img
                onClick={()=>{this.handleChange(this, {'sort-field': {$set: 'title'}, order: {$set: (sortField !== 'title') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
                className={'orderBy' + ((sortField === 'title' && order === 'asc') ? ' ordered' : '')}
                src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </th>
            <th className="dateCell">
              <span
                className={`cursor ${(sortField === 'event_timestamp') && 'sorted'}`}
                onClick={()=>{this.handleChange(this, {'sort-field': {$set: 'event_timestamp'}, order: {$set: (sortField !== 'event_timestamp') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
              >Date</span>
              <img
                onClick={()=>{this.handleChange(this, {'sort-field': {$set: 'event_timestamp'}, order: {$set: (sortField !== 'event_timestamp') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
                className={'orderBy' + ((sortField === 'event_timestamp' && order === 'asc') ? ' ordered' : '')}
                src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </th>
            <th className="typeCell">
              <span
                className={`cursor ${(sortField === 'type') && 'sorted'}`}
                onClick={()=>{this.handleChange(this, {'sort-field': {$set: 'type'}, order: {$set: (sortField !== 'type') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
              >Type</span>
              <img
                onClick={()=>{this.handleChange(this, {'sort-field': {$set: 'type'}, order: {$set: (sortField !== 'type') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
                className={'orderBy' + ((order === 'asc' && sortField === 'type') ? ' ordered' : '')}
                src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </th>
            <th className="statusCell">
              <span
                className={`cursor ${(sortField === 'event_status') && 'sorted'}`}
                onClick={()=>{this.handleChange(this, {'sort-field': {$set: 'event_status'}, order: {$set: (sortField !== 'event_status') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
              >Status</span>
              <img
                onClick={()=>{this.handleChange(this, {'sort-field': {$set: 'event_status'}, order: {$set: (sortField !== 'event_status') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
                className={'orderBy' + ((order === 'asc' && sortField === 'event_status') ? ' ordered' : '')}
                src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </th>
            <th className='last'>
              <span
                className={`cursor ${(sortField === 'doi') && 'sorted'}`}
                onClick={()=>{this.handleChange(this, {'sort-field': {$set: 'doi'}, order: {$set: (sortField !== 'doi') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
              >DOI</span>
              <img
                onClick={()=>{this.handleChange(this, {'sort-field': {$set: 'doi'}, order: {$set: (sortField !== 'doi') ? 'desc' : (order === 'asc') ? 'desc' : 'asc'}})}}
                className={'orderBy' + ((order === 'asc' && sortField === 'doi') ? ' ordered' : '')}
                src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </th>
          </tr>
          {
            this.listDeposityHistory()
          }
        </table>
        <Pagination className="pagination"
        total={this.state.total} 
        itemRender={textItemRender}
        defaultPageSize={20}
        showTitle={false}
        //locale={en_US}
        
        onChange={this.handlePageClick.bind(this)}
        />

      </div>
    )
  }
}


class Calendar extends Component {

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