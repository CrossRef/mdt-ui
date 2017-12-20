import React from 'react'
import is from 'prop-types'

import {recordTitle} from '../../utilities/helpers'




export default class MoveSelectionModal extends React.Component {
  static propTypes = {
    confirm: is.func.isRequired,
    issues: is.array.isRequired,
    close: is.func.isRequired
  }

  state = {targetIssue: null}

  render() {
    return (
      <div className="moveModal">
        <div className="issuesContainer">

          {this.props.issues.map((issue)=>{
            const name = recordTitle('issue', issue.title)
            const issueId = issue.doi || JSON.stringify(issue.title)
            return (
              <div
                key={issueId}
                className={`issueBox ${this.state.targetIssue === issueId ? 'selectedIssue' : ''}`}
                onClick={()=>{this.setState({targetIssue: issueId})}}>
                {name}
              </div>
            )
          })}

        </div>
        <div className="buttonContainer">
          <button className="leftButton" onClick={this.props.close}>Cancel</button>
          {this.state.targetIssue ?
            <button className="rightButton" onClick={() => this.props.confirm(this.state.targetIssue)}>Move</button>
            : <button className="rightButton inactive">Move</button>
          }
        </div>
      </div>
    )
  }
}