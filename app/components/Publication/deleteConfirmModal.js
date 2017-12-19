import React from 'react'
import is from 'prop-types'




export default function DeleteConfirmModal ({confirm, selections, close}) {

  const onlyIssues = selections.every( record => record.type === 'issue' )

  const usedDois = []

  const nameReducer = (accumulator, selection) => {
    const type = selection.type

    if(type === 'issue') {
      return selection.contains.reduce(nameReducer, accumulator)
    } else {
      if(usedDois.indexOf(selection.doi) > -1) {
        return accumulator
      } else {
        usedDois.push(selection.doi)
      }
    }

    const title = (selection.status === 'draft') ? selection.title.title : '';
    if(!accumulator && title) {
      return title;
    }
    if(accumulator && title) {
      return accumulator + ', ' + title;
    }
    else return accumulator
  }

  const selectionNames = selections.reduce(nameReducer, '');

  return (
    <div className="actionModal">
      <div className="messageHolder">
        {onlyIssues ?
          <div>
            <h4>Do you want to permanently remove the Issue Record from your workspace?</h4>

            <h4>This action will remove all articles in the workspace which are associated with the Issue Record. Articles in draft state, which have not been deposited, will be deleted.</h4>
          </div>

          : <h4>Do you want to remove the selected records? Record data in draft state will be deleted.</h4>}

        <p>{`- ${selectionNames ? selectionNames : 'No articles in draft state'}`}</p>
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