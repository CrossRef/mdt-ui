import React, { Component } from 'react'
import update from 'immutability-helper'

import { Roles } from '../../utilities/lists/roles.js'
import FormInput from '../Common/formInput'
import FormSelect from '../Common/formSelect'
import ErrorIndicator from '../Common/errorIndicator'
import {issueTooltips as tooltips} from '../../utilities/lists/tooltipMessages'



export default class OptionalIssueInformation extends Component {

  handler = (e) => {
    var contributor = {
      ...this.props.optionalIssueInfo,
      [e.target.name]: e.target.value
    }

    this.props.handler({
      optionalIssueInfo: update(this.props.data, {[this.props.index]: {$set: contributor }})
    })
  }


  render () {
    const {firstName, lastName, suffix, affiliation, orcid, alternativeName, role, errors} = this.props.optionalIssueInfo
    const hasData = !!(firstName || lastName || suffix || affiliation || orcid || alternativeName || role)

    return (
      <div className='optionalissueiinfo'>
        <div className='innerCardHolder'>
          <div className='row subItemRow'>
            <div className='subItemHeader subItemTitle'>
              <span>Author {this.props.index + 1}</span>
            </div>
            {this.props.index > 0 &&
                <div className='subItemHeader subItemButton'>
                    <a onClick={()=>this.props.remove(this.props.index)}>Remove</a>
                </div>
            }

          </div>
          <div>
            <div className='row'>
              <div className='fieldHolder'>
                <FormInput
                  label="First Name"
                  name="firstName"
                  value={this.props.optionalIssueInfo.firstName}
                  tooltip={this.props.tooltip && tooltips.contributorFirstName}
                  deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  onBlur={this.props.validate}
                  changeHandler={this.handler}/>

                <FormInput
                  label="Last Name"
                  name="lastName"
                  value={this.props.optionalIssueInfo.lastName}
                  error={errors.contributorLastName}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  trackErrors={['contributorLastName']}
                  required={firstName}
                  tooltip={this.props.tooltip && tooltips.contributorLastName}
                  deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                  onBlur={this.props.validate}
                  changeHandler={this.handler}/>
              </div>

              <ErrorIndicator
                style="shiftLeft"
                trackErrors={['contributorLastName']}
                errorMessages={this.props.errorMessages}
                errorUtility={this.props.errorUtility}
                allErrors={errors}/>
            </div>


            <div className='row'>
              <div className='fieldHolder'>
                <FormInput
                  label="Suffix"
                  name="suffix"
                  value={this.props.optionalIssueInfo.suffix}
                  tooltip={this.props.tooltip && tooltips.contributorSuffix}
                  deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  onBlur={this.props.validate}
                  changeHandler={this.handler}/>

                <FormInput
                  label="Affiliation"
                  name="affiliation"
                  value={this.props.optionalIssueInfo.affiliation}
                  tooltip={this.props.tooltip && tooltips.contritbutorAffiliation}
                  deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  onBlur={this.props.validate}
                  changeHandler={this.handler}/>
              </div>
            </div>


            <div className='row'>
              <div className='fieldHolder'>
                <FormInput
                  label="ORCID"
                  name="orcid"
                  value={this.props.optionalIssueInfo.orcid}
                  tooltip={this.props.tooltip && tooltips.contributorOrcid}
                  deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  onBlur={this.props.validate}
                  changeHandler={this.handler}/>

                <FormInput
                  label="Alternative Name"
                  name="alternativeName"
                  value={this.props.optionalIssueInfo.alternativeName}
                  tooltip={this.props.tooltip && tooltips.contributerAlternativeName}
                  deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  onBlur={this.props.validate}
                  changeHandler={this.handler}/>
              </div>
            </div>


            <div className='row'>
              <div className='fieldHolder'>
                <FormSelect
                  label="Role"
                  name="role"
                  options={Roles}
                  value={this.props.optionalIssueInfo.role}
                  error={errors.contributorRole}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  trackErrors={['contributorRole']}
                  required={hasData}
                  tooltip={this.props.tooltip && tooltips.contributorRole}
                  deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                  onSelect={this.props.validate}
                  changeHandler={this.handler}/>
              </div>

              <ErrorIndicator
                style="shiftLeft"
                trackErrors={['contributorRole']}
                errorMessages={this.props.errorMessages}
                errorUtility={this.props.errorUtility}
                allErrors={errors}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
