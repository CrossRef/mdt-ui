import React, { Component } from 'react'
import {browserHistory} from 'react-router'
import is from 'prop-types'
import { connect } from 'redux'
import Autocomplete from 'react-autocomplete'

import {errorHandler, compareDois} from '../../utilities/helpers'
import * as api from '../../actions/api'
import {routes} from '../../routing'


export default class Search extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    asyncSearchRecords: is.func.isRequired,
    pubTitle: is.string.isRequired,
    ownerPrefix: is.string.isRequired,
    search: is.object.isRequired,
    publication: is.object.isRequired,
    cart: is.array.isRequired,
  }


  constructor (props) {
    super(props)
    this.state = {
      searchType: 'Article',
      searchingFor: '',
      forceClose: true
    }
  }


  onChange = (e, value) => {
    clearTimeout(this.state.timeOut)
    let timeOut
    if(value.trim() !== '') {
      timeOut = setTimeout(()=>{
          this.props.asyncSearchRecords(value, this.props.pubTitle, this.state.searchType)
      }, 500)
    }
    this.setState({
      searchingFor: value,
      forceClose: !value,
      timeOut
    })

  }


  onSelect = (value, item) => {
    const publication = this.props.publication
    const publicationContains = this.props.publication.message.contains
    const pubDoi = this.props.publication.message.doi
    const ownerPrefix = this.props.ownerPrefix

    this.setState({ searchingFor: '', forceClose:true })

    api.getItem(item.doi).then((result) => {

      //clean up returned publication metadata and attach issue to submit
      result.message.doi = publication.message.doi
      result.message['owner-prefix'] = ownerPrefix
      delete result.message.content

      //Is lone article:
      if (result.message.contains[0].type === 'article') {
        const article = result.message.contains[0]
        article['mdt-version'] = '1'
        article['owner-prefix'] = ownerPrefix
        article.date = new Date()
        api.submitItem(result).then(()=>{
        browserHistory.push(`${routes.publications}/${encodeURIComponent(pubDoi)}/addarticle/${encodeURIComponent(item.doi)}`)
      })

      //Is article with issue
      } else if (result.message.contains[0].contains[0]) {
        const issue = result.message.contains[0]
        const issueDoi = issue.doi
        const issueTitle = JSON.stringify(issue.title)
        const article = issue.contains[0]
        article['mdt-version'] = '1'
        article['owner-prefix'] = ownerPrefix
        article.date = new Date()

        //Check if issue already exists
        for (let record of publicationContains) {
          if(record.type === 'issue' && (issueDoi ? record.doi === issueDoi : JSON.stringify(record.title) === issueTitle)) { 
            api.submitItem(result).then(()=>{
            browserHistory.push(`${routes.publications}/${encodeURIComponent(pubDoi)}/${encodeURIComponent(issueDoi || issueTitle)}/addarticle/${encodeURIComponent(item.doi)}`)
          })
            return
          }
        }

        issue['mdt-version'] = '1'
        issue['owner-prefix'] = ownerPrefix
        issue.date = new Date()
        issue.contains = []
        api.submitItem(result).then(()=>{
        issue.contains=[article]
        api.submitItem(result).then(()=>{
          browserHistory.push(`${routes.publications}/${encodeURIComponent(pubDoi)}/${encodeURIComponent(issueDoi || issueTitle)}/addarticle/${encodeURIComponent(item.doi)}`)
        })}
      )}
    })
    .catch((error) => errorHandler(error))

  }


  renderItem =  item => {
    const addable = !this.props.publication.normalizedRecords.find( record => compareDois(record.doi, item.doi))
    return (
      <this.ItemComponent key={`${item.title.title}-${item.doi}`} item={item} addable={addable}/>
    )
  }

  //Item component has to be a class object because Autocomplete needs to use refs which are only available with classes
  ItemComponent = class extends Component {
    render () {
      const {item, addable, ...props} = this.props
      const title = item.title.title

      return (
        <div className={`record-search-result-holder ${!addable ? 'notAddable' : ''}`} {...(addable ? props : {})}>
          <div className='record-search-result'>
            {title || item.doi || 'Error retrieving metadata'}
          </div>
          {addable && <div className="add">Add</div>}
        </div>
      )
    }
  }


  render () {
    const results = this.props.search.result.works || []
    const { searchingFor, forceClose } = this.state

    return (
      <div className='recordSearchHolder'>
        <div className='record-search-container'>
          <select className="searchType" value={this.state.searchType} onChange={(e) => this.setState({searchType:e.target.value})}>
            <option>Article</option>
          </select>

          <Autocomplete
            { ...(forceClose ? {open:false} : {}) } //This adds the prop open with value false to the component if forceClose, otherwise, does not add any prop
            value={this.state.searchingFor}
            items={results}
            getItemValue={(item) => {
              if(typeof item === 'string') {
                return item
              }
              return item.doi || null
            }}
            onSelect={this.onSelect}
            onChange={this.onChange}
            renderItem={this.renderItem}
            renderMenu={(items, value, style) =>
              <div className='record-search-results'>
                {this.props.search.loading ? (
                  <div>Loading...</div>
                ) : searchingFor === '' ? (
                  <div />
                ) : items.length === 0 ? (
                  <div>No matches for {value}</div>
                ) : items}
              </div>
            }
            placeholder='Search'
            className='record-search'
          />
        </div>
      </div>
    )
  }

}
