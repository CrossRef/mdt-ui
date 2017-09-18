import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'redux'
import Autocomplete from 'react-autocomplete'
import { stateTrackerII } from 'my_decorators'

import AddPublicationCard from './addPublicationCard'
import AddIssueCard from './addIssueCard'


export default class Search extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    asyncSearchRecords: is.func.isRequired,
    asyncGetItem: is.func.isRequired,
    pubTitle: is.string.isRequired,
    ownerPrefix: is.string.isRequired,
    search: is.object.isRequired,
    asyncSubmitIssue: is.func.isRequired,
    publication: is.object.isRequired,
    asyncGetPublications: is.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      searchType: 'all',
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

    this.props.asyncGetItem(item.doi)
    .then((result) => {

      //clean up returned publication metadata
      result.message.doi = publication.message.doi
      result.message['owner-prefix'] = ownerPrefix
      delete result.message.content

      //Is lone record:
      if(result.message.contains[0].type === item.type) {

        //Prepare record metadata
        const record = result.message.contains[0]
        record['mdt-version'] = '0'

        this.props.asyncSubmitIssue(result, () => {
          this.props.asyncGetPublications(pubDoi) //gets updated publication data and refreshes page
        })

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
              asyncGetPublications: this.props.asyncGetPublications,
              asyncSubmitIssue: this.props.asyncSubmitIssue,
              asyncGetItem: this.props.asyncGetItem
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

            this.props.asyncSubmitIssue(result, () => {
              this.props.asyncGetPublications(pubDoi)
            })
            return
          }
        }
        
        this.props.asyncSubmitIssue(result, () => {
          //reset issue metadata
          issue.contains = [savedArticle]
          delete issue['mdt-version']

          this.props.asyncSubmitIssue(result, () => {
            this.props.asyncGetPublications(pubDoi)
          })
        })
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


  render () {
    const results = this.props.search.result.works || []
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
              return item.doi || null
            }}
            onSelect={this.onSelect}
            onChange={this.onChange}
            renderItem={(item, isHighlighted) => {
              const { title, issue, volume } = item.title
              if(item.type === 'issue') {
                let display
                if(!title && (issue || volume)) display = `Issue ${issue || 'NA'}, Volume ${volume || 'NA'}`
                return (
                  <div key={item.doi} className='search-result-holder'>
                    <div className='search-result'>
                      {title || display || item.doi || 'Error retrieving metadata'}
                    </div>
                    <div className="add">Add</div>
                  </div>
                )
              } else {
                return (
                  <div key={item.doi} className='record-search-result-holder'>
                    <div className='record-search-result'>
                      {title || item.doi || 'Error retrieving metadata'}
                    </div>
                    <div className="add">Add</div>
                  </div>
                )
              }
            }}
            renderMenu={(items, value, style) => (
              <div className='record-search-results'>
                {this.props.search.loading ? (
                  <div>Loading...</div>
                ) : searchingFor === '' ? (
                  <div />
                ) : items.length === 0 ? (
                  <div>No matches for {value}</div>
                ) : items}
              </div>
            )}
            placeholder='Search'
            className='record-search'
          />
        </div>
      </div>
    )
  }

}
