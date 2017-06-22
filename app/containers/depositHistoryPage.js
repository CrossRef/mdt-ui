import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import update from 'immutability-helper'
import { bindActionCreators } from 'redux'
import { stateTrackerII, updateReporterII } from 'my_decorators'
import _ from 'lodash'
import ReactPaginate from 'react-paginate';
import { getDepositHistory } from '../actions/application'
import DepositHistoryItem from '../components/depositHistoryItem'
import objectSearch from '../utilities/objectSearch'
import xmldoc from '../utilities/xmldoc'
import {makeDateDropDown} from '../utilities/date'
import cleanObj from '../utilities/cleanObj'

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
      startDate: '',
      startMonth: '',
      startYear: '',
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
        offset: 0
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

  handlePageClick (data) {
    let selected = data.selected
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
        status: status === 'OK' ? 'Success' : 'Failed'
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

  render () {
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
                <div>{makeDateDropDown(this.handleChange,'startYear','y')}</div>
              </div>
              <div className='dateselectholder'>
                <div>Month</div>
                <div>
                  {makeDateDropDown(this.handleChange,'startMonth','m')}
                </div>
              </div>
              <div className='dateselectholder'>
                <div>Day</div>
                <div>
                  {makeDateDropDown(this.handleChange,'startDate','d')}
                </div>
              </div>
              <div className='dateselectholder dateicon'>
                <div>&nbsp;</div>
                <div className='iconHolder'><img className='calendarIcon' src={`${routes.images}/DepositHistory/Asset_Icons_Black_Calandar.svg`} /></div>
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
                <div>{makeDateDropDown(this.handleChange,'endYear','y')}</div>
              </div>
              <div className='dateselectholder'>
                <div>Month</div>
                <div>
                  {makeDateDropDown(this.handleChange,'endMonth','m')}
                </div>
              </div>
              <div className='dateselectholder'>
                <div>Day</div>
                <div>
                  {makeDateDropDown(this.handleChange,'endDate','d')}
                </div>
              </div>
              <div className='dateselectholder dateicon'>
                <div>&nbsp;</div>
                <div className='iconHolder'><img className='calendarIcon' src={`${routes.images}/DepositHistory/Asset_Icons_Black_Calandar.svg`} /></div>
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
            <th>
              <span
                onClick={()=>{this.handleChange(this, {'sort-field': {$set: 'title'}})}}
              >Title</span>
              {
                (this.state.query['sort-field'] === 'title') ?
                  <img
                    onClick={()=>{this.handleChange(this, {order: {$set: (this.state.query.order === 'asc') ? 'desc' : 'asc'}})}}
                    className={'orderBy' + ((this.state.query.order === 'asc') ? ' ordered' : '')}
                    src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
                : ''
              }
            </th>
            <th>
              <span
                onClick={()=>{this.handleChange(this, {'sort-field': {$set: 'event_timestamp'}})}}
              >Date</span>
              {
                (this.state.query['sort-field'] === 'event_timestamp') ?
                  <img
                    onClick={()=>{this.handleChange(this, {order: {$set: (this.state.query.order === 'asc') ? 'desc' : 'asc'}})}}
                    className={'orderBy' + ((this.state.query.order === 'asc') ? ' ordered' : '')}
                    src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
                : ''
              }
            </th>
            <th>
              <span
                onClick={()=>{this.handleChange(this, {'sort-field': {$set: 'type'}})}}
              >Type</span>
              {
                (this.state.query['sort-field'] === 'type') ?
                  <img
                    onClick={()=>{this.handleChange(this, {order: {$set: (this.state.query.order === 'asc') ? 'desc' : 'asc'}})}}
                    className={'orderBy' + ((this.state.query.order === 'asc') ? ' ordered' : '')}
                    src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
                : ''
              }
            </th>
            <th>
              <span
                onClick={()=>{this.handleChange(this, {'sort-field': {$set: 'event_status'}})}}
              >Status</span>
              {
                (this.state.query['sort-field'] === 'event_status') ?
                  <img
                    onClick={()=>{this.handleChange(this, {order: {$set: (this.state.query.order === 'asc') ? 'desc' : 'asc'}})}}
                    className={'orderBy' + ((this.state.query.order === 'asc') ? ' ordered' : '')}
                    src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
                : ''
              }
            </th>
            <th className='last'>
              <span
                onClick={()=>{this.handleChange(this, {'sort-field': {$set: 'doi'}})}}
              >DOI</span>
              {
                (this.state.query['sort-field'] === 'doi') ?
                  <img
                    onClick={()=>{this.handleChange(this, {order: {$set: (this.state.query.order === 'asc') ? 'desc' : 'asc'}})}}
                    className={'orderBy' + ((this.state.query.order === 'asc') ? ' ordered' : '')}
                    src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
                : ''
              }
            </th>
          </tr>
          {
            this.listDeposityHistory()
          }
        </table>
        <ReactPaginate previousLabel={<img className='prev' src={`${routes.images}/AddArticle/DarkTriangle.svg`} />}
                       nextLabel={<img className='nex' src={`${routes.images}/AddArticle/DarkTriangle.svg`} />}
                       breakLabel={<a href="">...</a>}
                       breakClassName={"break-me"}
                       pageCount={this.state.total > 0 ? (this.state.total/20) : 0}
                       marginPagesDisplayed={2}
                       pageRangeDisplayed={5}
                       onPageChange={this.handlePageClick.bind(this)}
                       containerClassName={"pagination"}
                       subContainerClassName={"pages pagination"}
                       activeClassName={"active"} />
      </div>
    )
  }
}

