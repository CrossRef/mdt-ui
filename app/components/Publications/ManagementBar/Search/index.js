import React, { Component } from 'react'
import is from 'prop-types'
import Autocomplete from 'react-autocomplete'
import { stateTrackerII } from 'my_decorators'


export default class Search extends Component {

  static propTypes = {
    addDOIs: is.func.isRequired,
    search: is.func.isRequired,
    results: is.array,
  }

  constructor (props) {
    super(props)
    this.state = {
      searchingFor: '',
      loading: false
    }

    this.loading = false
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

  render () {
    const { results, addDOIs } = this.props
    const { searchingFor } = this.state
    return (
      <div className='publication-search-container'>
        <Autocomplete
          value={this.state.searchingFor}
          items={results}
          getItemValue={(item) => item.title}
          onSelect={(value, item) => {
            console.log(value, item)
            this.setState({searchingFor: '', selected: item})
            if (item.doi) {
              addDOIs([item.doi])
            }
          }}
          onChange={(e, value) => {
            this.onSearch(value).then(() => this.setState({ loading: false }))
          }}
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
