import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import client from '../../../client'
import fetch from '../../../utilities/fetch'

import Publication from '../../../components/Publication'
import { stateTrackerII } from 'my_decorators'



function mapStateToProps (state, props) {
  console.log(props.routeParams);
  return {
    publication: state.publications[props.routeParams.doi]
  }
}

function mapDispatchToProps (dispatch) {
  return {

  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PublicationPage extends Component {

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

  render () {
    const doi = this.props.routeParams.doi;
    return (
      <div>
        {this.props.publication ?
          <Publication doi={this.props.publication} handle={this.fetchDOI} />
          : <div>
              <br/><br/><br/> {/*TEMPORARY STYLING, SHOULD USE CSS*/}
              <div>Sorry, this DOI ({doi}) is not retrieving a publication</div>
          </div>}
      </div>
    )
  }
}
