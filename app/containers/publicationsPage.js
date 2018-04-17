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
  searchResults: state.search.result,
  loading: state.search.loading,
  publications: state.publications
})

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxControlModal: controlModal,
  asyncSubmitPublication: submitPublication,
  asyncSearch: search,
  reduxCartUpdate: cartUpdate
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class PublicationsPage extends Component {

  static propTypes = {
    searchResults: is.array,
    publications: is.object.isRequired,
    reduxControlModal: is.func.isRequired,
    asyncSubmitPublication: is.func.isRequired,
    asyncSearch: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
  }


  openAddPublicationModal = () => this.props.reduxControlModal({
    showModal:true,
    title:'Create journal record',
    Component: AddPublicationModal,
    props:{
      mode: 'add',
    }
  })


  render () {
    const { searchResults, publications, asyncSearch, loading, DOIs, reduxControlModal , asyncSubmitPublication} = this.props;
    const doiArray = Object.keys(publications) || []
    let buttonCount = 0

    return (
      <div className='publications'>
        <div className='management-bar'>
          <Search
            asyncSearch={asyncSearch}
            results={searchResults}
            publications={publications}
            loading={loading}
            reduxControlModal={reduxControlModal}
            asyncSubmitPublication={asyncSubmitPublication}/>
          <button
            className='addPublication'
            onClick={this.openAddPublicationModal}
            >New publication
          </button>
        </div>

        {doiArray.length ?
          <div className='content'>
            <div className='tools' />
            <div className='cards'>
              {doiArray.reverse().map((doi, i) => {
                if(buttonCount === 4) {
                  buttonCount = 1
                } else {
                  buttonCount = buttonCount + 1
                }
                return <PublicationCard doi={doi} key={doi} buttonCount={buttonCount}/>
              })}
            </div>
          </div>
        : <div className='empty-message'>No publications, please create one!</div>}

      </div>
    )
  }
}

