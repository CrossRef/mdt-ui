import React, { Component } from 'react'
import is from 'prop-types'

import ReduxTextInput from './reduxTextInput'
import ReduxSelectInput from './reduxSelectInput'
import dateOptions from '../../../../utilities/date'
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

    requireHandler = (i, e) => {
      if(e.target.value) this.setState({[`require_${i}`]: true});
      else if (e.target.value === '') this.setState({[`require_${i}`]: false});
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

            <button type='button' onClick={() => this.setState({number: this.state.number+1})} className="addFields">Add</button>
          </div>
        </div>
      )
    }
  }
}

export const PublicationHistory = generateCard(pubHist, function fields (i) {
  return (
    <div key={i} className='row'>
      <div className='fieldHolder'>
        <Selector title='' keyPath={[pubHist, i, 'label']} style="dateAlignSelect" options={['', 'Received', 'Accepted', 'Published Online', 'Published Print']}/>
        <Date title="Date" keyPath={[pubHist, i]}/>
      </div>
      <div className='errorHolder'></div>
    </div>
  )
})

export const PeerReview = generateCard(peer, function fields (i) {
  return (
    <div key={i}>
      <div className='row'>
        <div className='fieldHolder'>
          <Selector title='' keyPath={[peer, i, 'label']} style="textAlignSelect" options={['', 'Peer reviewed', 'Review Process']}/>
          <TextInput title='Description' keyPath={[peer, i, 'explanation']}/>
        </div>
        <div className='errorHolder'></div>
      </div>

      <div className='row'>
      <div className='fieldHolder'>
        <TextInput title='URL' keyPath={[peer, i, 'href']} style="floatRight"/>
      </div>
      <div className='errorHolder'></div>
      </div>
    </div>
  )
})

export const Copyright = generateCard(copyright, function fields (i) {
  return (
    <div key={i}>
      <div className='row'>
        <div className='fieldHolder'>
          <Selector title='' keyPath={[copyright, i, 'label']} style="textAlignSelect" options={['', 'Copyright Statement', 'Licensing Information']}/>
          <TextInput title='Description' keyPath={[copyright, i, 'explanation']}/>
        </div>
        <div className='errorHolder'></div>
      </div>

      <div className='row'>
      <div className='fieldHolder'>
        <TextInput title='URL' keyPath={[copyright, i, 'href']} style="floatRight" />
      </div>
      <div className='errorHolder'></div>
      </div>
    </div>  
  )
})

export const SupplementaryMaterial = generateCard(supp, function fields (i) {
  return (
    <div key={i} className='row'>
      <div className='fieldHolder'>
        <TextInput title='Description' keyPath={[supp, i, 'explanation']}/>
        <TextInput title='URL' keyPath={[supp, i, 'href']} />
      </div>
      <div className='errorHolder'></div>
    </div> 
  )
})

export const Other = generateCard(other, function fields (i) {
  return (
    <div key={i}>
      <div className='row'>
        <div className='fieldHolder'>
          <TextInput title={`Label ${i+1}`} keyPath={[other, i, 'label']}/>
          <TextInput title='Description' keyPath={[other, i, 'explanation']}/>
        </div>
        <div className='errorHolder'></div>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <TextInput title='URL' keyPath={[other, i, 'href']} style="floatRight" />
        </div>
        <div className='errorHolder'></div>
      </div>
    </div>
  )
})

export const StatusUpdate = generateCard(update, function fields (i, card) {
  return (
    <div key={i}>
      <div className='row'>
        <div className='fieldHolder'>
          <Selector handler={card.requireHandler.bind(null, i)} title='Update Type (Required)' keyPath={[update, i, 'type']} style="textAlignSelect" options={['', ...updateTypes]}/>
          <Date title="Update Date" keyPath={[update, i]} required={card.state[`require_${i}`]} />
        </div>
        <div className='errorHolder'></div>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <TextInput title='DOI for Update' keyPath={[update, i, 'DOI']} required={card.state[`require_${i}`]}/>
        </div>
        <div className='errorHolder'></div>
      </div>
    </div>
  )
})

export const ClinicalTrials = generateCard(clinical, function fields (i) {
  return (
    <div key={i}>
      <div className='row'>
        <div className='fieldHolder'>
          <Selector
            title='Clinical trial registry (Required)'
            keyPath={[clinical, i, 'registry']}
            required={true}
            options={['', ...Object.keys(registryDois)]}/>
          <TextInput title="Registered trial number (Required)" keyPath={[clinical, i, 'trialNumber']} required={true}/>
        </div>
        <div className='errorHolder'></div>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <Selector title='Relationship of publication to trial' keyPath={[clinical, i, 'type']} options={['', 'Pre-Results', 'Results', 'Post-Results']}/>
        </div>
        <div className='errorHolder'></div>
      </div>
    </div>
  )
})


const TextInput = ({title, name, keyPath, number, style, required}) =>
  <div className={`fieldinnerholder halflength ${style}`}>
    <div className='labelholder'>
      <div className='labelinnerholder'>
        <div className='label'>{title}</div>
      </div>
    </div>
    <div className='requrefieldholder'>
      <div className={`requiredholder ${!required ? 'norequire' : ''}`}>
        <div className='required height32'>
          {required && <span>*</span>}
        </div>
      </div>
      <div className='field'>
        <ReduxTextInput
          name={name} keyPath={keyPath} className="height32"/>
      </div>
    </div>
  </div>


const Selector = ({ title, name, keyPath, number, style, handler, required, options=['', 1,2,3]}) =>
  <div className={`fieldinnerholder halflength ${style}`}>
    <div className='labelholder'>
      <div className='labelinnerholder'>
        <div className='label'>{title}</div>
      </div>
    </div>
    <div className='requrefieldholder'>
      <div className={`requiredholder ${!required ? 'norequire' : ''}`}>
        <div className='required height32'>
          {required && <span>*</span>}
        </div>
      </div>
      <div className='field'>
        <ReduxSelectInput
          handler={handler} name={name} keyPath={keyPath} className='height32' options={options}/>
      </div>
    </div>
  </div>



class Date extends Component {
  state = { month: '' }

  render() {
    const { title, name, required } = this.props;
    return (
      <div className='fieldinnerholder halflength'>
        <div className='labelholder'>
          <div className='labelinnerholder'>
            <div className='label'>{title}</div>
          </div>
        </div>
        <div className='requrefieldholder'>
          <div className={`requiredholder adjustDateRequire ${!required ? 'norequire' : ''}`}>
            <div className='required height32'>{required && <span>*</span>}</div>
          </div>
          <div className='field'>
            <div className='datepickerholder'>
              <div className='dateselectholder'>
                <div>Year</div>
                <ReduxSelectInput
                  name={`${name}_year`}
                  keyPath={[...this.props.keyPath, 'year']}
                  className="height32"
                  options={dateOptions.years}/>
              </div>
              <div className='dateselectholder'>
                <div>Month</div>
                <ReduxSelectInput
                  name={`${name}_month`}
                  keyPath={[...this.props.keyPath, 'month']}
                  className="height32"
                  handler={(e)=>this.setState({month:e.target.value})}
                  options={dateOptions.months}/>
              </div>
              <div className='dateselectholder'>
                <div>Day</div>
                <ReduxSelectInput
                  name={`${name}_day`}
                  keyPath={[...this.props.keyPath, 'day']}
                  className="height32"
                  options={dateOptions[this.state.month]}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}