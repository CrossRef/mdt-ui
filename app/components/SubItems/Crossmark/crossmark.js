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



export const Crossmark = ({ makeDateDropDown, removeCrossmarkCard, crossmarkCards }) => {
  const crossmarkCardKeys = Object.keys(crossmarkCards);
  return (
    <div>
      {!crossmarkCardKeys.length && <Blank/>}
      {crossmarkCardKeys.map((value, index) => {
        const Card = crossmarkCardSelector[value];
        return crossmarkCards[value] ? <Card key={`${value}-${index}`} remove={()=>removeCrossmarkCard(value)}/> : null
      })}
    </div>
  )
}
