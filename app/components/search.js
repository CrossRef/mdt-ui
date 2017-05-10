import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'redux'
import Autocomplete from 'react-autocomplete'
import { stateTrackerII } from 'my_decorators'

import AddPublicationCard from './addPublicationCard'


export default class Search extends Component {

  static propTypes = {
    reduxAddDOIs: is.func.isRequired,
    reduxControlModal: is.func.isRequired,
    asyncSubmitPublication: is.func.isRequired,
    search: is.func.isRequired,
    results: is.array,
  }

  constructor (props) {
    super(props)
    this.loading = false;
    this.state = {
      searchingFor: '',
      loading: false,
      forceClose: true
    }
  }


  onChange = (e, value) => {
    value ? this.setState({ forceClose:false }) : this.setState({ forceClose:true })
    this.onSearch(value).then(() => this.setState({ loading: false }))
  }


  onSearch (searchingFor, fromChain) {
    this.setState({
      searchingFor
    })

    if (!searchingFor) {
      return new Promise((resolve) => {
        resolve()
      })
    }

    const chain = this.loading
    if (chain && !fromChain) {
      // Follow up once the other request has completed
      return new Promise((resolve, reject) => {
        chain.then(() => this.onSearch(searchingFor, true)
          .then(() => resolve())
          .catch(reason => reject(reason)))
          .catch(reason => reject(reason))
      })
    }

    this.loading = this.props.search({
      q: searchingFor
    })

    this.setState({
      loading: true
    })

    return this.loading
  }


  onSelect = (value, item) => {
    this.setState({ searchingFor: '', loading: false, forceClose:true });
    if(item.doi) {
      this.props.reduxAddDOIs(item.doi)
    } else {
      this.props.reduxControlModal({
        showModal: true,
        title: 'Add DOI',
        Component: AddPublicationCard,
        props: {
          searchResult: item,
          asyncSubmitPublication: this.props.asyncSubmitPublication,
          reduxAddDOIs: this.props.reduxAddDOIs
        }
      })
    }
  }


  render () {
    const { results, addDOIs } = this.props
    const { searchingFor, forceClose } = this.state

    return (
      <div className='publication-search-container'>
        <Autocomplete
          { ...forceClose ? {open:false} : {} }
          value={this.state.searchingFor}
          items={results}
          getItemValue={(item) => item.title}
          onSelect={this.onSelect}
          onChange={this.onChange}
          renderItem={(item, isHighlighted) => (
            <div className='publication-search-result'>{item.title}</div>
          )}
          renderMenu={(items, value, style) => (
            <div className='publication-search-results'>
              {this.state.loading ? (
                <div>Loading...</div>
              ) : searchingFor === '' ? (
                <div />
              ) : items.length === 0 ? (
                <div>No matches for {value}</div>
              ) : items}
            </div>
          )}
          placeholder='Search Publication'
          className='publication-search'
          />
      </div>
    )
  }

}
