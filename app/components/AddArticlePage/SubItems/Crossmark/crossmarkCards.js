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
      tooltipUtility: is.object.isRequired,
      errorMessages: is.array.isRequired,
      errorUtility: is.object.isRequired,
      activeCalendar: is.string.isRequired,
      calendarHandler: is.func.isRequired
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
          indicatorErrors={[`${pubHist} label`]}
          errorUtility={props.errorUtility}
          style="dateAlignSelect"
          tooltip={props.tooltip && tooltips.publicationHistoryLabel}
          tooltipUtility={props.tooltipUtility}
          options={['Received', 'Accepted', 'Published Online', 'Published Print']}/>

        <ReduxDate
          label="Date"
          onSelect={props.validate}
          tooltipUtility={props.tooltipUtility}
          errorUtility={props.errorUtility}
          activeCalendar={props.activeCalendar}
          calendarHandler={props.calendarHandler}
          keyPath={[pubHist, props.i]}/>
      </div>

      <ReduxErrorIndicator
        style="dateErrorHolder"
        errorsKeyPath={[pubHist, props.i, 'errors']}
        indicatorErrors={[`${pubHist} label`]}
        errorMessages={props.errorMessages}
        tooltipUtility={props.tooltipUtility}
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
            indicatorErrors={[`${peer} label`]}
            errorUtility={props.errorUtility}
            style="textAlignSelect"
            tooltip={props.tooltip && tooltips.peerReviewLabel}
            tooltipUtility={props.tooltipUtility}
            options={['Peer reviewed', 'Review Process']}/>

          <ReduxTextInput
            label='Description'
            onBlur={props.validate}
            tooltipUtility={props.tooltipUtility}
            keyPath={[peer, props.i, 'explanation']}/>
        </div>

        <ReduxErrorIndicator
          errorsKeyPath={[peer, props.i, 'errors']}
          indicatorErrors={[`${peer} label`]}
          errorMessages={props.errorMessages}
          tooltipUtility={props.tooltipUtility}
          errorUtility={props.errorUtility}/>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <ReduxTextInput
            label='URL'
            onBlur={props.validate}
            keyPath={[peer, props.i, 'href']}
            indicatorErrors={[`${peer} href`]}
            errorUtility={props.errorUtility}
            tooltipUtility={props.tooltipUtility}
            style="floatRight"/>
        </div>

        <ReduxErrorIndicator
          errorsKeyPath={[peer, props.i, 'errors']}
          indicatorErrors={[`${peer} href`]}
          errorMessages={props.errorMessages}
          tooltipUtility={props.tooltipUtility}
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
            indicatorErrors={[`${copyright} label`]}
            errorUtility={props.errorUtility}
            style="textAlignSelect"
            tooltip={props.tooltip && tooltips.copyrightLicensingUrl}
            tooltipUtility={props.tooltipUtility}
            options={['Copyright Statement', 'Licensing Information']}/>

          <ReduxTextInput
            label='Description'
            onBlur={props.validate}
            tooltipUtility={props.tooltipUtility}
            errorUtility={props.errorUtility}
            keyPath={[copyright, props.i, 'explanation']}/>
        </div>

        <ReduxErrorIndicator
          errorsKeyPath={[copyright, props.i, 'errors']}
          indicatorErrors={[`${copyright} label`]}
          errorMessages={props.errorMessages}
          tooltipUtility={props.tooltipUtility}
          errorUtility={props.errorUtility}/>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <ReduxTextInput
            label='URL'
            onBlur={props.validate}
            keyPath={[copyright, props.i, 'href']}
            indicatorErrors={[`${copyright} href`]}
            errorUtility={props.errorUtility}
            tooltipUtility={props.tooltipUtility}
            style="floatRight" />
        </div>

        <ReduxErrorIndicator
          errorsKeyPath={[copyright, props.i, 'errors']}
          indicatorErrors={[`${copyright} href`]}
          errorMessages={props.errorMessages}
          tooltipUtility={props.tooltipUtility}
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
          tooltip={props.tooltip && tooltips.suppDescription}
          tooltipUtility={props.tooltipUtility}
          keyPath={[supp, props.i, 'explanation']}/>

        <ReduxTextInput
          label='URL'
          keyPath={[supp, props.i, 'href']}
          onBlur={props.validate}
          indicatorErrors={[`${supp} href`]}
          errorUtility={props.errorUtility}
          tooltipUtility={props.tooltipUtility}/>
      </div>

      <ReduxErrorIndicator
        errorsKeyPath={[supp, props.i, 'errors']}
        indicatorErrors={[`${supp} href`]}
        errorMessages={props.errorMessages}
        tooltipUtility={props.tooltipUtility}
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
            indicatorErrors={[`${other} label`]}
            errorUtility={props.errorUtility}
            onBlur={props.validate}
            tooltip={props.tooltip && tooltips.otherLabel}
            tooltipUtility={props.tooltipUtility}/>

          <ReduxTextInput
            label='Description'
            onBlur={props.validate}
            tooltipUtility={props.tooltipUtility}
            keyPath={[other, props.i, 'explanation']}/>
        </div>

        <ReduxErrorIndicator
          errorsKeyPath={[other, props.i, 'errors']}
          indicatorErrors={[`${other} label`]}
          errorMessages={props.errorMessages}
          tooltipUtility={props.tooltipUtility}
          errorUtility={props.errorUtility}/>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <ReduxTextInput
            label='URL'
            onBlur={props.validate}
            keyPath={[other, props.i, 'href']}
            indicatorErrors={[`${other} href`]}
            errorUtility={props.errorUtility}
            tooltipUtility={props.tooltipUtility}
            style="floatRight" />
        </div>

        <ReduxErrorIndicator
          errorsKeyPath={[other, props.i, 'errors']}
          indicatorErrors={[`${other} href`]}
          errorMessages={props.errorMessages}
          tooltipUtility={props.tooltipUtility}
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
            label='Update Type *'
            onSelect={props.validate}
            keyPath={[update, props.i, 'type']}
            indicatorErrors={[`${update} type`]}
            errorUtility={props.errorUtility}
            style="textAlignSelect"
            tooltip={props.tooltip && tooltips.updateType}
            tooltipUtility={props.tooltipUtility}
            required={true}
            options={updateTypes}/>

          <ReduxDate
            label="Update Date *"
            onSelect={props.validate}
            keyPath={[update, props.i]}
            indicatorErrors={[`${update} date`]}
            errorUtility={props.errorUtility}
            tooltip={props.tooltip && tooltips.updateDate}
            tooltipUtility={props.tooltipUtility}
            activeCalendar={props.activeCalendar}
            calendarHandler={props.calendarHandler}
            required={true} />
        </div>

        <ReduxErrorIndicator
          style="dateErrorHolder"
          errorsKeyPath={[update, props.i, 'errors']}
          indicatorErrors={[`${update} type`, `${update} date`]}
          errorMessages={props.errorMessages}
          tooltipUtility={props.tooltipUtility}
          errorUtility={props.errorUtility}/>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <ReduxTextInput
            label='DOI for Update *'
            onBlur={props.validate}
            keyPath={[update, props.i, 'doi']}
            indicatorErrors={[`${update} doi`, `${update} doiInvalid`, `${update} doiNotExist`]}
            errorUtility={props.errorUtility}
            tooltip={props.tooltip && tooltips.updateDoi}
            tooltipUtility={props.tooltipUtility}
            required={true}/>
        </div>

        <ReduxErrorIndicator
          errorsKeyPath={[update, props.i, 'errors']}
          indicatorErrors={[`${update} doi`, `${update} doiInvalid`, `${update} doiNotExist`]}
          errorMessages={props.errorMessages}
          tooltipUtility={props.tooltipUtility}
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
            label='Clinical trial registry *'
            onSelect={props.validate}
            keyPath={[clinical, props.i, 'registry']}
            indicatorErrors={[`${clinical} registry`]}
            errorUtility={props.errorUtility}
            tooltip={props.tooltip && tooltips.clinicalTrialRegistry}
            tooltipUtility={props.tooltipUtility}
            required={true}
            options={Object.keys(registryDois)}/>

          <ReduxTextInput
            label="Registered trial number *"
            onBlur={props.validate}
            keyPath={[clinical, props.i, 'trialNumber']}
            indicatorErrors={[`${clinical} trialNumber`]}
            errorUtility={props.errorUtility}
            tooltip={props.tooltip && tooltips.clinicalTrialNumber}
            tooltipUtility={props.tooltipUtility}
            required={true}/>
        </div>

        <ReduxErrorIndicator
          errorsKeyPath={[clinical, props.i, 'errors']}
          indicatorErrors={[`${clinical} registry`, `${clinical} trialNumber`]}
          errorMessages={props.errorMessages}
          tooltipUtility={props.tooltipUtility}
          errorUtility={props.errorUtility}/>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <ReduxSelector
            label='Relationship of publication to trial'
            onSelect={props.validate}
            keyPath={[clinical, props.i, 'type']}
            tooltip={props.tooltip && tooltips.clinicalRelationship}
            tooltipUtility={props.tooltipUtility}
            errorUtility={props.errorUtility}
            options={['Pre-Results', 'Results', 'Post-Results']}/>
        </div>
      </div>
    </div>
  )
}
