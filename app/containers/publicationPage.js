import React, { Component } from 'react'
import is from 'prop-types'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { stateTrackerII } from 'my_decorators'

import { getPublications, controlModal, cartUpdate, clearCart } from '../actions/application'
import client from '../client'
import fetch from '../utilities/fetch'
import Publication from '../components/Publication/publication'

const mapStateToProps = (state, props) => ({
  publication: state.publications[props.routeParams.doi],
  cart: state.cart
})

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxControlModal: controlModal,
  asyncGetPublications: getPublications,
  reduxCartUpdate: cartUpdate,
  reduxClearCart: clearCart
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class PublicationPage extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    asyncGetPublications: is.func.isRequired,
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
    return fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${doi}`, { headers: client.headers })
    .then(doi => doi.json())
    .then((doi) => {
      return callback(doi)
    })
    .catch((reason) => {
      console.warn('Kicking back to login screen:', reason)
      browserHistory.push('/')
    })
  }

  fetchDOI = (doi) => {
    fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${doi}`, { headers: client.headers })
    .then(doi => doi.json())
    .then((doi) => {
      console.log('What do I need to fetch here for?')
    })
    .catch((reason) => {
      console.error('ERROR: Publication component fetch DOI ', reason)
    })
  }

  postIssue (publication, callback) {
    return fetch(`http://mdt.crossref.org/mdt/v1/work`, { // using isomorphic-fetch directly here, React is NOT passing the action everytime
        method: 'post',
        headers: client.headers,
        body: JSON.stringify(publication)
      }
    ).then(() => {
      return callback()
    })
    .catch((reason) => {
      console.warn('Kicking back to login screen:', reason)
      browserHistory.push('/')
    })
  }

  render () {
    const doi = this.props.routeParams.doi;
    return (
      <div>
        {this.props.publication ?
          <Publication
            publication={this.props.publication}
            handle={this.props.asyncGetPublications}
            reduxControlModal={this.props.reduxControlModal}
            reduxCartUpdate={this.props.reduxCartUpdate}
            fetchIssue={this.fetchIssue.bind(this)}
            triggerModal={this.props.location.query.modal ? this.props.location.query.modal : undefined}
            postIssue={this.postIssue.bind(this)}
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
