import React, { Component } from 'react'
import is from 'prop-types'

import TextInput from './reduxTextInput'
import Selector from './reduxSelectInput'
import Date from './reduxDate'
import { registryDois, updateTypes, cardNames } from '../../../../utilities/crossmarkHelpers'
const { pubHist, peer, update, copyright, clinical, supp, other } = cardNames;


export class Blank extends Component {
  render() {
    return(
      <div className='optionalissueiinfo'>
        <div className='innerCardHolder'>
          <div className='row subItemRow'>
            <div className='subItemHeader subItemTitle'>
              <span>Please add a card</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function generateCard (name, fields) {
  return class CrossmarkCard extends Component {
    static propTypes = {
      number: is.number.isRequired,
      remove: is.func.isRequired
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
      this.setState({number: this.state.number+1}, () => this.props.deferredErrorBubbleRefresh.resolve())
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
                <a onClick={this.props.remove}>Remove</a>
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
          tooltip={card.props.tooltip}
          options={['Received', 'Accepted', 'Published Online', 'Published Print']}/>

        <Date
          label="Date"
          onSelect={card.props.validate}
          tooltip={card.props.tooltip}
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
            tooltip={card.props.tooltip}
            options={['Peer reviewed', 'Review Process']}/>

          <TextInput
            label='Description'
            onBlur={card.props.validate}
            tooltip={card.props.tooltip}
            keyPath={[peer, i, 'explanation']}/>
        </div>
      </div>

      <div className='row'>
      <div className='fieldHolder'>
        <TextInput
          label='URL'
          onBlur={card.props.validate}
          keyPath={[peer, i, 'href']}
          tooltip={card.props.tooltip}
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
            tooltip={card.props.tooltip}
            options={['Copyright Statement', 'Licensing Information']}/>

          <TextInput
            label='Description'
            onBlur={card.props.validate}
            tooltip={card.props.tooltip}
            keyPath={[copyright, i, 'explanation']}/>
        </div>
      </div>

      <div className='row'>
      <div className='fieldHolder'>
        <TextInput
          label='URL'
          onBlur={card.props.validate}
          keyPath={[copyright, i, 'href']}
          tooltip={card.props.tooltip}
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
          tooltip={card.props.tooltip}
          keyPath={[supp, i, 'explanation']}/>

        <TextInput
          label='URL'
          onBlur={card.props.validate}
          tooltip={card.props.tooltip}
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
            tooltip={card.props.tooltip}
            keyPath={[other, i, 'label']}/>

          <TextInput
            label='Description'
            onBlur={card.props.validate}
            tooltip={card.props.tooltip}
            keyPath={[other, i, 'explanation']}/>
        </div>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <TextInput
            label='URL'
            onBlur={card.props.validate}
            keyPath={[other, i, 'href']}
            tooltip={card.props.tooltip}
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
            tooltip={card.props.tooltip}
            required={true}
            options={updateTypes}/>

          <Date
            label="Update Date"
            onSelect={card.props.validate}
            keyPath={[update, i]}
            tooltip={card.props.tooltip}
            required={true} />
        </div>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <TextInput
            label='Original DOI updated'
            onBlur={card.props.validate}
            keyPath={[update, i, 'DOI']}
            tooltip={card.props.tooltip}
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
            tooltip={card.props.tooltip}
            options={Object.keys(registryDois)}/>

          <TextInput
            label="Registered trial number (Required)"
            onBlur={card.props.validate}
            keyPath={[clinical, i, 'trialNumber']}
            tooltip={card.props.tooltip}
            required={true}/>
        </div>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <Selector
            label='Relationship of publication to trial'
            onSelect={card.props.validate}
            keyPath={[clinical, i, 'type']}
            tooltip={card.props.tooltip}
            options={['Pre-Results', 'Results', 'Post-Results']}/>
        </div>
      </div>
    </div>
  )
})
