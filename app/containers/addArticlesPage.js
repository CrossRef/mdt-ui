import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { stateTrackerII } from 'my_decorators'

import { controlModal, getPublications, editForm, deleteCard, clearForm, cartUpdate } from '../actions/application'
import {xmldoc} from '../utilities/helpers'
import AddArticleCard from '../components/addArticleCard'
import * as api from '../actions/api'



const mapStateToProps = (state, props) => {
  return ({
    publication: state.publications[props.routeParams.doi],
    reduxForm: state.reduxForm,
    crossmarkPrefixes: state.login['crossmark-prefixes'],
    reduxCart: state.cart
  })
}

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxControlModal: controlModal,
  reduxEditForm: editForm,
  reduxDeleteCard: deleteCard,
  reduxClearForm: clearForm,
  asyncGetPublications: getPublications,
  reduxCartUpdate: cartUpdate
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class AddArticlesPage extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    reduxEditForm: is.func.isRequired,
    reduxClearForm: is.func.isRequired,
    reduxDeleteCard: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    asyncGetPublications: is.func.isRequired,
    reduxCart: is.array.isRequired,
    routeParams: is.shape({
      pubDoi: is.string.isRequired,
      articleDoi: is.string
    }).isRequired,
    location: is.shape({
      state: is.shape({
        duplicateFrom: is.string
      })
    }).isRequired,
    reduxForm: is.object.isRequired,
    publication: is.object,
    crossmarkPrefixes: is.array.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      publication: {},
      publicationMetaData: {},
      publicationXml: '',
      issuePublication: undefined,
      mode: 'add'
    }
  }

  componentDidMount () {
    const { duplicateFrom } = this.props.location.state || {};
    const { pubDoi, articleDoi, issueDoi } = this.props.routeParams;

    const getItems = []

    if(articleDoi || duplicateFrom) getItems.push(articleDoi ? api.getItem(articleDoi) : api.getItem(duplicateFrom))
    if(issueDoi) getItems.push(api.getItem(issueDoi))

    const getOldPub = !!articleDoi || !!duplicateFrom
    getItems.push(api.getItem(pubDoi, getOldPub).catch(e => api.getItem(pubDoi)))

    Promise.all(getItems)
      .then((publications)=>{
        let publMeta = publications[publications.length-1].message.content

        let article = publications[0]
        if (issueDoi) {
          //doing logic here so we don't have to change the addArticles page any further
          let unwrappedPub = publications[1]

          unwrappedPub.message.contains = [publications[0].message.contains[0].contains[0]]

          article = unwrappedPub
        }

        this.setState({
          mode: (articleDoi || duplicateFrom) ? 'edit' : 'add',
          publication: article,
          publicationMetaData: publMeta ? xmldoc(publMeta) : {},
          publicationXml: publMeta.substring(publMeta.indexOf('<journal_metadata>'), publMeta.indexOf('</Journal>')),
          issuePublication: publications[0]
        })
      })
  }

  componentWillUnmount () {
    this.props.reduxClearForm();
  }

  render () {
    const { publication, mode, publicationMetaData, publicationXml } = this.state
    const { pubDoi, doi, issueDoi } = this.props.routeParams
    const ownerPrefix = this.props.publication ? this.props.publication.message['owner-prefix'] : pubDoi.split('/')[0];
    return (
      <div className='addArticles'>
        <AddArticleCard
          reduxControlModal = {this.props.reduxControlModal}
          reduxEditForm={this.props.reduxEditForm}
          reduxDeleteCard={this.props.reduxDeleteCard}
          reduxCartUpdate={this.props.reduxCartUpdate}
          reduxForm={this.props.reduxForm}
          ownerPrefix={ownerPrefix}
          publication = { publication }
          publicationMetaData = { publicationMetaData }
          publicationXml = {publicationXml}
          issuePublication = {this.state.issuePublication}
          mode = { mode }
          issue = { issueDoi }
          isDuplicate = { this.props.location.state ? !!this.props.location.state.duplicateFrom : false }
          crossmarkPrefixes = { this.props.crossmarkPrefixes }
          reduxCart = {this.props.reduxCart}
        />
      </div>
    )
  }
}

