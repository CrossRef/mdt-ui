import React, { Component } from 'react'
import update from 'immutability-helper'

import {routes} from '../../../routing'
import FormInput from '../../Common/formInput'
import FormSelect from '../../Common/formSelect'
const RelationTypes = require('../../../utilities/lists/relationTypes.json')
const IdentifierTypes = require('../../../utilities/lists/identifierTypes.json')


export default class RelatedItems extends Component {
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
    this.props.deferredErrorBubbleRefresh.resolve()
  }


  toggle = () => {
    this.setState({
      showSubItem: !this.state.showSubItem
    })
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
    const { relatedItemDoiInvalid } = this.props.relateditem.errors || {};
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
                  onBlur={this.props.validate}
                  tooltip={this.props.tooltip}/>

                <FormSelect
                  label="Identifier Type"
                  name="identifierType"
                  required={activeElement}
                  error={this.props.relateditem.errors.relatedItemIdType}
                  value={identifierType}
                  options={IdentifierTypes}
                  changeHandler={this.handleRelatedItems}
                  onSelect={this.props.validate}
                  tooltip={this.props.tooltip}/>
              </div>
            </div>

            <div className='row'>
              <div className='fieldHolder'>
                <FormInput
                  label="Description"
                  name="description"
                  value={description}
                  changeHandler={this.handleRelatedItems}
                  onBlur={this.props.validate}
                  tooltip={this.props.tooltip}/>

                <FormSelect
                  label="Relation Type"
                  name="relationType"
                  required={activeElement}
                  error={this.props.relateditem.errors.relatedItemRelType}
                  value={relationType}
                  options={RelationTypes}
                  changeHandler={this.handleRelatedItems}
                  onSelect={this.props.validate}
                  tooltip={this.props.tooltip}/>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}
