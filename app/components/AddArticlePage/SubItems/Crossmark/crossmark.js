import React, { Component } from 'react'
import is from 'prop-types'

import { PublicationHistory, PeerReview, ClinicalTrials, Copyright, Other, StatusUpdate, SupplementaryMaterial } from './crossmarkCards'
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



export class Crossmark extends Component {

  static propTypes = {
    crossmarkUtility: is.object.isRequired,
    crossmarkCards: is.object.isRequired,
    validate: is.func.isRequired,
    tooltip: is.bool.isRequired,
    tooltipUtility: is.object.isRequired,
    errorMessages: is.array.isRequired,
    errorUtility: is.object.isRequired,
    activeCalendar: is.string.isRequired,
    calendarHandler: is.func.isRequired
  }

  constructor (props) {
    super ()
    this.state = {
      crossmarkCards: props.crossmarkCards,
      showList: false
    }
  }


  componentWillReceiveProps (nextProps) {
    this.setState({
      crossmarkCards: nextProps.crossmarkCards
    })
  }


  removeCrossmarkCard = (selection) => {
    this.props.crossmarkUtility.removeCrossmarkCard(selection)
  }


  addCrossmarkCard = (selection) => {
    this.props.crossmarkUtility.addCrossmarkCard(selection)
  }


  toggle = () => {
    this.setState({
      showList: !this.state.showList
    })
  }


  render() {
    const crossmarkCardArray = Object.keys(this.state.crossmarkCards)
    const addList = Object.keys(crossmarkCardSelector).filter((card)=>{
      return !this.state.crossmarkCards[card]
    })
    return (
      <div>
        {crossmarkCardArray.map((cardName, index) => {
          const Card = crossmarkCardSelector[cardName]
          return this.state.crossmarkCards[cardName] ?
            <Card key={`${cardName}-${index}`}
              crossmarkUtility={this.props.crossmarkUtility}
              validate={this.props.validate}
              number={this.state.crossmarkCards[cardName] - 1}
              tooltipUtility={this.props.tooltipUtility}
              tooltip={this.props.tooltip}
              cardName={cardName}
              errorMessages={this.props.errorMessages}
              errorUtility={this.props.errorUtility}
              activeCalendar={this.props.activeCalendar}
              calendarHandler={this.props.calendarHandler}
              remove={this.removeCrossmarkCard}/>
          : null
        })}

        {!!addList.length &&
          <div className='addholder'>
            <a className='tooltips' onClick={this.toggle}>
              Add New
              {this.state.showList &&
              <div className='crossmarkAddList'>
                {addList.map((value, index) =>
                  <a className='crossmark' onClick={()=>this.addCrossmarkCard(value)} key={index}>{value}</a>
                )}
              </div>
              }
            </a>
          </div>
        }
      </div>
    )
  }
}


