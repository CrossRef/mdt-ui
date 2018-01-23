import React, { Component } from 'react'
import is from 'prop-types'
import _ from 'lodash'

import DepositCartItemsReview from './reviewDepositCartItems'



export default class DepositCartReview extends Component {

  static propTypes = {
    fullCart: is.array.isRequired,
    reduxControlModal: is.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      showInfoSection: true
    }
  }


  render () {
    const { fullCart } = this.props

    let publication
    let parentIssue
    const reducer = (accumulator, item) => {
      if(item.type === 'Publication') {
        publication = item
        parentIssue = undefined
      } else {
        if(item.type === 'issue') {
          parentIssue = item
        }

        accumulator.push(
          <DepositCartItemsReview
            key={accumulator.length}
            index={accumulator.length}
            item={item}
            parentIssue={item.type === 'article' ? parentIssue : undefined}
            publication={publication}
            reduxControlModal={this.props.reduxControlModal}
          />
        )
      }

      return item.contains.length ? item.contains.reduce(reducer, accumulator) : accumulator
    }
    const renderItems = fullCart.reduce(reducer, [])

    return (
      <div className='ReviewDepositCartCard'>
        {renderItems}
      </div>
    )
  }
}
