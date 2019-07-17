import React, { Component } from 'react'
import is from 'prop-types'
import Autocomplete from 'react-autocomplete'

import AddPublicationModal from '../../containers/addPublicationModal'
import * as api from '../../actions/api'


export default class Search extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    asyncSubmitPublication: is.func.isRequired,
    asyncSearch: is.func.isRequired,
    results: is.array,
    publications: is.object.isRequired,
    loading: is.bool.isRequired
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

    } else if(!item.doi.length) {
      this.props.reduxControlModal({
        showModal: true,
        title: 'Edit Journal Record',
        Component: AddPublicationModal,
        props: {
          mode: 'search',
          searchResult: item,
        }
      })

    } else if(item.doi.length > 1) {
      this.props.reduxControlModal({
        showModal: true,
        title: 'Resolve DOI Journal conflict',
        style: 'warningModal',
        Component: this.ResolveWarning,
        props: {
          title: item.title,
          confirm: () => {
            this.props.reduxControlModal({
              showModal: true,
              title: 'Edit Journal Record',
              Component: AddPublicationModal,
              props: {
                mode: 'search',
                multipleDOIs: true,
                searchResult: item,
              }
            })
          }
        }
      })
    }
  }


  ResolveWarning = ({title, confirm, close}) => {
    return (
      <div className="resolveWarning">
        <div className="messageHolder">
          <div>Warning! Resolve DOI conflict before you add <b>{title}</b> to your workspace. Two or more DOIs are associated with this Journal.</div>

          <div>Please select one DOI from the Journal edit screen.</div>
        </div>
        <div className="buttonHolder">
          <button className="ok" onClick={confirm}>Ok</button>
          <button className="cancel" onClick={close}>Cancel</button>
        </div>
      </div>
    )
  }


  renderItem = item => {
    let addable = true
    for (let pubDoi in this.props.publications) {
      if(item.doi.some( doi => doi === pubDoi)) {
        addable = false
        break
      }
      if(this.props.publications[pubDoi].message.title.title === item.title) {
        addable = false
        break
      }
    }
    return (
      <this.ItemComponent key={`${item.title}-${item.doi}`} item={item} addable={addable}/>
    )
  }

  //Item component has to be a class object because Autocomplete needs to use refs which are only available with classes
  ItemComponent = class extends Component {
    render () {
      const {item, addable, ...props} = this.props

      return (
        <div className={`search-result-holder ${!addable ? 'notAddable' : ''}`} {...(addable ? props : {})}>
          <div className='search-result'>{item.title}</div>
          {addable && <div className="add">Add</div>}
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
          inputProps={{ placeholder: '+ Add existing journal' }}
          items={results}
          getItemValue={(item) => item.title}
          onSelect={this.onSelect}
          onChange={this.onChange}
          renderItem={this.renderItem}
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
