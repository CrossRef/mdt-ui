import React, { Component } from 'react'
import update from 'immutability-helper'

import FormInput from '../../Common/formInput'
import FormSelect from '../../Common/formSelect'
import {urlEntered} from '../../../utilities/helpers'
const Languages = require('../../../utilities/lists/language.json')
import { ArchiveLocations } from '../../../utilities/lists/archiveLocations'
import {articleTooltips as tooltips} from '../../../utilities/lists/tooltipMessages'




export default class AdditionalInformation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      on: false
    }
  }


  componentWillMount () {
    if (this.props.addInfo.freetolicense) {
      this.setState({
          on: true
      })
    }
  }


  handleAddInfo = (e) => {
    this.props.handler({
      addInfo: update(this.props.addInfo, {$set:{
        ...this.props.addInfo,
        [e.target.name]: e.target.value
      }})
    })
  }


  render () {
    return (
      <div className='noAddable'>
        <div>
          <div className='row'>
            <div className='fieldHolder'>
              <FormInput
                label="Similarity Check URL"
                name="similarityCheckURL"
                value={ urlEntered(this.props.addInfo.similarityCheckURL) ? this.props.addInfo.similarityCheckURL : 'http://'}
                error={this.props.simCheckError}
                changeHandler={this.handleAddInfo}
                onBlur={this.props.validate}
                deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                tooltip={this.props.tooltip && tooltips.similarityCheckURL}/>

              <FormSelect
                label="Archive Location"
                name="archiveLocation"
                value={this.props.addInfo.archiveLocation}
                options={ArchiveLocations}
                changeHandler={this.handleAddInfo}
                onSelect={this.props.validate}
                deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                tooltip={this.props.tooltip && tooltips.archiveLocation}/>
            </div>
          </div>
          <div className='row'>
            <div className='fieldHolder'>
              <FormSelect
                label="Language"
                name="language"
                value={this.props.addInfo.language}
                options={Languages}
                changeHandler={this.handleAddInfo}
                onSelect={this.props.validate}
                deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                tooltip={this.props.tooltip && tooltips.language}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
