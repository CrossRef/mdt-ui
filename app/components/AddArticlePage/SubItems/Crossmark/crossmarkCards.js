import React, { Component } from 'react'
import is from 'prop-types'

import TextInput from './reduxTextInput'
import Selector from './reduxSelectInput'
import Date from './reduxDate'
import ErrorIndicator from './reduxIndicator'
import { registryDois, updateTypes, cardNames } from '../../../../utilities/crossmarkHelpers'
const { pubHist, peer, update, copyright, clinical, supp, other } = cardNames;
import {articleTooltips as tooltips} from '../../../../utilities/lists/tooltipMessages'




function generateCard (name, fields) {
  return class CrossmarkCard extends Component {
    static propTypes = {
      crossmarkUtility: is.object.isRequired,
      number: is.number.isRequired,
      remove: is.func.isRequired,
      cardName: is.string.isRequired,
      tooltip: is.oneOfType([is.string, is.bool]),
      deferredTooltipBubbleRefresh: is.object.isRequired,
      errorMessages: is.array.isRequired,
      errorUtility: is.object.isRequired
    }


    state={ number: this.props.number || 0 }


    componentWillReceiveProps (nextProps) {
      this.setState({
        number: nextProps.number
      })
    }


    renderFields = () => {
      let fieldArray = [];
      let i = 0;
      while (i <= this.state.number) {
        fieldArray.push(fields(i.toString(), this)); i++
      }
      return fieldArray
    }


    addFields = () => {
      this.props.crossmarkUtility.addCrossmarkCard(this.props.cardName)
    }


    render() {
      return(
        <div className='optionalissueiinfo'>
          <div className='innerCardHolder'>
            <div className='row subItemRow'>

              <div className='subItemHeader subItemTitle'>
                <span>{name}</span>
              </div>

              <div className='subItemHeader subItemButton'>
                <a onClick={()=>this.props.remove(this.props.cardName)}>Remove</a>
              </div>
            </div>

            {this.renderFields()}

            <button type='button' onClick={this.addFields} className="addFields">Add</button>
          </div>
        </div>
      )
    }
  }
}


export const PublicationHistory = generateCard(pubHist, function fields (i, card) {
  return (
    <div key={i} className='row'>
      <div className='fieldHolder'>
        <Selector
          label=''
          onSelect={card.props.validate}
          keyPath={[pubHist, i, 'label']}
          trackErrors={[`${pubHist} label`]}
          setErrorMessages={card.props.errorUtility.setErrorMessages}
          errorUtility={card.props.errorUtility}
          style="dateAlignSelect"
          tooltip={card.props.tooltip && tooltips.publicationHistoryLabel}
          deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
          options={['Received', 'Accepted', 'Published Online', 'Published Print']}/>

        <Date
          label="Date"
          onSelect={card.props.validate}
          keyPath={[pubHist, i]}/>
      </div>

      <ErrorIndicator
        errorsKeyPath={[pubHist, i, 'errors']}
        trackErrors={[`${pubHist} label`]}
        errorMessages={card.props.errorMessages}
        errorUtility={card.props.errorUtility}/>
    </div>
  )
})


export const PeerReview = generateCard(peer, function fields (i, card) {
  return (
    <div key={i}>
      <div className='row'>
        <div className='fieldHolder'>
          <Selector
            label=''
            onSelect={card.props.validate}
            keyPath={[peer, i, 'label']}
            trackErrors={[`${peer} label`]}
            setErrorMessages={card.props.errorUtility.setErrorMessages}
            errorUtility={card.props.errorUtility}
            style="textAlignSelect"
            tooltip={card.props.tooltip && tooltips.peerReviewLabel}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            options={['Peer reviewed', 'Review Process']}/>

          <TextInput
            label='Description'
            onBlur={card.props.validate}
            keyPath={[peer, i, 'explanation']}/>
        </div>

        <ErrorIndicator
          errorsKeyPath={[peer, i, 'errors']}
          trackErrors={[`${peer} label`]}
          errorMessages={card.props.errorMessages}
          errorUtility={card.props.errorUtility}/>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <TextInput
            label='URL'
            onBlur={card.props.validate}
            keyPath={[peer, i, 'href']}
            trackErrors={[`${peer} href`]}
            setErrorMessages={card.props.errorUtility.setErrorMessages}
            errorUtility={card.props.errorUtility}
            style="floatRight"/>
        </div>

        <ErrorIndicator
          errorsKeyPath={[peer, i, 'errors']}
          trackErrors={[`${peer} href`]}
          errorMessages={card.props.errorMessages}
          errorUtility={card.props.errorUtility}/>
      </div>
    </div>
  )
})


export const Copyright = generateCard(copyright, function fields (i, card) {
  return (
    <div key={i}>
      <div className='row'>
        <div className='fieldHolder'>
          <Selector
            label=''
            onSelect={card.props.validate}
            keyPath={[copyright, i, 'label']}
            trackErrors={[`${copyright} label`]}
            setErrorMessages={card.props.errorUtility.setErrorMessages}
            errorUtility={card.props.errorUtility}
            style="textAlignSelect"
            tooltip={card.props.tooltip && tooltips.copyrightLicensingUrl}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            options={['Copyright Statement', 'Licensing Information']}/>

          <TextInput
            label='Description'
            onBlur={card.props.validate}
            keyPath={[copyright, i, 'explanation']}/>
        </div>

        <ErrorIndicator
          errorsKeyPath={[copyright, i, 'errors']}
          trackErrors={[`${copyright} label`]}
          errorMessages={card.props.errorMessages}
          errorUtility={card.props.errorUtility}/>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <TextInput
            label='URL'
            onBlur={card.props.validate}
            keyPath={[copyright, i, 'href']}
            trackErrors={[`${copyright} href`]}
            setErrorMessages={card.props.errorUtility.setErrorMessages}
            errorUtility={card.props.errorUtility}
            style="floatRight" />
        </div>

        <ErrorIndicator
          errorsKeyPath={[copyright, i, 'errors']}
          trackErrors={[`${copyright} href`]}
          errorMessages={card.props.errorMessages}
          errorUtility={card.props.errorUtility}/>
      </div>
    </div>  
  )
})


export const SupplementaryMaterial = generateCard(supp, function fields (i, card) {
  return (
    <div key={i} className='row'>
      <div className='fieldHolder'>
        <TextInput
          label='Description'
          onBlur={card.props.validate}
          setErrorMessages={card.props.errorUtility.setErrorMessages}
          tooltip={card.props.tooltip && tooltips.suppDescription}
          deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
          keyPath={[supp, i, 'explanation']}/>

        <TextInput
          label='URL'
          keyPath={[supp, i, 'href']}
          onBlur={card.props.validate}
          trackErrors={[`${supp} href`]}
          errorUtility={card.props.errorUtility}
          setErrorMessages={card.props.errorUtility.setErrorMessages}/>
      </div>

      <ErrorIndicator
        errorsKeyPath={[supp, i, 'errors']}
        trackErrors={[`${supp} href`]}
        errorMessages={card.props.errorMessages}
        errorUtility={card.props.errorUtility}/>
    </div>
  )
})


export const Other = generateCard(other, function fields (i, card) {
  return (
    <div key={i}>
      <div className='row'>
        <div className='fieldHolder'>
          <TextInput
            label={`Label ${i+1}`}
            keyPath={[other, i, 'label']}
            trackErrors={[`${other} label`]}
            setErrorMessages={card.props.errorUtility.setErrorMessages}
            errorUtility={card.props.errorUtility}
            onBlur={card.props.validate}
            tooltip={card.props.tooltip && tooltips.otherLabel}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}/>

          <TextInput
            label='Description'
            onBlur={card.props.validate}
            keyPath={[other, i, 'explanation']}/>
        </div>

        <ErrorIndicator
          errorsKeyPath={[other, i, 'errors']}
          trackErrors={[`${other} label`]}
          errorMessages={card.props.errorMessages}
          errorUtility={card.props.errorUtility}/>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <TextInput
            label='URL'
            onBlur={card.props.validate}
            keyPath={[other, i, 'href']}
            trackErrors={[`${other} href`]}
            setErrorMessages={card.props.errorUtility.setErrorMessages}
            errorUtility={card.props.errorUtility}
            style="floatRight" />
        </div>

        <ErrorIndicator
          errorsKeyPath={[other, i, 'errors']}
          trackErrors={[`${other} href`]}
          errorMessages={card.props.errorMessages}
          errorUtility={card.props.errorUtility}/>
      </div>
    </div>
  )
})


export const StatusUpdate = generateCard(update, function fields (i, card) {
  return (
    <div key={i}>
      <div className='row'>
        <div className='fieldHolder'>
          <Selector
            label='Update Type (Required)'
            onSelect={card.props.validate}
            keyPath={[update, i, 'type']}
            trackErrors={[`${update} type`]}
            setErrorMessages={card.props.errorUtility.setErrorMessages}
            errorUtility={card.props.errorUtility}
            style="textAlignSelect"
            tooltip={card.props.tooltip && tooltips.updateType}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            required={true}
            options={updateTypes}/>

          <Date
            label="Update Date"
            onSelect={card.props.validate}
            keyPath={[update, i]}
            trackErrors={[`${update} date`]}
            setErrorMessages={card.props.errorUtility.setErrorMessages}
            errorUtility={card.props.errorUtility}
            tooltip={card.props.tooltip && tooltips.updateDate}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            required={true} />
        </div>

        <ErrorIndicator
          errorsKeyPath={[update, i, 'errors']}
          trackErrors={[`${update} type`, `${update} date`]}
          errorMessages={card.props.errorMessages}
          errorUtility={card.props.errorUtility}/>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <TextInput
            label='DOI for Update'
            onBlur={card.props.validate}
            keyPath={[update, i, 'doi']}
            trackErrors={[`${update} doi`, `${update} doiInvalid`, `${update} doiNotExist`]}
            setErrorMessages={card.props.errorUtility.setErrorMessages}
            errorUtility={card.props.errorUtility}
            tooltip={card.props.tooltip && tooltips.updateDoi}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            required={true}/>
        </div>

        <ErrorIndicator
          errorsKeyPath={[update, i, 'errors']}
          trackErrors={[`${update} doi`, `${update} doiInvalid`, `${update} doiNotExist`]}
          errorMessages={card.props.errorMessages}
          errorUtility={card.props.errorUtility}/>
      </div>
    </div>
  )
})


export const ClinicalTrials = generateCard(clinical, function fields (i, card) {
  return (
    <div key={i}>
      <div className='row'>
        <div className='fieldHolder'>
          <Selector
            label='Clinical trial registry (Required)'
            onSelect={card.props.validate}
            keyPath={[clinical, i, 'registry']}
            trackErrors={[`${clinical} registry`]}
            setErrorMessages={card.props.errorUtility.setErrorMessages}
            errorUtility={card.props.errorUtility}
            tooltip={card.props.tooltip && tooltips.clinicalTrialRegistry}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            required={true}
            options={Object.keys(registryDois)}/>

          <TextInput
            label="Registered trial number (Required)"
            onBlur={card.props.validate}
            keyPath={[clinical, i, 'trialNumber']}
            trackErrors={[`${clinical} trialNumber`]}
            setErrorMessages={card.props.errorUtility.setErrorMessages}
            errorUtility={card.props.errorUtility}
            tooltip={card.props.tooltip && tooltips.clinicalTrialNumber}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            required={true}/>
        </div>

        <ErrorIndicator
          errorsKeyPath={[clinical, i, 'errors']}
          trackErrors={[`${clinical} registry`, `${clinical} trialNumber`]}
          errorMessages={card.props.errorMessages}
          errorUtility={card.props.errorUtility}/>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <Selector
            label='Relationship of publication to trial'
            onSelect={card.props.validate}
            keyPath={[clinical, i, 'type']}
            tooltip={card.props.tooltip && tooltips.clinicalRelationship}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            setErrorMessages={card.props.errorUtility.setErrorMessages}
            options={['Pre-Results', 'Results', 'Post-Results']}/>
        </div>
      </div>
    </div>
  )
})
