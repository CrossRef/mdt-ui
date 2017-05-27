import React, { Component } from 'react'
import { stateTrackerII } from 'my_decorators'

import { PublicationHistory, PeerReview, ClinicalTrials, Copyright, Other, StatusUpdate, SupplementaryMaterial, Blank } from './crossmarkCards'


const crossmarkCardSelector = {
  'Publication History': PublicationHistory,
  'Peer Review': PeerReview,
  'Copyright & Licensing': Copyright,
  'Supplementary Material': SupplementaryMaterial,
  'Other': Other,
  'Linked Clinical Trials': ClinicalTrials,
  'Status Update': StatusUpdate
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



export const CrossmarkCards = ({ makeDateDropDown, removeCrossmarkCard, crossmarkCards, errors }) => {
  const crossmarkCardKeys = Object.keys(crossmarkCards);
  return (
    <div>
      {!crossmarkCardKeys.length && <Blank/>}
      {crossmarkCardKeys.map((cardName, index) => {
        const Card = crossmarkCardSelector[cardName];
        return crossmarkCards[cardName] ? <Card key={`${cardName}-${index}`} number={crossmarkCards[cardName] - 1} remove={()=>removeCrossmarkCard(cardName)} errors={errors}/> : null
      })}
    </div>
  )
}
