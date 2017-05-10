import React, { Component } from 'react'
import is from 'prop-types'
import _ from 'lodash'
import { stateTrackerII } from 'my_decorators'

import ModalCard from './modalCard'
const Languages = require('../utilities/language.json')
const ArchiveLocations = require('../utilities/archiveLocations.json')
const PublicationTypes = require('../utilities/publicationTypes.json')
const AppliesTo = require('../utilities/appliesTo.json')
const IdentifierTypes = require('../utilities/identifierTypes.json')
import objectSearch from '../utilities/objectSearch'
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

  parseCart () {
    const { fullCart } = this.props
    var reviewblocks = []
    var counter = 0
    for(var i = 0; i < fullCart.length; i++) { //publication layer
      for(var j = 0; j < fullCart[i].contains.length; j++) { //article + issue/volume layer
        var item = fullCart[i].contains[j]
        reviewblocks.push(
          <DepositCartItemsReview
            key={counter}
            index={counter}
            item={item}
            publication={fullCart[i]}
            reduxControlModal={this.props.reduxControlModal}
          />
        )
        counter++
      }
    }

    return reviewblocks
  }


  render () {
    return (
      <div className='ReviewDepositCartCard'>
        {this.parseCart()}
      </div>
    )
  }
}
