import React, { Component } from 'react'
import is from 'prop-types'

import { PublicationHistory, PeerReview, ClinicalTrials, Copyright, Other, StatusUpdate, SupplementaryMaterial, Blank } from './crossmarkCards'
import {cardNames} from '../../../../utilities/crossmarkHelpers'
const {pubHist, peer, copyright, supp, other, clinical, update} = cardNames;

const crossmarkCardSelector = {
  [pubHist]: PublicationHistory,
  [peer]: PeerReview,
  [copyright]: Copyright,
  [supp]: SupplementaryMaterial,
  [other]: Other,
  [clinical]: ClinicalTrials,
  [update]: StatusUpdate
}



let addCrossmarkCard
let openCards = {}

export class CrossmarkAddButton extends Component {

  static propTypes = {
    showSection: is.bool.isRequired,
    toggleSubItem: is.func.isRequired
  }

  constructor () {
    super()
    openCards = {}
    this.state = {showList: false}
  }

  toggle = () => {
    if(!this.props.showSection) {
      this.props.toggleSubItem()
    }
    this.setState({showList: !this.state.showList})
  }

  addCrossmarkCard = (selection) => {
    addCrossmarkCard(selection)
    openCards[selection] = true
  }

  render () {
    return (
      <div className='addholder'>
        <a className='tooltips' onClick={this.toggle}>
          Add New
          {this.state.showList &&
            <div className='crossmarkAddList'>
              {Object.keys(crossmarkCardSelector).map((value, index) =>
                <a className='crossmark' onClick={()=>this.addCrossmarkCard(value)} key={index}>{value}</a>
              )}
            </div>
          }
        </a>
      </div>
    )
  }
}



export class CrossmarkCards extends Component {

  static propTypes = {
    showCards: is.object.isRequired,
    reduxDeleteCard: is.func.isRequired
  }

  constructor (props) {
    super ()
    addCrossmarkCard = (selection) => this.setState({ crossmarkCards: {...this.state.crossmarkCards, [selection]: true } })
    const loadedCrossmark = props.showCards.firstLoad
    delete props.showCards.firstLoad
    this.state = {
      crossmarkCards: loadedCrossmark ? props.showCards : openCards
    }
    if(loadedCrossmark) {
      openCards = props.showCards
    }
  }


  removeCrossmarkCard = (selection) => {
    const newState = {...this.state.crossmarkCards}
    delete newState[selection]
    this.props.reduxDeleteCard([selection]);
    openCards = newState
    this.setState({ crossmarkCards: newState })
  }


  render() {
    const crossmarkCardKeys = Object.keys(this.state.crossmarkCards)
    return (
      <div>
        {!crossmarkCardKeys.length && <Blank/>}
        {crossmarkCardKeys.map((cardName, index) => {
          const Card = crossmarkCardSelector[cardName]
          return this.state.crossmarkCards[cardName] ?
            <Card key={`${cardName}-${index}`}
              number={this.state.crossmarkCards[cardName] - 1}
              remove={() => this.removeCrossmarkCard(cardName)}/>
          : null
        })}
      </div>
    )
  }
}


