import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { stateTrackerII, updateReporterII } from 'my_decorators'

import { controlModal, getPublications, addDOIs, submitPublication, cartUpdate } from '../actions/application'
import client from '../client'
import Publications from '../components/publications'
import Search from '../components/search'
import AddPublicationCard from '../components/addPublicationCard'



const mapStateToProps = state => ({
  DOIs: state.dois,
  searchResults: state.search.data.message || emptyArray,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxControlModal: controlModal,
  reduxAddDOIs: addDOIs,
  asyncGetPublications: getPublications,
  asyncSubmitPublication: submitPublication,
  search: client.actions.search,
  cartUpdate: cartUpdate
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class PublicationsPage extends Component {

  static propTypes = {
    DOIs: is.array.isRequired,
    searchResults: is.array,
    reduxControlModal: is.func.isRequired,
    reduxAddDOIs: is.func.isRequired,
    asyncGetPublications: is.func.isRequired,
    asyncSubmitPublication: is.func.isRequired,
    search: is.func.isRequired,
    cartUpdate: is.func.isRequired
  }

  componentWillMount() { //Usually you don't want async actions in WillMount because they could ask this component to reRender before its mounted, but I know this comp isn't subscribed to publications data
    if(this.props.DOIs.length) this.props.asyncGetPublications(this.props.DOIs)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.DOIs.length !== nextProps.DOIs.length) this.props.asyncGetPublications(nextProps.DOIs)
  }

  openAddPublicationModal = () => this.props.reduxControlModal({
    showModal:true,
    title:'Create Journal Record',
    Component: AddPublicationCard,
    props:{
      reduxAddDOIs: this.props.reduxAddDOIs,
      asyncSubmitPublication: this.props.asyncSubmitPublication
    }
  })

  render () {
    const { searchResults, search, DOIs, reduxAddDOIs, reduxControlModal , asyncSubmitPublication} = this.props;

    return (
      <div className='publications'>
        <div className='management-bar'>
          <Search search={search} results={searchResults} reduxAddDOIs={reduxAddDOIs} reduxControlModal={reduxControlModal} asyncSubmitPublication={asyncSubmitPublication}/>
          <button
            className='addPublication'
            onClick={this.openAddPublicationModal}
            >New Publication
          </button>
        </div>

        {DOIs.length ? <Publications dois={DOIs} />
        : <div className='empty-message'>No publications, please create one!</div>}

      </div>
    )
  }
}

const emptyArray = [];
