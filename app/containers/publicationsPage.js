import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { stateTrackerII, updateReporterII } from 'my_decorators'

import { controlModal, getPublications, addDOIs, submitPublication, cartUpdate, search } from '../actions/application'
import Publications from '../components/publications'
import Search from '../components/search'
import AddPublicationCard from '../components/addPublicationCard'



const mapStateToProps = state => ({
  DOIs: state.dois,
  searchResults: state.search.result,
  loading: state.search.loading,
  crossmarkPrefixes: state.login['crossmark-prefixes'],
  loading: state.search.loading,
  prefixes: state.login.prefixes
})

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxControlModal: controlModal,
  reduxAddDOIs: addDOIs,
  asyncGetPublications: getPublications,
  asyncSubmitPublication: submitPublication,
  search: search,
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
    cartUpdate: is.func.isRequired,
    crossmarkPrefixes: is.array.isRequired,
    prefixes: is.array.isRequired
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
      asyncSubmitPublication: this.props.asyncSubmitPublication,
      crossmarkPrefixes: this.props.crossmarkPrefixes,
      prefixes: this.props.prefixes
    }
  })

  render () {
    const { searchResults, search, loading, DOIs, reduxAddDOIs, reduxControlModal , asyncSubmitPublication} = this.props;
    return (
      <div className='publications'>
        <div className='management-bar'>
          <Search
            search={search}
            results={searchResults}
            loading={loading}
            reduxAddDOIs={reduxAddDOIs}
            reduxControlModal={reduxControlModal}
            asyncSubmitPublication={asyncSubmitPublication}
            crossmarkPrefixes={this.props.crossmarkPrefixes}/>
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

