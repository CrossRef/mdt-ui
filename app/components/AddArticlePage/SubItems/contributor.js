import React, { Component } from 'react'
import update from 'immutability-helper'

import { Roles } from '../../../utilities/lists/roles.js'
import {routes} from '../../../routing'
import FormInput from '../../Common/formInput'
import FormSelect from '../../Common/formSelect'
import {articleTooltips as tooltips} from '../../../utilities/lists/tooltipMessages'
import ErrorIndicator from '../../Common/errorIndicator'



export default class Contributor extends Component {
  constructor (props) {
    super(props)
    const e=props.contributor

    this.state = {
      showSubItem: true,
      groupDisabled: !!(e.firstName||e.lastName||e.orcid||e.suffix||e.role||e.affiliation),
      personDisabled: !!(e.groupAuthorName||e.groupAuthorRole)
    }
  }


  componentWillReceiveProps (nextProps) {
    if(nextProps.openSubItems) {
      this.setState({showSubItem: true})
    }
    const e=nextProps.contributor
    this.setState({
      groupDisabled: !!(e.firstName||e.lastName||e.orcid||e.suffix||e.role||e.affiliation),
      personDisabled: !!(e.groupAuthorName||e.groupAuthorRole)
    })
  }


  toggle = () => {
    this.setState({
      showSubItem: !this.state.showSubItem
    })
    this.props.handler({})
  }


  handleContributor = (e) => {
    var contributor = {
      ...this.props.contributor,
      [e.target.name]: e.target.value
    }

    this.props.handler({
      contributors: update(this.props.data, {[this.props.index]: {$set: contributor }})
    })
  }


  render () {
    const errors = this.props.contributor.errors || {};
    const {firstName, lastName, suffix, affiliation, orcid, role, groupAuthorName, groupAuthorRole} = this.props.contributor;
    const roleRequired = !!(firstName || lastName || suffix || affiliation || orcid)

    const subItemErrorIndicator = React.cloneElement(
      this.props.ErrorIndicator,
      {
        openSubItem: this.toggle,
        allErrors: errors,
        subItemIndex: String(this.props.index),
        subItem: 'contributor'
      }
    )

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
          {!this.state.showSubItem && subItemErrorIndicator}
        </div>
        {this.state.showSubItem &&
          <div>
            <div className='row'>
              <div className='fieldHolder'>

                <FormInput
                  label="First Name"
                  name="firstName"
                  value={firstName}
                  changeHandler={this.handleContributor}
                  onBlur={this.props.validate}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  subItemIndex={String(this.props.index)}
                  tooltipUtility={this.props.tooltipUtility}
                  disabled={this.state.personDisabled}/>

                <FormInput
                  label="Last Name"
                  required={!!firstName}
                  error={errors.contributorLastName}
                  name="lastName"
                  value={lastName}
                  changeHandler={this.handleContributor}
                  onBlur={this.props.validate}
                  trackErrors={['contributorLastName']}
                  allErrors={errors}
                  subItemIndex={String(this.props.index)}
                  tooltipUtility={this.props.tooltipUtility}
                  errorUtility={this.props.errorUtility}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  disabled={this.state.personDisabled}/>

              </div>

              <ErrorIndicator
                trackErrors={['contributorLastName']}
                errorMessages={this.props.errorMessages}
                errorUtility={this.props.errorUtility}
                tooltipUtility={this.props.tooltipUtility}
                allErrors={errors}
                subItem='contributor'
                subItemIndex={String(this.props.index)}/>
            </div>

            <div className='row'>
              <div className='fieldHolder'>

                <FormInput
                  label="Suffix"
                  name="suffix"
                  value={suffix}
                  error={errors.contributorSuffixLimit}
                  trackErrors={['contributorSuffixLimit']}
                  allErrors={errors}
                  errorUtility={this.props.errorUtility}
                  changeHandler={this.handleContributor}
                  onBlur={this.props.validate}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  tooltip={this.props.tooltip && tooltips.suffix}
                  subItemIndex={String(this.props.index)}
                  tooltipUtility={this.props.tooltipUtility}
                  disabled={this.state.personDisabled}/>

                <FormInput
                  label="Affiliation"
                  name="affiliation"
                  value={affiliation}
                  changeHandler={this.handleContributor}
                  onBlur={this.props.validate}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  tooltip={this.props.tooltip && tooltips.affiliation}
                  subItemIndex={String(this.props.index)}
                  tooltipUtility={this.props.tooltipUtility}
                  disabled={this.state.personDisabled}/>

              </div>

              <ErrorIndicator
                trackErrors={['contributorSuffixLimit']}
                errorMessages={this.props.errorMessages}
                errorUtility={this.props.errorUtility}
                tooltipUtility={this.props.tooltipUtility}
                allErrors={errors}
                subItem='contributor'
                subItemIndex={String(this.props.index)}/>
            </div>

            <div className='row'>
              <div className='fieldHolder'>

                <FormInput
                  label="ORCID"
                  name="orcid"
                  value={orcid}
                  changeHandler={this.handleContributor}
                  onBlur={this.props.validate}
                  subItemIndex={String(this.props.index)}
                  tooltipUtility={this.props.tooltipUtility}
                  tooltip={this.props.tooltip && tooltips.orcid}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  disabled={this.state.personDisabled}/>

                <FormSelect
                  label="Role"
                  required={roleRequired}
                  error={errors.contributorRole}
                  name="role"
                  value={role}
                  changeHandler={this.handleContributor}
                  options={Roles}
                  disabled={this.state.personDisabled}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  errorUtility={this.props.errorUtility}
                  trackErrors={['contributorRole']}
                  allErrors={errors}
                  subItemIndex={String(this.props.index)}
                  tooltip={this.props.tooltip && tooltips.role}
                  tooltipUtility={this.props.tooltipUtility}
                  onSelect={this.props.validate}/>

              </div>

              <ErrorIndicator
                trackErrors={['contributorRole']}
                errorMessages={this.props.errorMessages}
                errorUtility={this.props.errorUtility}
                tooltipUtility={this.props.tooltipUtility}
                allErrors={errors}
                subItem='contributor'
                subItemIndex={String(this.props.index)}/>
            </div>

            <div className='row'>
                <hr />
            </div>

            <div className='row'>
              <div className='fieldHolder'>

                <FormInput
                  label="Group Author Name"
                  required={!!groupAuthorRole}
                  error={errors.contributorGroupName}
                  name="groupAuthorName"
                  value={groupAuthorName}
                  changeHandler={this.handleContributor}
                  onBlur={this.props.validate}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  trackErrors={['contributorGroupName']}
                  allErrors={errors}
                  subItemIndex={String(this.props.index)}
                  errorUtility={this.props.errorUtility}
                  tooltipUtility={this.props.tooltipUtility}
                  tooltip={this.props.tooltip && tooltips.groupAuthorName}
                  disabled={this.state.groupDisabled}/>

                <FormSelect
                  label="Group Author Role"
                  required={!!groupAuthorName}
                  error={errors.contributorGroupRole}
                  name="groupAuthorRole"
                  value={groupAuthorRole}
                  changeHandler={this.handleContributor}
                  options={Roles}
                  onSelect={this.props.validate}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  trackErrors={['contributorGroupRole']}
                  allErrors={errors}
                  subItemIndex={String(this.props.index)}
                  errorUtility={this.props.errorUtility}
                  tooltipUtility={this.props.tooltipUtility}
                  tooltip={this.props.tooltip && tooltips.groupAuthorRole}
                  disabled={this.state.groupDisabled}/>

              </div>

              <ErrorIndicator
                trackErrors={['contributorGroupName', 'contributorGroupRole']}
                errorMessages={this.props.errorMessages}
                errorUtility={this.props.errorUtility}
                tooltipUtility={this.props.tooltipUtility}
                allErrors={errors}
                subItem='contributor'
                subItemIndex={String(this.props.index)}/>
            </div>
          </div>
        }
      </div>
    )
  }
}
