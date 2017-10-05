import React, { Component } from 'react'
import is from 'prop-types'
import update from 'immutability-helper'
import { stateTrackerII, updateReporterII } from 'my_decorators'
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
    api.getDepositHistory(cleanObj(this.state.query)).then(results => {
      this.setState({
        total: results['total-count'],
        depositHistory: results.message
      })
    })
      .catch(e => this.setState({serverError: error}))
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.state.query !== nextState.query) {
      api.getDepositHistory(cleanObj(nextState.query)).then(results => {
        this.setState({
          total: results['total-count'],
          depositHistory: results.message
        })
      })
        .catch(e => this.setState({serverError: error}))
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

  listDepositHistory = () => {
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

    return depositHistory.map((historyItem, i) => {
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
    return (
      <DepositHistoryView
        listDepositHistory={this.listDepositHistory}
        boundSetState={this.boundSetState}
        handleChange={this.handleChange}
        handlePageClick={this.handlePageClick}

        {...this.state}
      />
    )
  }

}