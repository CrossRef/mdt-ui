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
                  tooltipUtility={this.props.tooltipUtility}
                  subItemIndex={String(this.props.index)}
                  errorUtility={this.props.errorUtility}
                  onBlur={this.props.validate}
                  changeHandler={this.handler}/>

                <FormInput
                  label="Last Name"
                  name="lastName"
                  value={this.props.optionalIssueInfo.lastName}
                  error={errors.contributorLastName}
                  required={!!firstName}
                  indicatorErrors={['contributorLastName']}
                  tooltip={this.props.tooltip && tooltips.contributorLastName}
                  tooltipUtility={this.props.tooltipUtility}
                  subItemIndex={String(this.props.index)}
                  errorUtility={this.props.errorUtility}
                  onBlur={this.props.validate}
                  changeHandler={this.handler}/>
              </div>

              <ErrorIndicator
                style="shiftLeft"
                indicatorErrors={['contributorLastName']}
                errorMessages={this.props.errorMessages}
                errorUtility={this.props.errorUtility}
                tooltipUtility={this.props.tooltipUtility}
                subItemIndex={String(this.props.index)}
                allErrors={errors}/>
            </div>


            <div className='row'>
              <div className='fieldHolder'>
                <FormInput
                  label="Suffix"
                  name="suffix"
                  value={this.props.optionalIssueInfo.suffix}
                  error={errors.contributorSuffixLimit}
                  indicatorErrors={['contributorSuffixLimit']}
                  tooltip={this.props.tooltip && tooltips.contributorSuffix}
                  tooltipUtility={this.props.tooltipUtility}
                  subItemIndex={String(this.props.index)}
                  errorUtility={this.props.errorUtility}
                  onBlur={this.props.validate}
                  changeHandler={this.handler}/>

                <FormInput
                  label="Affiliation"
                  name="affiliation"
                  value={this.props.optionalIssueInfo.affiliation}
                  tooltip={this.props.tooltip && tooltips.contritbutorAffiliation}
                  tooltipUtility={this.props.tooltipUtility}
                  subItemIndex={String(this.props.index)}
                  errorUtility={this.props.errorUtility}
                  onBlur={this.props.validate}
                  changeHandler={this.handler}/>
              </div>

              <ErrorIndicator
                style="shiftLeft"
                indicatorErrors={['contributorSuffixLimit']}
                errorMessages={this.props.errorMessages}
                errorUtility={this.props.errorUtility}
                tooltipUtility={this.props.tooltipUtility}
                subItemIndex={String(this.props.index)}
                allErrors={errors}/>
            </div>


            <div className='row'>
              <div className='fieldHolder'>
                <FormInput
                  label="ORCID"
                  name="orcid"
                  value={this.props.optionalIssueInfo.orcid}
                  tooltip={this.props.tooltip && tooltips.contributorOrcid}
                  tooltipUtility={this.props.tooltipUtility}
                  subItemIndex={String(this.props.index)}
                  errorUtility={this.props.errorUtility}
                  onBlur={this.props.validate}
                  changeHandler={this.handler}/>

                <FormInput
                  label="Alternative Name"
                  name="alternativeName"
                  value={this.props.optionalIssueInfo.alternativeName}
                  tooltip={this.props.tooltip && tooltips.contributerAlternativeName}
                  tooltipUtility={this.props.tooltipUtility}
                  subItemIndex={String(this.props.index)}
                  errorUtility={this.props.errorUtility}
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
                  errorUtility={this.props.errorUtility}
                  indicatorErrors={['contributorRole']}
                  required={!!hasData}
                  tooltip={this.props.tooltip && tooltips.contributorRole}
                  tooltipUtility={this.props.tooltipUtility}
                  subItemIndex={String(this.props.index)}
                  onSelect={this.props.validate}
                  changeHandler={this.handler}/>
              </div>

              <ErrorIndicator
                style="shiftLeft"
                indicatorErrors={['contributorRole']}
                errorMessages={this.props.errorMessages}
                errorUtility={this.props.errorUtility}
                tooltipUtility={this.props.tooltipUtility}
                subItemIndex={String(this.props.index)}
                allErrors={errors}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
