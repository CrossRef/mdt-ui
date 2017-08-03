import React, { Component } from 'react'
import is from 'prop-types'
import { stateTrackerII } from 'my_decorators'

import Article from './article'


export default class ArticleContainer extends Component {
  static propTypes = {
    filterBy: is.string.isRequired,
    publicationDoi: is.string.isRequired,

    doi: is.object,
    selections: is.array.isRequired,

    handleRemoveFromList: is.func.isRequired,
    handleAddToList: is.func.isRequired,

    asyncGetItem: is.func.isRequired,
  }

  render () {
    const articles = this.props.doi.contains
    const  issueDoi = this.props.doi.doi
    const  pubDoi = this.props.publication.message.doi
    const padding = articles.length ? {padding:"48px 0",height: "32px"} : {padding: "0px 0", height: "0px"}

    return (<tr>
      <td colSpan={6} className='issue-articles' style={padding}>
        <table >
          <tbody>
            {
              articles.map((article, i) => <Article
                key={i}
                publicationDoi={this.props.publicationDoi}

                doi={article}
                issue = { issueDoi }
                selections={this.props.selections}

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
