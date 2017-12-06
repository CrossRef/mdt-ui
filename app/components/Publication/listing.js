import React, { Component } from 'react'
import _ from 'lodash'
import is from 'prop-types'

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
    cart: is.array.isRequired,

    handleRemoveFromList: is.func.isRequired,
    handleAddToList: is.func.isRequired,

    reduxControlModal: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
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
        a = a.type === 'issue' ? `${a.title.volume}${a.title.issue}` : a.title.title.toLowerCase();
        b = b.type === 'issue' ? `${b.title.volume}${b.title.issue}` : b.title.title.toLowerCase();
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
    const publication = this.props.publication
    let contains = this.props.publication.message.contains || []
    contains = this.sortRecords(contains);

    var itemlist = _.flatten(contains.map((child, i) => {
      if (child) {
        switch (child.type.toLowerCase()) {
          case 'issue':
            return [
              <Issue key={JSON.stringify(child.title)}
                ownerPrefix={this.props.ownerPrefix}
                triggerModal={this.props.triggerModal}

                record={child}
                selections={this.props.selections}
                publication={publication}
                cart={this.props.cart}

                handleRemoveFromList={this.props.handleRemoveFromList}
                handleAddToList={this.props.handleAddToList}

                reduxControlModal={this.props.reduxControlModal}
                reduxCartUpdate={this.props.reduxCartUpdate}
              />,

              <ArticlesContainer key={`${JSON.stringify(child.title)}-articles`}
                filterBy={this.props.filterBy}

                record={child}
                publication={publication}
                selections={this.props.selections}

                handleRemoveFromList={this.props.handleRemoveFromList}
                handleAddToList={this.props.handleAddToList}

                reduxCartUpdate={this.props.reduxCartUpdate}
              />
            ]
          case 'article':
            return <Article key={child.doi}
              record={child}
              selections={this.props.selections}
              publication={publication}

              handleRemoveFromList={this.props.handleRemoveFromList}
              handleAddToList={this.props.handleAddToList}
            />
        }
      }
    }))

    if (this.props.filterBy !== 'all') {
      itemlist = _.filter(itemlist, (item) => {
        const match = item.props.record.status.toLowerCase() === this.props.filterBy
        if(!match && item.props.record.type === 'issue' && item.props.record.contains && item.props.record.contains.length) {
          for (let article in item.props.record.contains) {
            return item.props.record.contains[article].status === this.props.filterBy
          }
        }
        return match
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

          {itemlist}

        </tbody>
      </table>
    )
  }
}
