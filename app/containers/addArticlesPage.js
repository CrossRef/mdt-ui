import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, browserHistory } from 'react-router'
import { stateTrackerII } from 'my_decorators'

import client from '../client'
import { controlModal, getPublications, testReduxRelay, editForm, submitArticle, cartUpdate } from '../actions/application'
import xmldoc from '../utilities/xmldoc'
import AddArticleCard from '../components/addArticleCard'



const mapStateToProps = (state, props) => {
  return ({
    publication: state.publications[props.routeParams.doi],
    crossmarkAuth: state.crossmarkAuth,
    reduxForm: state.reduxForm
  })
}

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxControlModal: controlModal,
  reduxEditForm: editForm,
  asyncGetPublications: getPublications,
  asyncSubmitArticle: submitArticle,
  reduxCartUpdate: cartUpdate,
  testReduxRelay: testReduxRelay
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class AddArticlesPage extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    reduxEditForm: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    asyncGetPublications: is.func.isRequired,
    asyncSubmitArticle: is.func.isRequired,
    crossmarkAuth: is.bool.isRequired,
    routeParams: is.shape({
      pubDoi: is.string.isRequired,
      articleDoi: is.string
    }).isRequired,
    reduxForm: is.object.isRequired,
    publication: is.object,
  }

  constructor (props) {
    super(props)
    this.state = {
      publication: {},
      publicationMetaData: {},
      mode: 'add'
    }
  }

  componentDidMount () {
    const { pubDoi, articleDoi } = this.props.routeParams;
    const dois = [articleDoi || pubDoi];
    if(articleDoi) dois.push(pubDoi);
    this.props.asyncGetPublications( dois, (publications) => {
      this.setState({
        mode: articleDoi ? 'edit' : 'add',
        publication: publications[0],
        publicationMetaData: publications[1] ? xmldoc(publications[1].message.content) : {}
      })
    })
  }

  render () {

    const { publication, mode, publicationMetaData } = this.state
    const { doi } = this.props.routeParams
    return (
      <div className='addArticles'>
        <AddArticleCard
          reduxControlModal = {this.props.reduxControlModal}
          reduxEditForm={this.props.reduxEditForm}
          cartUpdate={this.props.reduxCartUpdate}
          asyncSubmitArticle={this.props.asyncSubmitArticle}
          crossmarkAuth={this.props.crossmarkAuth}
          reduxForm={this.props.reduxForm}
          publication = { publication }
          publicationMetaData = { publicationMetaData }
          mode = { mode }
          testReduxRelay={this.props.testReduxRelay}
        />
      </div>
    )
  }
}

