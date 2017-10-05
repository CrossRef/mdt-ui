import React, { Component } from 'react'
import update from 'immutability-helper'
import { stateTrackerII } from 'my_decorators'

import { Roles } from '../../../utilities/lists/roles.js'
import {refreshErrorBubble} from '../../../utilities/helpers'
import {routes} from '../../../routing'



export default class Contributor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showSubItem: true
    }
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.validating) {
      this.setState({showSubItem: true})
    }
  }

  componentDidUpdate () {
    refreshErrorBubble();
  }

  toggle = () => {
    this.setState({
      showSubItem: !this.state.showSubItem
    })
  }

  displayRoles (ref) {
    const {contributorRole, contributorGroupRole} = this.props.contributor.errors || {}
    var roles = [
      <option key='-1'></option>,
      ...Roles.map((role, i) => (<option key={i} value={role.value}>{role.name}</option>))
    ]

    return (
      <select
        ref={ref}
        onChange={this.handleContributor}
        className={`height32 ${ref === 'role' ? contributorRole && 'fieldError' : contributorGroupRole && 'fieldError'}`}
        value={this.props.contributor[ref]}
        >
          {roles}
      </select>
    )
  }

  handleContributor = () => {
    var contributor = {
      errors: this.props.contributor.errors
    }
    for(var i in this.refs){
      if(this.refs[i]){
        contributor[i] = this.refs[i].value
      }
    }

    this.props.handler({ // this situation, state did NOT update immediately to see change, must pass in a call back
      contributors: update(this.props.data, {[this.props.index]: {$set: contributor }})
    })
  }

  render () {
    const errors = this.props.contributor.errors || {};
    const {firstName, lastName, suffix, affiliation, orcid, groupAuthorName, groupAuthorRole} = this.props.contributor;
    const roleRequired = !!(firstName || lastName || suffix || affiliation || orcid)
    return (
        <div>
            <div className='row subItemRow' onClick={this.toggle}>
                <div className='subItemHeader subItemTitle'>
                    <span className={'arrowHolder' + (this.state.showSubItem ? ' openArrowHolder' : '')}>
                        <img src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
                    </span>
                    <span>Contributor {this.props.index + 1}</span>
                </div>
                {this.props.index > 0 &&
                    <div className='subItemHeader subItemButton'>
                        <a onClick={() => {this.props.remove(this.props.index)}}>Remove</a>
                    </div>
                }
            </div>
            {this.state.showSubItem &&
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
                                            onChange={this.handleContributor}
                                            value={firstName}
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
                                    <div className={`requiredholder ${!this.props.contributor.firstName && 'norequire'}`}>
                                        <div className='required height32'>{this.props.contributor.firstName && <span>*</span>}</div>
                                    </div>
                                    <div className='field'>
                                        <input
                                            className={`height32 ${errors.contributorLastName && 'fieldError'}`}
                                            type='text'
                                            ref='lastName'
                                            onChange={this.handleContributor}
                                            value={lastName}
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
                                            onChange={this.handleContributor}
                                            value={suffix}
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
                                            onChange={this.handleContributor}
                                            value={affiliation}
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
                                            onChange={this.handleContributor}
                                            value={orcid}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>Role</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className={`requiredholder ${!roleRequired && 'norequire'}`}>
                                        <div className='required height32'>{roleRequired && <span>*</span>}</div>
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
                    <div className='row'>
                        <hr />
                    </div>
                    <div className='row'>
                        <div className='fieldHolder'>
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>Group Author Name</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className={`requiredholder ${!groupAuthorRole && 'norequire'}`}>
                                        <div className='required height32'>{groupAuthorRole && <span>*</span>}</div>
                                    </div>
                                    <div className='field'>
                                        <input
                                            className={`height32 ${errors.contributorGroupName && 'fieldError'}`}
                                            type='text'
                                            ref='groupAuthorName'
                                            onChange={this.handleContributor}
                                            value={groupAuthorName}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>Group Author Role</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className={`requiredholder ${!groupAuthorName && 'norequire'}`}>
                                        <div className='required height32'>{groupAuthorName && <span>*</span>}</div>
                                    </div>
                                    <div className='field'>
                                        {this.displayRoles('groupAuthorRole')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='errorHolder'>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
  }
}
