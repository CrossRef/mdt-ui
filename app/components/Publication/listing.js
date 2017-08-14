import React, { Component } from 'react'
import _ from 'lodash'
import is from 'prop-types'
import { stateTrackerII } from 'my_decorators'

import { routes } from '../../routing'
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

  state = {
    sort: {by: 'date', asc: false }
  }

  sortRecords = (records) => {
    const { by, asc } = this.state.sort;
    const compare = (a, b) => {
      if(!asc) [a, b] = [b, a]
      if(a < b) return -1;
      if(a > b) return 1;
      return 0;
    }
    const sortSelector = {
      'title': ()=> records.sort(function(a,b) {
        a = (a.title.title || a.title.volume || a.title.issue);
        b = (b.title.title || b.title.volume || b.title.issue);
        if(typeof a === 'string') a = a.toLowerCase();
        if(typeof b === 'string') b = b.toLowerCase();
        return compare(a,b)
      }),
      'date': ()=> records.sort(function(a,b) {
        return compare(a.date, b.date)
      }),
      'type': ()=> records.sort(function(a,b) {
        return compare(a.type, b.type)
      }),
      'status': ()=> records.sort(function(a,b) {
        return compare(a.status, b.status)
      })
    };
    return sortSelector[by]()
  }

  sortHandler = (e) => {
    this.setState({
      sort: {
        by: e.target.name,
        asc: e.target.name === this.state.sort.by ? !this.state.sort.asc : false
      }
    })
  }

  render () {
    const publicationDoi = this.props.publicationMessage.doi
    const publicationMessage = this.props.publicationMessage
    const publication = this.props.publication
    let contains = this.props.publicationMessage.contains || []

    contains = this.sortRecords(contains);

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

    const {by, asc} = this.state.sort;

    return (
      <table className='publication-children-listing'>
        <thead>
          <tr>
            <td className='checkbox' />
            <td className='title'>
              <a name='title' className={`cursor ${by === 'title' && 'sorted'}`} onClick={this.sortHandler}>Title</a>
              <img name='title'
                onClick={this.sortHandler}
                className={`orderBy ${(by==='title' && asc) && 'ordered'}`}
                src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </td>
            <td className='date'>
              <a name='date' className={`cursor ${by === 'date' && 'sorted'}`} onClick={this.sortHandler}>Date</a>
              <img name='date'
                   onClick={this.sortHandler}
                   className={`orderBy ${(by==='date' && asc) && 'ordered'}`}
                   src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </td>
            <td className='type'>
              <a name='type' className={`cursor ${by === 'type' && 'sorted'}`} onClick={this.sortHandler}>Type</a>
              <img name='type'
                   onClick={this.sortHandler}
                   className={`orderBy ${(by==='type' && asc) && 'ordered'}`}
                   src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </td>
            <td className='status'>
              <a name='status' className={`cursor ${by === 'status' && 'sorted'}`} onClick={this.sortHandler}>Status</a>
              <img name='status'
                   onClick={this.sortHandler}
                   className={`orderBy ${(by==='status' && asc) && 'ordered'}`}
                   src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </td>
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
