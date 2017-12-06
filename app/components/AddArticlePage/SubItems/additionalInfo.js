import React, { Component } from 'react'
import update from 'immutability-helper'

import FormInput from '../../Common/formInput'
import FormSelect from '../../Common/formSelect'
import {urlEntered} from '../../../utilities/helpers'
const Languages = require('../../../utilities/lists/language.json')
import { ArchiveLocations } from '../../../utilities/lists/archiveLocations'
import {articleTooltips as tooltips} from '../../../utilities/lists/tooltipMessages'
import ErrorIndicator from '../../Common/errorIndicator'




export default class AdditionalInformation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      on: false
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
                setErrorMessages={this.props.errorUtility.setErrorMessages}
                trackErrors={['simCheckUrlInvalid']}
                tooltipUtility={this.props.tooltipUtility}
                tooltip={this.props.tooltip && tooltips.similarityCheckURL}/>

              <FormSelect
                label="Archive Location"
                name="archiveLocation"
                value={this.props.addInfo.archiveLocation}
                options={ArchiveLocations}
                changeHandler={this.handleAddInfo}
                onSelect={this.props.validate}
                setErrorMessages={this.props.errorUtility.setErrorMessages}
                tooltipUtility={this.props.tooltipUtility}
                tooltip={this.props.tooltip && tooltips.archiveLocation}/>
            </div>

            <ErrorIndicator
              trackErrors={['simCheckUrlInvalid']}
              errorMessages={this.props.errorMessages}
              errorUtility={this.props.errorUtility}
              tooltipUtility={this.props.tooltipUtility}
              allErrors={this.props.allErrors}/>
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
                setErrorMessages={this.props.errorUtility.setErrorMessages}
                tooltipUtility={this.props.tooltipUtility}
                tooltip={this.props.tooltip && tooltips.language}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
