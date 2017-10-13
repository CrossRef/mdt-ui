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
    var reviewblocks = []
    var retReviewBlocks = []
    for(var i = 0; i < fullCart.length; i++) { //publication layer
      for(var j = 0; j < fullCart[i].contains.length; j++) { //article + issue/volume layer
        var item = fullCart[i].contains[j]
        reviewblocks.push(
          item
        )
        if (fullCart[i].contains[j].contains) {
          for(var k = 0; k < fullCart[i].contains[j].contains.length; k++) { //article + issue/volume layer
            var subitem = fullCart[i].contains[j].contains[k]
            subitem.issueDoi = fullCart[i].contains[j].doi
            if (subitem.type === 'article') {
              if (item.type === 'issue') {
                subitem = _.extend(subitem, {
                  parentIssue: item
                })
              }
            }
            reviewblocks.push(
              subitem
            )
          }
        }
      }

      for(var l = 0; l < reviewblocks.length; l++){
        var issue = reviewblocks[l].issueDoi ? reviewblocks[l].issueDoi : undefined
        var parentIssue = reviewblocks[l].parentIssue ? reviewblocks[l].parentIssue : undefined
        retReviewBlocks.push(
          <DepositCartItemsReview
            key={l}
            index={l}
            item={reviewblocks[l]}
            issue={issue}
            parentIssue={parentIssue}
            publication={fullCart[i]}
            reduxControlModal={this.props.reduxControlModal}
          />
        )
      }
    }

    return (
      <div className='ReviewDepositCartCard'>
        {retReviewBlocks}
      </div>
    )
  }
}
