import React from 'react'
import is from 'prop-types'

import {recordTitle} from '../../utilities/helpers'




export default function DeleteConfirmModal ({confirm, selections, close}) {

  const nameReducer = (accumulator, selection) => {
    const type = selection.type

    if(type === 'issue') {
      accumulator.add(`- ${recordTitle('issue', selection.title)}`)
      return selection.contains.reduce(nameReducer, accumulator)
    }

    return (selection.status !== 'accepted') ? accumulator.add(`- ${selection.title.title}`)
      : accumulator
  }

  const selectionNames = selections.reduce(nameReducer, new Set)

  return (
    <div className="actionModal">
      <div className="messageHolder">
        <div>
          <h4>Do you want to remove the selected records? Record data in draft state will be permanently deleted.</h4>

          <h4>If an issue is selected, this action will also remove and delete any articles associated with it in draft state.</h4>
        </div>

        {selectionNames.size ? [...selectionNames].map(title => <p>{title}</p>) : '- No articles in draft state'}
      </div>
      <div className="buttonTable">
        <div className="tableRow">
          <div className="leftCell"></div>
          <div className="rightCell">
            <button className="rightButton" onClick={confirm}>Remove</button>
            <button className="leftButton" onClick={close}>Cancel</button>
          </div>
        </div>

      </div>
    </div>
  )
}