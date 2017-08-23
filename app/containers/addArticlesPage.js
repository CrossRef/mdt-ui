import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, browserHistory } from 'react-router'
import { stateTrackerII } from 'my_decorators'

import { controlModal, getPublications, editForm, clearForm, submitArticle, cartUpdate, getItem } from '../actions/application'
import xmldoc from '../utilities/xmldoc'
import AddArticleCard from '../components/addArticleCard'



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
  reduxClearForm: clearForm,
  asyncGetItem: getItem,
  asyncGetPublications: getPublications,
  asyncSubmitArticle: submitArticle,
  reduxCartUpdate: cartUpdate
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class AddArticlesPage extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    reduxEditForm: is.func.isRequired,
    reduxClearForm: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    asyncGetPublications: is.func.isRequired,
    asyncSubmitArticle: is.func.isRequired,
    asyncGetItem: is.func.isRequired,
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
      issuePublication: undefined,
      mode: 'add'
    }
  }

  componentDidMount () {
    const { duplicateFrom } = this.props.location.state || {};
    const { pubDoi, articleDoi, issueDoi } = this.props.routeParams;

    const dois = [articleDoi || duplicateFrom || pubDoi];

    if(issueDoi) dois.push(issueDoi)
    if(articleDoi || duplicateFrom) dois.push(pubDoi)

    this.props.asyncGetPublications( dois, (publications) => {
      this.setState({
        issuePublication: publications[0]
      })

      var publMeta = publications[1] ? publications[1].message.content : undefined
      var article = publications[0]
      if (issueDoi) {
        publMeta = publications[2] ? publications[2].message.content : undefined
        //doing logic here so we don't have to change the addArticles page any further
        var unwrappedPub = publications[1]

        unwrappedPub.message.contains = [publications[0].message.contains[0].contains[0]]

        article = unwrappedPub
      }

      this.setState({
        mode: (articleDoi || duplicateFrom) ? 'edit' : 'add',
        publication: article,
        publicationMetaData: publMeta ? xmldoc(publMeta) : {}
      })

    })

  }

  componentWillUnmount () {
    this.props.reduxClearForm();
  }

  render () {
    const { publication, mode, publicationMetaData } = this.state
    const { pubDoi, doi, issueDoi } = this.props.routeParams
    const ownerPrefix = this.props.publication ? this.props.publication.message['owner-prefix'] : pubDoi.split('/')[0];
    return (
      <div className='addArticles'>
        <AddArticleCard
          reduxControlModal = {this.props.reduxControlModal}
          reduxEditForm={this.props.reduxEditForm}
          reduxCartUpdate={this.props.reduxCartUpdate}
          asyncSubmitArticle={this.props.asyncSubmitArticle}
          asyncGetItem={this.props.asyncGetItem}
          reduxForm={this.props.reduxForm}
          ownerPrefix={ownerPrefix}
          publication = { publication }
          publicationMetaData = { publicationMetaData }
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

