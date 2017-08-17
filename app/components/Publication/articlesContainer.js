import React, { Component } from 'react'
import is from 'prop-types'
import { stateTrackerII } from 'my_decorators'

import Article from './article'


export default class ArticleContainer extends Component {
  static propTypes = {
    filterBy: is.string.isRequired,

    record: is.object.isRequired,
    selections: is.array.isRequired,

    handleRemoveFromList: is.func.isRequired,
    handleAddToList: is.func.isRequired,

    asyncGetItem: is.func.isRequired,
  }

  render () {
    const articles = this.props.record.contains
    const  issueDoi = this.props.record.doi
    const padding = articles.length ? {padding:"48px 0",height: "32px"} : {padding: "0px 0", height: "0px"}

    return (<tr>
      <td colSpan={6} className='issue-articles' style={padding}>
        <table >
          <tbody>
            {
              articles.map((article, i) => <Article
                key={i}
                record={article}
                issue = { issueDoi }
                selections={this.props.selections}
                publication={this.props.publication}

                handleAddCart={this.props.handleAddCart}
                handleRemoveFromList={this.props.handleRemoveFromList}
                handleAddToList={this.props.handleAddToList}

                asyncGetItem={this.props.asyncGetItem}
              />)
            }
          </tbody>
        </table>
      </td>
    </tr>)
  }
}
