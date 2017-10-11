import React, { Component } from 'react'
import is from 'prop-types'

import Article from './article'


export default class ArticleContainer extends Component {
  static propTypes = {
    filterBy: is.string.isRequired,

    record: is.object.isRequired,
    selections: is.array.isRequired,

    handleRemoveFromList: is.func.isRequired,
    handleAddToList: is.func.isRequired,
  }

  render () {
    let articles = this.props.record.contains
    const  issueDoi = this.props.record.doi
    const issueTitle = this.props.record.title
    const padding = articles.length ? {padding:"48px 0",height: "32px"} : {padding: "0px 0", height: "0px"}

    if(this.props.filterBy !== 'all') {
      articles = articles.filter((thisArticle)=>{
        return thisArticle.status === this.props.filterBy.toLowerCase()
      })
    }


    return (<tr>
      <td colSpan={6} className='issue-articles' style={padding}>
        <table >
          <tbody>
            {
              articles.map((article, i) => <Article
                key={article.doi}
                record={article}
                issueDoi = { issueDoi }
                issueTitle = { issueTitle }
                selections={this.props.selections}
                publication={this.props.publication}

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
