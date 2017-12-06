import React, { Component } from 'react'
import update from 'immutability-helper'

import {routes} from '../../../routing'
import FormInput from '../../Common/formInput'
import FormSelect from '../../Common/formSelect'
const RelationTypes = require('../../../utilities/lists/relationTypes.json')
const IdentifierTypes = require('../../../utilities/lists/identifierTypes.json')
import {articleTooltips as tooltips} from '../../../utilities/lists/tooltipMessages'
import ErrorIndicator from '../../Common/errorIndicator'




export default class RelatedItems extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showSubItem: true
    }
  }


  componentWillReceiveProps (nextProps) {
    if(nextProps.openSubItems) {
      this.setState({showSubItem: true})
    }
  }


  toggle = () => {
    this.setState({
      showSubItem: !this.state.showSubItem
    })
    this.props.handler({})
  }


  handleRelatedItems = (e) => {
    var relatedItems = {
      ...this.props.relateditem,
      [e.target.name]: e.target.value
    }

    this.props.handler({
      relatedItems: update(this.props.data, {[this.props.index]: {$set: relatedItems }})
    })
  }


  render () {
    const { relatedItemIdentifier, description, relationType, identifierType } = this.props.relateditem;
    const activeElement = !!(relatedItemIdentifier || description || relationType || identifierType)
    const errors = this.props.relateditem.errors || {}
    const { relatedItemDoiInvalid } = errors;

    const subItemErrorIndicator = React.cloneElement(
      this.props.ErrorIndicator,
      {
        openSubItem: this.toggle,
        allErrors: errors,
        subItemIndex: String(this.props.index),
        subItem: 'license'
      }
    )
    return (
      <div>
        <div className='row subItemRow' onClick={this.toggle}>
          <div className='subItemHeader subItemTitle'>
            <span className={'arrowHolder' + (this.state.showSubItem ? ' openArrowHolder' : '')}>
              <img src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </span>
            <span>Relation {this.props.index + 1}</span>
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
                  label="Related Item Identifier"
                  name="relatedItemIdentifier"
                  error={relatedItemDoiInvalid}
                  value={relatedItemIdentifier}
                  changeHandler={this.handleRelatedItems}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  trackErrors={['relatedItemDoiInvalid']}
                  allErrors={errors}
                  subItemIndex={String(this.props.index)}
                  errorUtility={this.props.errorUtility}
                  tooltipUtility={this.props.tooltipUtility}
                  tooltip={this.props.tooltip && tooltips.relatedItemId}
                  onBlur={this.props.validate}/>

                <FormSelect
                  label="Identifier Type"
                  name="identifierType"
                  required={activeElement}
                  error={this.props.relateditem.errors.relatedItemIdType}
                  value={identifierType}
                  options={IdentifierTypes}
                  changeHandler={this.handleRelatedItems}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  trackErrors={['relatedItemIdType']}
                  allErrors={errors}
                  subItemIndex={String(this.props.index)}
                  errorUtility={this.props.errorUtility}
                  tooltipUtility={this.props.tooltipUtility}
                  tooltip={this.props.tooltip && tooltips.relatedItemIdType}
                  onSelect={this.props.validate}/>
              </div>

              <ErrorIndicator
                trackErrors={['relatedItemIdType', 'relatedItemDoiInvalid']}
                errorMessages={this.props.errorMessages}
                errorUtility={this.props.errorUtility}
                allErrors={errors}
                subItem='relatedItems'
                subItemIndex={String(this.props.index)}/>
            </div>

            <div className='row'>
              <div className='fieldHolder'>
                <FormInput
                  label="Description"
                  name="description"
                  value={description}
                  changeHandler={this.handleRelatedItems}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  tooltipUtility={this.props.tooltipUtility}
                  tooltip={this.props.tooltip && tooltips.relatedItemDescription}
                  subItemIndex={String(this.props.index)}
                  onBlur={this.props.validate}/>

                <FormSelect
                  label="Relation Type"
                  name="relationType"
                  required={activeElement}
                  error={this.props.relateditem.errors.relatedItemRelType}
                  value={relationType}
                  options={RelationTypes}
                  changeHandler={this.handleRelatedItems}
                  onSelect={this.props.validate}
                  setErrorMessages={this.props.errorUtility.setErrorMessages}
                  trackErrors={['relatedItemRelType']}
                  allErrors={errors}
                  subItemIndex={String(this.props.index)}
                  errorUtility={this.props.errorUtility}
                  tooltipUtility={this.props.tooltipUtility}
                  tooltip={this.props.tooltip && tooltips.relatedItemRelationType}/>
              </div>

              <ErrorIndicator
                trackErrors={['relatedItemRelType']}
                errorMessages={this.props.errorMessages}
                errorUtility={this.props.errorUtility}
                allErrors={errors}
                subItem='relatedItems'
                subItemIndex={String(this.props.index)}/>
            </div>
          </div>
        }
      </div>
    )
  }
}
