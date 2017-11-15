import React, { Component } from 'react'
import is from 'prop-types'

import TextInput from './reduxTextInput'
import Selector from './reduxSelectInput'
import Date from './reduxDate'
import { registryDois, updateTypes, cardNames } from '../../../../utilities/crossmarkHelpers'
const { pubHist, peer, update, copyright, clinical, supp, other } = cardNames;
import {articleTooltips as tooltips} from '../../../../utilities/lists/tooltipMessages'




function generateCard (name, fields) {
  return class CrossmarkCard extends Component {
    static propTypes = {
      number: is.number.isRequired,
      remove: is.func.isRequired,
      cardName: is.string.isRequired,
      tooltip: is.oneOfType([is.string, is.bool]),
      deferredTooltipBubbleRefresh: is.object
    }

    state={ number: this.props.number || 0 }


    renderFields = () => {
      let fieldArray = [];
      let i = 0;
      while (i <= this.state.number) {
        fieldArray.push(fields(i.toString(), this)); i++
      }
      return fieldArray
    }


    addFields = () => {
      this.setState({number: this.state.number+1}, () => {
        this.props.deferredErrorBubbleRefresh.resolve()
        this.props.deferredTooltipBubbleRefresh.resolve()
      })
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
          style="dateAlignSelect"
          tooltip={card.props.tooltip && tooltips.publicationHistory}
          deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
          options={['Received', 'Accepted', 'Published Online', 'Published Print']}/>

        <Date
          label="Date"
          onSelect={card.props.validate}
          deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
          tooltip={card.props.tooltip && tooltips.publicationHistory}
          keyPath={[pubHist, i]}/>
      </div>
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
            style="textAlignSelect"
            tooltip={card.props.tooltip && tooltips.peerReview}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            options={['Peer reviewed', 'Review Process']}/>

          <TextInput
            label='Description'
            onBlur={card.props.validate}
            tooltip={card.props.tooltip && tooltips.peerReview}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            keyPath={[peer, i, 'explanation']}/>
        </div>
      </div>

      <div className='row'>
      <div className='fieldHolder'>
        <TextInput
          label='URL'
          onBlur={card.props.validate}
          keyPath={[peer, i, 'href']}
          tooltip={card.props.tooltip && tooltips.peerReview}
          deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
          style="floatRight"/>
      </div>
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
            style="textAlignSelect"
            tooltip={card.props.tooltip && tooltips.copyrightLicensing}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            options={['Copyright Statement', 'Licensing Information']}/>

          <TextInput
            label='Description'
            onBlur={card.props.validate}
            tooltip={card.props.tooltip && tooltips.copyrightLicensing}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            keyPath={[copyright, i, 'explanation']}/>
        </div>
      </div>

      <div className='row'>
      <div className='fieldHolder'>
        <TextInput
          label='URL'
          onBlur={card.props.validate}
          keyPath={[copyright, i, 'href']}
          tooltip={card.props.tooltip && tooltips.copyrightLicensing}
          deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
          style="floatRight" />
      </div>
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
          keyPath={[supp, i, 'explanation']}/>

        <TextInput
          label='URL'
          onBlur={card.props.validate}
          keyPath={[supp, i, 'href']} />
      </div>
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
            onBlur={card.props.validate}
            tooltip={card.props.tooltip && tooltips.other}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            keyPath={[other, i, 'label']}/>

          <TextInput
            label='Description'
            onBlur={card.props.validate}
            tooltip={card.props.tooltip && tooltips.other}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            keyPath={[other, i, 'explanation']}/>
        </div>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <TextInput
            label='URL'
            onBlur={card.props.validate}
            keyPath={[other, i, 'href']}
            tooltip={card.props.tooltip && tooltips.other}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            style="floatRight" />
        </div>
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
            style="textAlignSelect"
            tooltip={card.props.tooltip && tooltips.update}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            required={true}
            options={updateTypes}/>

          <Date
            label="Update Date"
            onSelect={card.props.validate}
            keyPath={[update, i]}
            tooltip={card.props.tooltip && tooltips.update}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            required={true} />
        </div>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <TextInput
            label='Original DOI updated'
            onBlur={card.props.validate}
            keyPath={[update, i, 'DOI']}
            tooltip={card.props.tooltip && tooltips.update}
            deferredTooltipBubbleRefresh={card.props.deferredTooltipBubbleRefresh}
            required={true}/>
        </div>
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
            required={true}
            options={Object.keys(registryDois)}/>

          <TextInput
            label="Registered trial number (Required)"
            onBlur={card.props.validate}
            keyPath={[clinical, i, 'trialNumber']}
            required={true}/>
        </div>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <Selector
            label='Relationship of publication to trial'
            onSelect={card.props.validate}
            keyPath={[clinical, i, 'type']}
            options={['Pre-Results', 'Results', 'Post-Results']}/>
        </div>
      </div>
    </div>
  )
})
