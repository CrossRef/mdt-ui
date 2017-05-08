import React, { Component } from 'react'
import { connect } from 'react-redux'
import AddArticleCard from '../../../components/AddArticle'
import { bindActionCreators } from 'redux'
import { Link, browserHistory } from 'react-router'
import client from '../../../client'
import { addDOIs } from '../../../actions/application'
import xmldoc from '../../../utilities/xmldoc'
import { stateTrackerII } from 'my_decorators'

export class AddArticlesPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      publication: {},
      publicationMetaData: {},
      mode: 'add'
    }
  }

  async componentWillReceiveProps (nextProps) {
    const { doi, pubdoi } = nextProps.routeParams
    if (pubdoi && doi) {
      this.fetchDOI(pubdoi, 'publication')
      this.setState({
        mode: 'edit'
      })
    }
    this.fetchDOI(doi)
  }

  componentDidMount () {
    const { doi, pubdoi } = this.props.routeParams
    if (pubdoi && doi) {
      this.setState({
        mode: 'edit'
      })
    }
    this.fetchDOI(doi)
  }

  componentWillUnmount () {
    this.ignoreLastCall = true
  }

  fetchDOI (doi, type) {
    fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${doi}`, { headers: client.headers })
    .then(publication => publication.json())
    .then((publication) => { // when we retrieve and article, it retrieves the entire publication + article, no need to refetch again for pub info
      if(type !== 'publication') {
        this.setState({
          publication
        })
      } else {
        const parsedPublication = xmldoc(publication.message.content)
        this.setState({
          publicationMetaData: parsedPublication
        })
      }
    })
    .catch((reason) => {
      console.error('ERROR: In AddArticle Container ', reason)
    })
  }

  render () {

    const { publication, mode, publicationMetaData } = this.state
    const { doi } = this.props.routeParams
    return (
      <div className='addArticles'>
        <AddArticleCard
          publication = { publication }
          publicationMetaData = { publicationMetaData }
          mode = { mode }
        />
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(`There are ${state.application.DOIs.length} DOIs`)
  return {
    DOIs: state.application.DOIs
  }
}

function mapDispatchToProps (dispatch) {
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddArticlesPage)
