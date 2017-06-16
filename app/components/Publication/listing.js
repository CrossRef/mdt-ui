import React, { Component } from 'react'
import _ from 'lodash'
import is from 'prop-types'
import { stateTrackerII } from 'my_decorators'

import Issue from './issue'
import Article from './article'
import ArticlesContainer from './articlesContainer'


export default class Listing extends Component {
  static propTypes = {
    filterBy: is.string.isRequired,
    reduxControlModal: is.func.isRequired,
    handleRemoveFromList: is.func.isRequired,
    handleAddToList: is.func.isRequired,
    fetchIssue: is.func.isRequired,
    postIssue: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    ownerPrefix: is.string.isRequired,
    selections: is.array.isRequired,
    publication: is.object
  }

  render () {
    const publicationDoi = this.props.publicationMessage.doi
    const publicationMessage = this.props.publicationMessage
    const publication = this.props.publication
    const contains = this.props.publicationMessage.contains || []
    var itemlist = _.flatten(contains.map((child, i) => {
      if (child) {
        switch (child.type.toLowerCase()) {
          case 'issue':
            return [
              <Issue doi={child} key={i}
                ownerPrefix={this.props.ownerPrefix}
                reduxControlModal={this.props.reduxControlModal}
                publication={publication}
                publicationDoi={publicationDoi}
                publicationMessage={publicationMessage}
                reduxCartUpdate={this.props.reduxCartUpdate}
                handleRemoveFromList={this.props.handleRemoveFromList}
                handleAddToList={this.props.handleAddToList}
                fetchIssue={this.props.fetchIssue}
                triggerModal={this.props.triggerModal}
                postIssue={this.props.postIssue}
                handle={this.props.handle}
                selections={this.props.selections}
              />,
              <ArticlesContainer
                filterBy={this.props.filterBy}
                doi={child}
                fetchIssue={this.props.fetchIssue}
                publication={publication}
                publicationDoi={publicationDoi}
                publicationMessage={publicationMessage}
                key={`${i}-articles`}
                reduxCartUpdate={this.props.reduxCartUpdate}
                handleRemoveFromList={this.props.handleRemoveFromList}
                handleAddToList={this.props.handleAddToList}
                handle={this.props.handle}
                selections={this.props.selections}
              />
            ]
          case 'article':
            return <Article
              doi={child}
              key={i}
              fetchIssue={this.props.fetchIssue}
              publication={publication}
              publicationDoi={publicationDoi}
              publicationMessage={publicationMessage}
              handleRemoveFromList={this.props.handleRemoveFromList}
              handleAddToList={this.props.handleAddToList}
              handle={this.props.handle}
              selections={this.props.selections}
            />
        }
      }
    }))

    if (this.props.filterBy !== 'all') {
      itemlist = _.filter(itemlist, (item) => {
        return item.props.doi.status.toLowerCase() === this.props.filterBy
      })
    }

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
              itemlist
          }
        </tbody>
      </table>
    )
  }
}
