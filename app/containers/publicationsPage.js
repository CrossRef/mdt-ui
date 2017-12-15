import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { controlModal, getPublications, submitPublication, cartUpdate, search } from '../actions/application'
import PublicationCard from '../components/PublicationsPage/publicationCard'
import Search from '../components/PublicationsPage/search'
import AddPublicationModal from './addPublicationModal'



const mapStateToProps = state => ({
  DOIs: state.dois,
  searchResults: state.search.result.filter( item => item.doi.every( doi => !state.publications[doi])),
  loading: state.search.loading,
  crossmarkPrefixes: state.login['crossmark-prefixes'],
  prefixes: state.login.prefixes
})

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxControlModal: controlModal,
  asyncGetPublications: getPublications,
  asyncSubmitPublication: submitPublication,
  asyncSearch: search,
  reduxCartUpdate: cartUpdate
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class PublicationsPage extends Component {

  static propTypes = {
    DOIs: is.array.isRequired,
    searchResults: is.array,
    reduxControlModal: is.func.isRequired,
    asyncGetPublications: is.func.isRequired,
    asyncSubmitPublication: is.func.isRequired,
    asyncSearch: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    crossmarkPrefixes: is.array.isRequired,
    prefixes: is.array.isRequired
  }

  openAddPublicationModal = () => this.props.reduxControlModal({
    showModal:true,
    title:'Create Journal Record',
    Component: AddPublicationModal,
    props:{
      mode: 'add',
      reduxCartUpdate: this.props.reduxCartUpdate,
      asyncSubmitPublication: this.props.asyncSubmitPublication,
      crossmarkPrefixes: this.props.crossmarkPrefixes,
      prefixes: this.props.prefixes
    }
  })

  render () {
    const { searchResults, asyncSearch, loading, DOIs, reduxControlModal , asyncSubmitPublication, reduxCartUpdate} = this.props;
    return (
      <div className='publications'>
        <div className='management-bar'>
          <Search
            asyncSearch={asyncSearch}
            results={searchResults}
            loading={loading}
            reduxControlModal={reduxControlModal}
            reduxCartUpdate={reduxCartUpdate}
            asyncSubmitPublication={asyncSubmitPublication}
            prefixes={this.props.prefixes}
            crossmarkPrefixes={this.props.crossmarkPrefixes}/>
          <button
            className='addPublication'
            onClick={this.openAddPublicationModal}
            >New Publication
          </button>
        </div>

        {DOIs.length ?
          <div className='content'>
            <div className='tools' />
            <div className='cards'>
              {DOIs.map((doi, i) => <PublicationCard doi={doi} key={i} />)}
            </div>
          </div>
        : <div className='empty-message'>No publications, please create one!</div>}

      </div>
    )
  }
}

