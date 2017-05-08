import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { stateTrackerII, updateReporterII } from 'my_decorators'

import { controlModal, getPublications, addDOIs, submitPublication } from '../../../actions/application'
import client from '../../../client'
import Publications from '../../../components/Publications'
import ManagementBar from '../../../components/Publications/ManagementBar'
import AddPublication from '../../../components/Modal/AddPublication'



const mapStateToProps = state => ({
  DOIs: state.dois,
  searchResults: state.search.data.message || emptyArray,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxControlModal: controlModal,
  reduxAddDOIs: addDOIs,
  asyncGetPublications: getPublications,
  asyncSubmitPublication: submitPublication,
  search: client.actions.search
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class PublicationsContainer extends Component {

  static propTypes = {
    DOIs: is.array.isRequired,
    searchResults: is.array,
    reduxControlModal: is.func.isRequired,
    reduxAddDOIs: is.func.isRequired,
    asyncGetPublications: is.func.isRequired,
    asyncSubmitPublication: is.func.isRequired,
    search: is.func.isRequired,
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
    Component: AddPublication,
    props:{
      reduxAddDOIs: this.props.reduxAddDOIs,
      asyncSubmitPublication: this.props.asyncSubmitPublication
    }
  })

  render () {
    const { searchResults, search, DOIs, reduxAddDOIs } = this.props;

    return (
      <div className='publications'>
        <ManagementBar
          openAddPublicationModal={this.openAddPublicationModal}
          addDOIs={reduxAddDOIs}
          search={search}
          searchResults={searchResults} />

        {DOIs.length ? <Publications dois={DOIs} />
        : <div className='empty-message'>No publications, please create one!</div>}

      </div>
    )
  }
}

const activeSearchResults = [];
const emptyArray = [];
