import React, { Component } from 'react'
import { stateTrackerII } from 'my_decorators'

import { PublicationHistory, PeerReview, ClinicalTrials, Copyright, Other, StatusUpdate, SupplementaryMaterial, Blank } from './crossmarkCards'
import {cardNames} from '../../../utilities/crossmarkHelpers'
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

export const CrossmarkAddButton = ({showSection, toggle, addList, toggleAdd, addCrossmarkCard}) =>
  <div className='addholder'>
    <a className='tooltips' onClick={()=>{
      if (!showSection) {
        toggle()
      }
      toggleAdd()
    }}>Add New
      {addList &&
        <div className='crossmarkAddList'>
          {Object.keys(crossmarkCardSelector).map((value, index) =>
            <a className='crossmark' onClick={()=>{addCrossmarkCard(value)}} key={index}>{value}</a>
          )}
        </div>}
    </a>
  </div>



export const CrossmarkCards = ({ makeDateDropDown, removeCrossmarkCard, crossmarkCards }) => {
  const crossmarkCardKeys = Object.keys(crossmarkCards);
  return (
    <div>
      {!crossmarkCardKeys.length && <Blank/>}
      {crossmarkCardKeys.map((cardName, index) => {
        const Card = crossmarkCardSelector[cardName];
        return crossmarkCards[cardName] ? <Card key={`${cardName}-${index}`} number={crossmarkCards[cardName] - 1} remove={()=>removeCrossmarkCard(cardName)} /> : null
      })}
    </div>
  )
}
