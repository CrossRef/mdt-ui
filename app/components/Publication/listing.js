import React, { Component } from 'react'
import _ from 'lodash'
import is from 'prop-types'
import { stateTrackerII } from 'my_decorators'

import Issue from './issue'
import Article from './article'
import ArticlesContainer from './articlesContainer'


export default class Listing extends Component {
  static propTypes = {
    handleAddCart: is.func.isRequired,
    handleRemoveFromList: is.func.isRequired,
    handleAddToList: is.func.isRequired,
    fetchIssue: is.func.isRequired,
    postIssue: is.func.isRequired,
  }

  render () {
    const publicationDoi = this.props.publicationMessage.doi
    const publicationMessage = this.props.publicationMessage
    const publication = this.props.publication
    const contains = this.props.publicationMessage.contains || []
    return (
      <table className='publication-children-listing'>
        <thead>
          <tr>
            <td className='checkbox' />
            <td className='title' />
            <td className='date'>Date</td>
            <td className='type'>Type</td>
            <td className='status'>Status</td>
            <td className='url' />
          </tr>
        </thead>
        <tbody>
          {
            _.flatten(contains.map((child, i) => {
              if (child) {
                switch (child.type.toLowerCase()) {
                  case 'issue':
                    return [
                      <Issue doi={child} key={i}
                        publication={publication}
                        publicationDoi={publicationDoi}
                        publicationMessage={publicationMessage}
                        handleAddCart={this.props.handleAddCart}
                        handleRemoveFromList={this.props.handleRemoveFromList}
                        handleAddToList={this.props.handleAddToList}
                        fetchIssue={this.props.fetchIssue}
                        triggerModal={this.props.triggerModal}
                        postIssue={this.props.postIssue}
                        handle={this.props.handle}
                      />,
                      <ArticlesContainer
                        doi={child}
                        publication={publication}
                        publicationDoi={publicationDoi}
                        publicationMessage={publicationMessage}
                        key={`${i}-articles`}
                        handleAddCart={this.props.handleAddCart}
                        handleRemoveFromList={this.props.handleRemoveFromList}
                        handleAddToList={this.props.handleAddToList}
                        handle={this.props.handle}
                      />
                    ]
                  case 'article':
                    return <Article
                      doi={child}
                      key={i}
                      publication={publication}
                      publicationDoi={publicationDoi}
                      publicationMessage={publicationMessage}
                      handleAddCart={this.props.handleAddCart}
                      handleRemoveFromList={this.props.handleRemoveFromList}
                      handleAddToList={this.props.handleAddToList}
                      handle={this.props.handle}
                    />
                }
              }
            }))
          }
        </tbody>
      </table>
    )
  }
}
