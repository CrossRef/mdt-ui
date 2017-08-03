import React, { Component } from 'react'
import is from 'prop-types'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { stateTrackerII } from 'my_decorators'

import { getPublications, controlModal, cartUpdate, clearCart, deleteRecord, searchRecords, getItem, submitIssue } from '../actions/application'
import fetch from '../utilities/fetch'
import Publication from '../components/Publication/publication'


const mapStateToProps = (state, props) => ({
  publication: state.publications[props.routeParams.doi] || state.publications[props.routeParams.doi.toLowerCase()],
  cart: state.cart,
  search: state.search
})

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxControlModal: controlModal,
  asyncGetPublications: getPublications,
  asyncDeleteRecord: deleteRecord,
  reduxCartUpdate: cartUpdate,
  reduxClearCart: clearCart,
  asyncSearchRecords: searchRecords,
  asyncGetItem: getItem,
  asyncSubmitIssue: submitIssue
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class PublicationPage extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    asyncGetPublications: is.func.isRequired,
    asyncSearchRecords: is.func.isRequired,
    asyncGetItem: is.func.isRequired,
    asyncSubmitIssue: is.func.isRequired,
    search: is.object.isRequired,
    asyncDeleteRecord: is.func.isRequired,
    routeParams: is.shape({
      doi: is.string.isRequired
    }).isRequired,
    publication: is.object
  }

  state = { serverError: null }

  componentDidMount () {
    this.props.asyncGetPublications(this.props.routeParams.doi, undefined, error => {
      this.setState({ serverError: error })
    })
  }

  fetchIssue (doi, callback) {
    return fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${doi}`, { headers: {Authorization: localStorage.getItem('auth')} })
    .then(doi => doi.json())
    .then((doi) => {
      return callback(doi)
    })
    .catch((reason) => {
      console.warn('ERROR in publicationPage fetchIssue()', reason)
    })
  }

  render () {
    const doi = this.props.routeParams.doi;

    return (
      <div>
        {this.props.publication ?
          <Publication
            ownerPrefix={doi.split('/')[0]}
            asyncDeleteRecord={this.props.asyncDeleteRecord}
            asyncSearchRecords={this.props.asyncSearchRecords}
            search={this.props.search}
            asyncGetItem={this.props.asyncGetItem}
            cart={this.props.cart}
            publication={this.props.publication}
            handle={this.props.asyncGetPublications}
            reduxControlModal={this.props.reduxControlModal}
            reduxCartUpdate={this.props.reduxCartUpdate}
            fetchIssue={this.fetchIssue.bind(this)}
            triggerModal={this.props.location.query.modal ? this.props.location.query.modal : undefined}
            asyncSubmitIssue={this.props.asyncSubmitIssue}
          />
          :<div>
              <br/><br/><br/> {/*TEMPORARY STYLING, SHOULD USE CSS*/}
              {this.state.serverError ?
                <div>Sorry, this DOI ({doi}) is not retrieving a publication... <br/><br/> Error: {this.state.serverError} </div>
                : <div>Loading...</div>
              }
          </div>
        }
      </div>
    )
  }
}
