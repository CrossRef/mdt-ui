import React, { Component } from 'react'
import is from 'prop-types'
import { stateTrackerII } from 'my_decorators'

import Article from './article'


export default class ArticleContainer extends Component {
  static propTypes = {
    handleRemoveFromList: is.func.isRequired,
    handleAddToList: is.func.isRequired,
    filterBy: is.string.isRequired,
    selections: is.array.isRequired,
    publicationDoi: is.string.isRequired,
    doi: is.object
  }

  render () {
    const articles = this.props.doi.contains
    const  issueDoi = this.props.doi.doi
    const  pubDoi = this.props.publication.message.doi
    return (<tr>
      <td colSpan={6} className='issue-articles'>
        <table>
          <thead><tr><td /><td /><td /><td /><td /><td /></tr></thead>
          <tbody>
            {
              articles.map((article, i) => <Article
                doi={article}
                key={i}
                fetchIssue={this.props.fetchIssue}
                handleAddCart={this.props.handleAddCart}
                handleRemoveFromList={this.props.handleRemoveFromList}
                handleAddToList={this.props.handleAddToList}
                issue = { issueDoi }
                publicationDoi={this.props.publicationDoi}
                selections={this.props.selections}
              />)
            }
          </tbody>
        </table>
      </td>
    </tr>)
  }
}
