import React, { Component } from 'react'
import Article from '../../Article'
import { stateTrackerII } from 'my_decorators'


export default class ArticleContainer extends Component {
  render () {
    const articles = this.props.doi.contains

    return (<tr>
      <td colSpan={6} className='issue-articles'>
        <table>
          <thead><tr><td /><td /><td /><td /><td /><td /></tr></thead>
          <tbody>
            { articles.map((article, i) => <Article doi={article} key={i} />) }
          </tbody>
        </table>
      </td>
    </tr>)
  }
}
