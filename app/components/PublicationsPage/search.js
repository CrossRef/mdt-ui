import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'redux'
import Autocomplete from 'react-autocomplete'

import AddPublicationModal from '../../containers/addPublicationModal'
import * as api from '../../actions/api'


export default class Search extends Component {

  static propTypes = {
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
    clearTimeout(this.state.timeOut)
    let timeOut
    if(value.trim() !== '') {
      timeOut = setTimeout(()=>{
        this.props.asyncSearch(value)
      }, 500)
    }
    this.setState({
      searchingFor: value,
      forceClose: !value,
      timeOut
    })
  }


  onSelect = async (value, item) => {
    this.setState({ searchingFor: '', forceClose:true });
    if(item.doi.length===1) {
      let savedPublication
      try {
        savedPublication = await api.getItem(item.doi[0])
        savedPublication = savedPublication.message
      } catch (e) {
        console.error('Unable to retrieve saved data of publication found in Search', e)
      }

      const newPublication = {
        'title': savedPublication.title || typeof item.title === 'string' ? {title: item.title} : item.title,
        'doi': item.doi[0],
        'date': new Date(),
        'owner-prefix': savedPublication['owner-prefix'] || item.doi[0].split('/')[0],
        'type': 'Publication',
        'mdt-version': '1',
        'status': 'draft',
        'content': savedPublication.content || '',
        'contains': []
      }

      this.props.asyncSubmitPublication(newPublication)
    } else {
      this.props.reduxControlModal({
        showModal: true,
        title: 'Edit Journal Record',
        Component: AddPublicationModal,
        props: {
          mode: 'search',
          searchResult: item,
          asyncSubmitPublication: this.props.asyncSubmitPublication,
          reduxCartUpdate: this.props.reduxCartUpdate,
          crossmarkPrefixes: this.props.crossmarkPrefixes,
          prefixes: this.props.prefixes
        }
      })
    }
  }


  RenderItem = class extends Component {
    render () {
      const {item} = this.props

      return (
        <div className='search-result-holder'>
          <div className='search-result'>{item.title}</div>
          <div className="add">Add</div>
        </div>
      )
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
          renderItem={ item => <this.RenderItem key={`${item.title}-${item.doi}`} item={item}/>}
          renderMenu={(items, value, style) =>
            <div className='publication-search-results'>
              {this.props.loading ? (
                <div>Loading...</div>
              ) : searchingFor === '' ? (
                <div />
              ) : items.length === 0 ? (
                <div>No matches for {value}</div>
              ) : items}
            </div>
          }
          className='publication-search'
          />
      </div>
    )
  }

}
