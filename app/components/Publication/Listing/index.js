import React, { Component } from 'react'
import Issue from '../Issue'
import Article from '../Article'
import ArticlesContainer from '../Issue/ArticlesContainer'
import _ from 'lodash'
import { stateTrackerII } from 'my_decorators'


export default class Listing extends Component {
  render () {
    const doi = this.props.doi.message || {}
    const publicationDoi = this.props.doi.message.doi
    const contains = doi.contains || []
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
                      <Issue doi={child} key={i} />,
                      <ArticlesContainer
                        doi={child}
                        publicationDoi={publicationDoi}
                        key={`${i}-articles`}
                      />
                    ]
                  case 'article':
                    return <Article doi={child} key={i} publicationDoi={publicationDoi} />
                }
              }
            }))
          }
        </tbody>
      </table>
    )
  }
}
