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
    loading: is.bool.isRequired,
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
    this.setState({searchingFor: value});
    this.props.search(value);
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
    const { results } = this.props
    const { searchingFor, forceClose } = this.state

    return (
      <div className='publication-search-container'>
        <Autocomplete
          { ...forceClose ? {open:false} : {} }
          value={this.state.searchingFor}
          inputProps={{ placeholder: 'Search Publication' }}
          items={results}
          getItemValue={(item) => item.title}
          onSelect={this.onSelect}
          onChange={this.onChange}
          renderItem={(item, isHighlighted) => (
            <div className='publication-search-result'>{item.title}</div>
          )}
          renderMenu={(items, value, style) => (
            <div className='publication-search-results'>
              {this.props.loading ? (
                <div>Loading...</div>
              ) : searchingFor === '' ? (
                <div />
              ) : items.length === 0 ? (
                <div>No matches for {value}</div>
              ) : items}
            </div>
          )}
          className='publication-search'
          />
      </div>
    )
  }

}
