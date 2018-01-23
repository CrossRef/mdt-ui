import React, { Component } from 'react'
import is from 'prop-types'
import update from 'immutability-helper'
import _ from 'lodash'

import DepositHistoryItem from '../components/DepositHistoryPage/depositHistoryItem'
import {objectSearch, xmldoc, cleanObj} from '../utilities/helpers'
import * as api from '../actions/api'
import DepositHistoryView from '../components/DepositHistoryPage/depositHistoryView'




export default class DepositHistoryPage extends Component {

  constructor (props) {
    super(props)
    this.state = {
      depositHistory: [],
      activeCalendar: '',
      startFullDate: undefined,
      startDate: '',
      startMonth: '',
      startYear: '',
      endFullDate: undefined,
      endDate: '',
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
      serverError: '',
      activeErrorMessage: ''
    }
  }


  componentWillMount () {
    api.getDepositHistory(cleanObj(this.state.query)).then(results => {
      this.setState({
        total: results['total-count'],
        depositHistory: results.message
      })
    })
      .catch(e => this.setState({serverError: e}))
  }


  componentWillUpdate (nextProps, nextState) {
    if (this.state.query !== nextState.query) {
      api.getDepositHistory(cleanObj(nextState.query)).then(results => {
        this.setState({
          total: results['total-count'],
          depositHistory: results.message
        })
      })
        .catch(e => this.setState({serverError: e}))
    }
  }


  handlePageClick = (current, pageSize) => {
    var selected = current
    let offset = Math.ceil(selected * this.state.query.count)
    this.setState({
      query: update(this.state.query, {offset: {$set: offset}})
    })
  }


  handleChange = (e, sortFields) => {
    if (e.target) {
      const name = e.currentTarget.name
      switch (name) {
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


  errorMessageHandler = (name) => {
    this.setState({activeErrorMessage: name})
  }


  listDepositHistory = () => {
    return this.state.depositHistory.map((historyItem, i) => {
      const historyInfo = xmldoc(historyItem.eventInfo)
      const depositId = objectSearch(historyInfo, 'submission_id')
      const doi = historyItem.doi
      const title = JSON.parse(historyItem.title).title
      const errorMessage = objectSearch(historyInfo, 'msg')

      const uniqueId = `${i}-${doi}-${title}-${depositId}`

      return (
        <DepositHistoryItem
          key={uniqueId}
          name={uniqueId}
          activeErrorMessage={this.state.activeErrorMessage}
          errorMessageHandler={this.errorMessageHandler}
          history={{
            version: historyItem.MDTVersion,
            id: depositId,
            date: historyItem.eventTime,
            depositTimestamp: historyItem['deposit-timestamp'],
            doi: doi,
            title: title,
            pubDoi: historyItem.pubDoi,
            status: historyItem.evenStatus === 'OK' ? 'Accepted' : 'Failed',
            errorMessage
          }}/>
      )
    })
  }


  calendarHandler = (target, dateObj) => {
    const datePayload = dateObj ? {
      [`${this.state.activeCalendar}FullDate`]: dateObj.fullDate,
      [`${this.state.activeCalendar}Date`]: dateObj.day,
      [`${this.state.activeCalendar}Month`]: dateObj.month,
      [`${this.state.activeCalendar}Year`]: dateObj.year,
      query: {...this.state.query, [this.state.activeCalendar]: `${dateObj.year}-${dateObj.month}-${dateObj.day}`}
    } : {}

    this.setState({
      activeCalendar: target,
      ...datePayload
    })
  }


  render () {
    return (
      <DepositHistoryView
        listDepositHistory={this.listDepositHistory}
        calendarHandler={this.calendarHandler}
        handleChange={this.handleChange}
        handlePageClick={this.handlePageClick}

        {...this.state}
      />
    )
  }

}