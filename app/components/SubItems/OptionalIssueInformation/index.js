import React, { Component } from 'react'

import { Roles } from '../../../utilities/lists/roles.js'


export default class OptionalIssueInformation extends Component {
  constructor (props) {
    super(props)
    const {index, optionalIssueInfo} = this.props
    const handlers = this.props.optionalIssueInfoHandlers()
    this.state = {
      index: index,
      handler: handlers.handler,
      remove: handlers.remove,
      optionalIssueInfo: optionalIssueInfo
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      index: nextProps.index,
      relateditem: nextProps.optionalIssueInfo
    })
  }

  toggle () {
      this.setState({
        showSubItem: !this.state.showSubItem
      })
  }

  displayRoles (ref) {
    var roles = [
      <option key='-1'></option>,
      ...Roles.map((role, i) => (<option key={i} value={role.value}>{role.name}</option>))
    ]

    return (
      <select
        ref={ref}
        className={`height32 ${this.state.optionalIssueInfo.errors.contributorRole && 'fieldError'}`}
        onChange={() => {this.state.handler(this.state.index, this)}}
        defaultValue={this.state.optionalIssueInfo.role}
        >
          {roles}
      </select>
    )
  }

  render () {
    const {firstName, lastName, suffix, affiliation, orcid, alternativeName, role, errors} = this.state.optionalIssueInfo
    const hasData = !!(firstName || lastName || suffix || affiliation || orcid || alternativeName || role)
    return (
        <div className='optionalissueiinfo'>
            <div className='innerCardHolder'>
                <div className='row subItemRow' onClick={this.toggle.bind(this)}>
                    <div className='subItemHeader subItemTitle'>
                        <span>Author {this.state.index + 1}</span>
                    </div>
                    {this.state.index > 0 &&
                        <div className='subItemHeader subItemButton'>
                            <a onClick={() => {this.state.remove(this.state.index)}}>Remove</a>
                        </div>
                    }
                </div>
                <div>
                    <div className='row'>
                        <div className='fieldHolder'>
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>First Name</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className='requiredholder norequire'>
                                        <div className='required height32'>
                                        </div>
                                    </div>
                                    <div className='field'>
                                        <input
                                            className='height32'
                                            type='text'
                                            ref='firstName'
                                            onChange={() => {this.state.handler(this.state.index, this)}}
                                            defaultValue={this.state.optionalIssueInfo.firstName}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>Last Name</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className={`requiredholder ${!firstName && 'norequire'}`}>
                                        <div className='required height32'>{firstName && <span>*</span>}</div>
                                    </div>
                                    <div className='field'>
                                        <input
                                            className={`height32 ${errors.contributorLastName && 'fieldError'}`}
                                            type='text'
                                            ref='lastName'
                                            onChange={() => {this.state.handler(this.state.index, this)}}
                                            defaultValue={this.state.optionalIssueInfo.lastName}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='errorHolder'>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='fieldHolder'>
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>Suffix</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className='requiredholder norequire'>
                                        <div className='required height32'>
                                        </div>
                                    </div>
                                    <div className='field'>
                                        <input
                                            className='height32'
                                            type='text'
                                            ref='suffix'
                                            onChange={() => {this.state.handler(this.state.index, this)}}
                                            defaultValue={this.state.optionalIssueInfo.suffix}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>Affiliation</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className='requiredholder norequire'>
                                        <div className='required height32'>
                                        </div>
                                    </div>
                                    <div className='field'>
                                        <input
                                            className='height32'
                                            type='text'
                                            ref='affiliation'
                                            onChange={() => {this.state.handler(this.state.index, this)}}
                                            defaultValue={this.state.optionalIssueInfo.affiliation}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='errorHolder'>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='fieldHolder'>
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>ORCID</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className='requiredholder norequire'>
                                        <div className='required height32'>
                                        </div>
                                    </div>
                                    <div className='field'>
                                        <input
                                            className='height32'
                                            type='text'
                                            ref='orcid'
                                            onChange={() => {this.state.handler(this.state.index, this)}}
                                            defaultValue={this.state.optionalIssueInfo.orcid}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>Alternative Name</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className='requiredholder norequire'>
                                        <div className='required height32'>
                                        </div>
                                    </div>
                                    <div className='field'>
                                        <input
                                            className='height32'
                                            type='text'
                                            ref='alternativeName'
                                            onChange={() => {this.state.handler(this.state.index, this)}}
                                            defaultValue={this.state.optionalIssueInfo.alternativeName}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='errorHolder'>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='fieldHolder'>
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>Role</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className={`requiredholder ${!hasData && 'norequire'}`}>
                                        <div className='required height32'>{hasData && <span>*</span>}</div>
                                    </div>
                                    <div className='field'>
                                        {this.displayRoles('role')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='errorHolder'>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }
}
