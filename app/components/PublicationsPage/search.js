import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'redux'
import Autocomplete from 'react-autocomplete'
import { stateTrackerII } from 'my_decorators'

import AddPublicationCard from '../../containers/addPublicationModal'


export default class Search extends Component {

  static propTypes = {
    reduxAddDOIs: is.func.isRequired,
    reduxControlModal: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    asyncSubmitPublication: is.func.isRequired,
    asyncSearch: is.func.isRequired,
    results: is.array,
    loading: is.bool.isRequired,
    crossmarkPrefixes: is.array.isRequired,
    prefixes: is.array.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      searchingFor: '',
      forceClose: true
    }
  }


  onChange = (e, value) => {
    value ? this.setState({ forceClose:false }) : this.setState({ forceClose:true })
    this.setState({searchingFor: value});
    this.props.asyncSearch(value);
  }


  onSelect = (value, item) => {
    this.setState({ searchingFor: '', forceClose:true });
    if(item.doi) {
      this.props.reduxAddDOIs(item.doi)
    } else {
      this.props.reduxControlModal({
        showModal: true,
        title: 'Edit Journal Record',
        Component: AddPublicationCard,
        props: {
          mode: 'search',
          searchResult: item,
          asyncSubmitPublication: this.props.asyncSubmitPublication,
          reduxAddDOIs: this.props.reduxAddDOIs,
          reduxCartUpdate: this.props.reduxCartUpdate,
          crossmarkPrefixes: this.props.crossmarkPrefixes,
          prefixes: this.props.prefixes
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
          { ...(forceClose ? {open:false} : {}) }
          value={this.state.searchingFor}
          inputProps={{ placeholder: 'Search Publication' }}
          items={results}
          getItemValue={(item) => item.title}
          onSelect={this.onSelect}
          onChange={this.onChange}
          renderItem={(item, isHighlighted) => (
            <div key={item.title + '-' + item.doi} className='search-result-holder'>
              <div className='search-result'>{item.title}</div>
              <div className="add">Add</div>
            </div>

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
