import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { stateTrackerII } from 'my_decorators'

import { getPublications, controlModal, cartUpdate, clearCart, deleteRecord, searchRecords, getItem, submitIssue } from '../actions/application'
import Publication from '../components/Publication/publication'


const mapStateToProps = (state, props) => ({
  publication: state.publications[props.routeParams.doi] || state.publications[props.routeParams.doi.toLowerCase()],
  cart: state.cart,
  search: state.search
})

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxControlModal: controlModal,
  reduxCartUpdate: cartUpdate,
  reduxClearCart: clearCart,

  asyncGetPublications: getPublications,
  asyncDeleteRecord: deleteRecord,
  asyncSearchRecords: searchRecords,
  asyncGetItem: getItem,
  asyncSubmitIssue: submitIssue
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class PublicationPage extends Component {

  static propTypes = {
    search: is.object.isRequired,
    publication: is.object,
    routeParams: is.shape({
      doi: is.string.isRequired
    }).isRequired,
    location: is.shape({
      query: is.shape({
        modal: is.string
      })
    }),

    reduxControlModal: is.func.isRequired,

    asyncGetPublications: is.func.isRequired,
    asyncSearchRecords: is.func.isRequired,
    asyncGetItem: is.func.isRequired,
    asyncSubmitIssue: is.func.isRequired,
    asyncDeleteRecord: is.func.isRequired,
  }

  state = { serverError: null }

  componentDidMount () {
    this.props.asyncGetPublications(this.props.routeParams.doi, undefined, error => {
      this.setState({ serverError: error })
    })
  }

  render () {
    const doi = this.props.routeParams.doi;

    return (
      <div>
        {this.props.publication ?
          <Publication
            ownerPrefix={doi.split('/')[0]}
            search={this.props.search}
            cart={this.props.cart}
            publication={this.props.publication}
            triggerModal={this.props.location.query.modal ? this.props.location.query.modal : undefined}

            reduxControlModal={this.props.reduxControlModal}
            reduxCartUpdate={this.props.reduxCartUpdate}

            asyncDeleteRecord={this.props.asyncDeleteRecord}
            asyncSearchRecords={this.props.asyncSearchRecords}
            asyncGetItem={this.props.asyncGetItem}
            asyncGetPublications={this.props.asyncGetPublications}
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
