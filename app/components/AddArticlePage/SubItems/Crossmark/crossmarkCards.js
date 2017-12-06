import React, { Component } from 'react'
import is from 'prop-types'

import ReduxTextInput from './reduxTextInput'
import ReduxSelector from './reduxSelectInput'
import ReduxDate from './reduxDate'
import ReduxErrorIndicator from './reduxIndicator'
import { registryDois, updateTypes, cardNames } from '../../../../utilities/crossmarkHelpers'
const { pubHist, peer, update, copyright, clinical, supp, other } = cardNames;
import {articleTooltips as tooltips} from '../../../../utilities/lists/tooltipMessages'




function generateCard (name, WrappedComponent) {

  return class CrossmarkCardHOC extends Component {

    static displayName = WrappedComponent.name

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
        fieldArray.push(
          <WrappedComponent key={`${name}-${i}`} i={i.toString()} {...this.props}/>
        ); i++
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


export const PublicationHistory = generateCard(pubHist, PublicationHistoryCard)
function PublicationHistoryCard (props) {
  return (
    <div className='row'>
      <div className='fieldHolder'>
        <ReduxSelector
          label=''
          onSelect={props.validate}
          keyPath={[pubHist, props.i, 'label']}
          trackErrors={[`${pubHist} label`]}
          setErrorMessages={props.errorUtility.setErrorMessages}
          errorUtility={props.errorUtility}
          style="dateAlignSelect"
          tooltip={props.tooltip && tooltips.publicationHistoryLabel}
          deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
          options={['Received', 'Accepted', 'Published Online', 'Published Print']}/>

        <ReduxDate
          label="Date"
          onSelect={props.validate}
          keyPath={[pubHist, props.i]}/>
      </div>

      <ReduxErrorIndicator
        style="dateErrorHolder"
        errorsKeyPath={[pubHist, props.i, 'errors']}
        trackErrors={[`${pubHist} label`]}
        errorMessages={props.errorMessages}
        errorUtility={props.errorUtility}/>
    </div>
  )
}


export const PeerReview = generateCard(peer, PeerReviewCard)
function PeerReviewCard (props) {
  return (
    <div>
      <div className='row'>
        <div className='fieldHolder'>
          <ReduxSelector
            label=''
            onSelect={props.validate}
            keyPath={[peer, props.i, 'label']}
            trackErrors={[`${peer} label`]}
            setErrorMessages={props.errorUtility.setErrorMessages}
            errorUtility={props.errorUtility}
            style="textAlignSelect"
            tooltip={props.tooltip && tooltips.peerReviewLabel}
            deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
            options={['Peer reviewed', 'Review Process']}/>

          <ReduxTextInput
            label='Description'
            onBlur={props.validate}
            keyPath={[peer, props.i, 'explanation']}/>
        </div>

        <ReduxErrorIndicator
          errorsKeyPath={[peer, props.i, 'errors']}
          trackErrors={[`${peer} label`]}
          errorMessages={props.errorMessages}
          errorUtility={props.errorUtility}/>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <ReduxTextInput
            label='URL'
            onBlur={props.validate}
            keyPath={[peer, props.i, 'href']}
            trackErrors={[`${peer} href`]}
            setErrorMessages={props.errorUtility.setErrorMessages}
            errorUtility={props.errorUtility}
            style="floatRight"/>
        </div>

        <ReduxErrorIndicator
          errorsKeyPath={[peer, props.i, 'errors']}
          trackErrors={[`${peer} href`]}
          errorMessages={props.errorMessages}
          errorUtility={props.errorUtility}/>
      </div>
    </div>
  )
}


export const Copyright = generateCard(copyright, CopyrightCard)
function CopyrightCard (props) {
  return (
    <div>
      <div className='row'>
        <div className='fieldHolder'>
          <ReduxSelector
            label=''
            onSelect={props.validate}
            keyPath={[copyright, props.i, 'label']}
            trackErrors={[`${copyright} label`]}
            setErrorMessages={props.errorUtility.setErrorMessages}
            errorUtility={props.errorUtility}
            style="textAlignSelect"
            tooltip={props.tooltip && tooltips.copyrightLicensingUrl}
            deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
            options={['Copyright Statement', 'Licensing Information']}/>

          <ReduxTextInput
            label='Description'
            onBlur={props.validate}
            keyPath={[copyright, props.i, 'explanation']}/>
        </div>

        <ReduxErrorIndicator
          errorsKeyPath={[copyright, props.i, 'errors']}
          trackErrors={[`${copyright} label`]}
          errorMessages={props.errorMessages}
          errorUtility={props.errorUtility}/>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <ReduxTextInput
            label='URL'
            onBlur={props.validate}
            keyPath={[copyright, props.i, 'href']}
            trackErrors={[`${copyright} href`]}
            setErrorMessages={props.errorUtility.setErrorMessages}
            errorUtility={props.errorUtility}
            style="floatRight" />
        </div>

        <ReduxErrorIndicator
          errorsKeyPath={[copyright, props.i, 'errors']}
          trackErrors={[`${copyright} href`]}
          errorMessages={props.errorMessages}
          errorUtility={props.errorUtility}/>
      </div>
    </div>
  )
}


export const SupplementaryMaterial = generateCard(supp, SupplementaryMaterialCard)
function SupplementaryMaterialCard (props) {
  return (
    <div className='row'>
      <div className='fieldHolder'>
        <ReduxTextInput
          label='Description'
          onBlur={props.validate}
          setErrorMessages={props.errorUtility.setErrorMessages}
          tooltip={props.tooltip && tooltips.suppDescription}
          deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
          keyPath={[supp, props.i, 'explanation']}/>

        <ReduxTextInput
          label='URL'
          keyPath={[supp, props.i, 'href']}
          onBlur={props.validate}
          trackErrors={[`${supp} href`]}
          errorUtility={props.errorUtility}
          setErrorMessages={props.errorUtility.setErrorMessages}/>
      </div>

      <ReduxErrorIndicator
        errorsKeyPath={[supp, props.i, 'errors']}
        trackErrors={[`${supp} href`]}
        errorMessages={props.errorMessages}
        errorUtility={props.errorUtility}/>
    </div>
  )
}


export const Other = generateCard(other, OtherCard)
function OtherCard (props) {
  return (
    <div>
      <div className='row'>
        <div className='fieldHolder'>
          <ReduxTextInput
            label={`Label ${Number(props.i)+1}`}
            keyPath={[other, props.i, 'label']}
            trackErrors={[`${other} label`]}
            setErrorMessages={props.errorUtility.setErrorMessages}
            errorUtility={props.errorUtility}
            onBlur={props.validate}
            tooltip={props.tooltip && tooltips.otherLabel}
            deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}/>

          <ReduxTextInput
            label='Description'
            onBlur={props.validate}
            keyPath={[other, props.i, 'explanation']}/>
        </div>

        <ReduxErrorIndicator
          errorsKeyPath={[other, props.i, 'errors']}
          trackErrors={[`${other} label`]}
          errorMessages={props.errorMessages}
          errorUtility={props.errorUtility}/>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <ReduxTextInput
            label='URL'
            onBlur={props.validate}
            keyPath={[other, props.i, 'href']}
            trackErrors={[`${other} href`]}
            setErrorMessages={props.errorUtility.setErrorMessages}
            errorUtility={props.errorUtility}
            style="floatRight" />
        </div>

        <ReduxErrorIndicator
          errorsKeyPath={[other, props.i, 'errors']}
          trackErrors={[`${other} href`]}
          errorMessages={props.errorMessages}
          errorUtility={props.errorUtility}/>
      </div>
    </div>
  )
}


export const StatusUpdate = generateCard(update, StatusUpdateCard)
function StatusUpdateCard (props) {
  return (
    <div>
      <div className='row'>
        <div className='fieldHolder'>
          <ReduxSelector
            label='Update Type (Required)'
            onSelect={props.validate}
            keyPath={[update, props.i, 'type']}
            trackErrors={[`${update} type`]}
            setErrorMessages={props.errorUtility.setErrorMessages}
            errorUtility={props.errorUtility}
            style="textAlignSelect"
            tooltip={props.tooltip && tooltips.updateType}
            deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
            required={true}
            options={updateTypes}/>

          <ReduxDate
            label="Update Date"
            onSelect={props.validate}
            keyPath={[update, props.i]}
            trackErrors={[`${update} date`]}
            setErrorMessages={props.errorUtility.setErrorMessages}
            errorUtility={props.errorUtility}
            tooltip={props.tooltip && tooltips.updateDate}
            deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
            required={true} />
        </div>

        <ReduxErrorIndicator
          style="dateErrorHolder"
          errorsKeyPath={[update, props.i, 'errors']}
          trackErrors={[`${update} type`, `${update} date`]}
          errorMessages={props.errorMessages}
          errorUtility={props.errorUtility}/>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <ReduxTextInput
            label='DOI for Update'
            onBlur={props.validate}
            keyPath={[update, props.i, 'doi']}
            trackErrors={[`${update} doi`, `${update} doiInvalid`, `${update} doiNotExist`]}
            setErrorMessages={props.errorUtility.setErrorMessages}
            errorUtility={props.errorUtility}
            tooltip={props.tooltip && tooltips.updateDoi}
            deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
            required={true}/>
        </div>

        <ReduxErrorIndicator
          errorsKeyPath={[update, props.i, 'errors']}
          trackErrors={[`${update} doi`, `${update} doiInvalid`, `${update} doiNotExist`]}
          errorMessages={props.errorMessages}
          errorUtility={props.errorUtility}/>
      </div>
    </div>
  )
}


export const ClinicalTrials = generateCard(clinical, ClinicalTrialsCards)
function ClinicalTrialsCards (props) {
  return (
    <div>
      <div className='row'>
        <div className='fieldHolder'>
          <ReduxSelector
            label='Clinical trial registry (Required)'
            onSelect={props.validate}
            keyPath={[clinical, props.i, 'registry']}
            trackErrors={[`${clinical} registry`]}
            setErrorMessages={props.errorUtility.setErrorMessages}
            errorUtility={props.errorUtility}
            tooltip={props.tooltip && tooltips.clinicalTrialRegistry}
            deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
            required={true}
            options={Object.keys(registryDois)}/>

          <ReduxTextInput
            label="Registered trial number (Required)"
            onBlur={props.validate}
            keyPath={[clinical, props.i, 'trialNumber']}
            trackErrors={[`${clinical} trialNumber`]}
            setErrorMessages={props.errorUtility.setErrorMessages}
            errorUtility={props.errorUtility}
            tooltip={props.tooltip && tooltips.clinicalTrialNumber}
            deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
            required={true}/>
        </div>

        <ReduxErrorIndicator
          errorsKeyPath={[clinical, props.i, 'errors']}
          trackErrors={[`${clinical} registry`, `${clinical} trialNumber`]}
          errorMessages={props.errorMessages}
          errorUtility={props.errorUtility}/>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <ReduxSelector
            label='Relationship of publication to trial'
            onSelect={props.validate}
            keyPath={[clinical, props.i, 'type']}
            tooltip={props.tooltip && tooltips.clinicalRelationship}
            deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
            setErrorMessages={props.errorUtility.setErrorMessages}
            options={['Pre-Results', 'Results', 'Post-Results']}/>
        </div>
      </div>
    </div>
  )
}
