import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'redux'
import Autocomplete from 'react-autocomplete'
import { stateTrackerII } from 'my_decorators'

import AddPublicationCard from './addPublicationCard'
import AddIssueCard from './addIssueCard'
import * as api from '../actions/api'


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
    asyncGetPublications: is.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      searchType: 'All',
      searchingFor: '',
      loading: false,
      forceClose: true
    }
  }


  onChange = (e, value) => {
    value ? this.setState({ forceClose:false }) : this.setState({ forceClose:true })
    this.setState({searchingFor: value})
    this.props.asyncSearchRecords(value, this.props.pubTitle, this.state.searchType)
  }


  onSelect = (value, item) => {
    const publication = this.props.publication
    const publicationContains = this.props.publication.message.contains
    const pubDoi = this.props.publication.message.doi
    const ownerPrefix = this.props.ownerPrefix

    this.setState({ searchingFor: '', loading: false, forceClose:true })


    if(typeof item === 'string') {
      const [type, number] = item.split(' ')
      return this.props.reduxControlModal({
        showModal: true,
        title: 'Edit Issue/Volume',
        style: 'addIssueModal',
        Component: AddIssueCard,
        props: {
          mode: 'add',
          ownerPrefix: ownerPrefix,
          preFilledData: type === 'Issue' ? {issue: number} : {volume: number},
          publication: publication,
          asyncGetPublications: this.props.asyncGetPublications,
        }
      })
    }


    api.getItem(item.doi).then((result) => {

      //clean up returned publication metadata
      result.message.doi = publication.message.doi
      result.message['owner-prefix'] = ownerPrefix
      delete result.message.content

      //Is lone record:
      if(result.message.contains[0].type === item.type) {

        //Prepare record metadata
        const record = result.message.contains[0]
        record['mdt-version'] = '0'

        api.submitItem(result).then(() => this.props.asyncGetPublications(pubDoi))

      //Is article with issue
      } else if (result.message.contains[0].contains[0].type === item.type) {

        //Separate article
        const savedArticle = result.message.contains[0].contains[0]
        savedArticle['owner-prefix'] = ownerPrefix
        savedArticle['mdt-version'] = '0'

        //Prepare issue metadata
        const issue = result.message.contains[0]
        issue['mdt-version'] = '0'
        issue['owner-prefix'] = ownerPrefix
        issue.contains = []

        //check for issue Doi
        if(!issue.doi) {
          return this.props.reduxControlModal({
            showModal: true,
            title: 'Edit Issue/Volume',
            style: 'addIssueModal',
            Component: AddIssueCard,
            props: {
              mode: 'search',
              ownerPrefix: ownerPrefix,
              issue: issue,
              savedArticle: savedArticle,
              publication: publication,
              cart: this.props.cart,
              reduxCartUpdate: this.props.reduxCartUpdate,
              asyncGetPublications: this.props.asyncGetPublications,
            }
          })
        }

        //check for duplicate
        for (var i in publicationContains) {
          if(publicationContains[i].doi === issue.doi) {

            //try to add article, reset issue metadata
            issue.contains = [savedArticle]
            delete issue.content
            delete issue['mdt-version']

            api.submitItem(result).then(() => this.props.asyncGetPublications(pubDoi))
            return
          }
        }
        
        api.submitItem(result).then(()=>{
          //reset issue metadata
          issue.contains = [savedArticle]
          delete issue['mdt-version']

          api.submitItem(result).then(()=>{
            this.props.asyncGetPublications(pubDoi)
          })
          .catch( e => console.error('Error in searchRecords save 2: ', e))
        })
        .catch( e => console.error('Error in searchRecords save: ', e))
      }
    })
    .catch((error) => {
      this.props.reduxControlModal({
        showModal: true,
        title: `Error ${error}`,
        style: 'errorModal',
        Component: ()=>null
      })
    })

  }

  packageIssues = () => {
    if(this.props.search.result['journal-issue'] || this.props.search.result['journal-volume']) {
      return [
        ...(this.props.search.result['journal-issue'] ? this.props.search.result['journal-issue'].sort( (a,b) => b-a ).map( e => `Issue ${e}` ) : []),
        ...(this.props.search.result['journal-volume'] ? this.props.search.result['journal-volume'].sort( (a,b) => b-a ).map( e => `Volume ${e}` ) : [])
      ]
    }
  }


  render () {
    const results = this.state.searchType === 'Issue' ? this.packageIssues() || [] : this.props.search.result.works || []
    const { searchingFor, forceClose } = this.state

    return (
      <div className='recordSearchHolder'>
        <div className='record-search-container'>
          <select className="searchType" value={this.state.searchType} onChange={(e) => this.setState({searchType:e.target.value})}>
            <option>All</option>
            <option>Issue</option>
            <option>Article</option>
          </select>

          <Autocomplete
            { ...(forceClose ? {open:false} : {}) }
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
            renderItem={(item, isHighlighted) => {

              if(typeof item === 'string') {
                return <div key={item} className='search-result-holder'>
                  <div className='search-result'>
                    {item}
                  </div>
                  <div className="add">Add</div>
                </div>
              }

              const { title, issue, volume } = item.title
              const recordTitle = (!title && (issue || volume)) ? `Issue ${issue || 'NA'}, Volume ${volume || 'NA'}` : title
              if(item.type === 'issue') {
                let display
                if(!title && (issue || volume)) display = `Issue ${issue || 'NA'}, Volume ${volume || 'NA'}`
                return (
                  <div key={recordTitle + '-' + item.doi} className='search-result-holder'>
                    <div className='search-result'>
                      {title || display || item.doi || 'Error retrieving metadata'}
                    </div>
                    <div className="add">Add</div>
                  </div>
                )
              } else {
                return (
                  <div key={recordTitle + '-' + item.doi} className='record-search-result-holder'>
                    <div className='record-search-result'>
                      {title || item.doi || 'Error retrieving metadata'}
                    </div>
                    <div className="add">Add</div>
                  </div>
                )
              }
            }}
            renderMenu={(items, value, style) => {
              return <div className='record-search-results'>
                {this.props.search.loading ? (
                  <div>Loading...</div>
                ) : searchingFor === '' ? (
                  <div />
                ) : items.length === 0 ? (
                  <div>No matches for {value}</div>
                ) : items}
              </div>
            }}
            placeholder='Search'
            className='record-search'
          />
        </div>
      </div>
    )
  }

}
