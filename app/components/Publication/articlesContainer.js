import React, { Component } from 'react'
import is from 'prop-types'
import { stateTrackerII } from 'my_decorators'

import Article from './article'


export default class ArticleContainer extends Component {
  static propTypes = {
    handleAddCart: is.func.isRequired,
    handleRemoveFromList: is.func.isRequired,
    handleAddToList: is.func.isRequired
  }

  render () {
    const articles = this.props.doi.contains

    return (<tr>
      <td colSpan={6} className='issue-articles'>
        <table>
          <thead><tr><td /><td /><td /><td /><td /><td /></tr></thead>
          <tbody>
            {
              articles.map((article, i) => <Article
                doi={article}
                key={i}
                handleAddCart={this.props.handleAddCart}
                handleRemoveFromList={this.props.handleRemoveFromList}
                handleAddToList={this.props.handleAddToList}
              />)
            }
          </tbody>
        </table>
      </td>
    </tr>)
  }
}
