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
    ownerPrefix: is.string.isRequired,
    selections: is.array.isRequired,
    publication: is.object,

    handleRemoveFromList: is.func.isRequired,
    handleAddToList: is.func.isRequired,

    reduxControlModal: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,

    asyncGetItem: is.func.isRequired,
    asyncSubmitIssue: is.func.isRequired,
    asyncGetPublications: is.func.isRequired,
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
                publicationDoi={publicationDoi}
                triggerModal={this.props.triggerModal}

                selections={this.props.selections}
                publication={publication}
                publicationMessage={publicationMessage}

                handleRemoveFromList={this.props.handleRemoveFromList}
                handleAddToList={this.props.handleAddToList}

                reduxControlModal={this.props.reduxControlModal}
                reduxCartUpdate={this.props.reduxCartUpdate}

                asyncGetItem={this.props.asyncGetItem}
                asyncSubmitIssue={this.props.asyncSubmitIssue}
                asyncGetPublications={this.props.asyncGetPublications}

              />,
              <ArticlesContainer
                key={`${i}-articles`}
                filterBy={this.props.filterBy}
                publicationDoi={publicationDoi}

                doi={child}
                publication={publication}
                publicationMessage={publicationMessage}
                selections={this.props.selections}

                handleRemoveFromList={this.props.handleRemoveFromList}
                handleAddToList={this.props.handleAddToList}

                reduxCartUpdate={this.props.reduxCartUpdate}

                asyncGetItem={this.props.asyncGetItem}
              />
            ]
          case 'article':
            return <Article
              key={i}
              publicationDoi={publicationDoi}

              doi={child}
              selections={this.props.selections}

              publication={publication}
              publicationMessage={publicationMessage}

              handleRemoveFromList={this.props.handleRemoveFromList}
              handleAddToList={this.props.handleAddToList}

              asyncGetItem={this.props.asyncGetItem}
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
