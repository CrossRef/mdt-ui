import React, { Component } from 'react'

import ReduxTextInput from './reduxTextInput'
import ReduxSelectInput from './reduxSelectInput'
import dateOptions from '../../../utilities/date'
import { registryDois, updateTypes } from '../../../utilities/crossmarkHelpers'


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
  return class crossmarkCard extends Component {
    state={ number: this.props.number || 0 }

    renderFields = () => {
      const errors = this.props.errors || {};

      let fieldArray = [];
      let i = 0;
      while (i <= this.state.number) {
        fieldArray.push(fields(i, errors, this)); i++
      } return fieldArray
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

export const PublicationHistory = generateCard('Publication History', function fields (i, errors) {
  return (
    <div key={i} className='row'>
      <div className='fieldHolder'>
        <Selector title='' name={`pubHist_${i}_label`} style="dateAlignSelect" options={['', 'Received', 'Accepted', 'Published Online', 'Published Print']}/>
        <Date title="Date" name={`pubHist_${i}`}/>
      </div>
      <div className='errorHolder'></div>
    </div>
  )
})

export const PeerReview = generateCard('Peer Review', function fields (i, errors) {
  return (
    <div key={i}>
      <div className='row'>
        <div className='fieldHolder'>
          <Selector title='' name={`peer_${i}_label`} style="textAlignSelect" options={['', 'Peer reviewed', 'Review Process']}/>
          <TextInput title='Description' name={`peer_${i}_explanation`}/>
        </div>
        <div className='errorHolder'></div>
      </div>

      <div className='row'>
      <div className='fieldHolder'>
        <TextInput title='URL' name={`peer_${i}_href`} style="floatRight" error={errors[`peer_${i}_href`]}/>
      </div>
      <div className='errorHolder'></div>
      </div>
    </div>
  )
})

export const Copyright = generateCard('Copyright & Licensing', function fields (i, errors) {
  return (
    <div key={i}>
      <div className='row'>
        <div className='fieldHolder'>
          <Selector title='' name={`copyright_${i}_label`} style="textAlignSelect" options={['', 'Copyright Statement', 'Licensing Information']}/>
          <TextInput title='Description' name={`copyright_${i}_explanation`}/>
        </div>
        <div className='errorHolder'></div>
      </div>

      <div className='row'>
      <div className='fieldHolder'>
        <TextInput title='URL' name={`copyright_${i}_href`} style="floatRight" error={errors[`copyright_${i}_href`]}/>
      </div>
      <div className='errorHolder'></div>
      </div>
    </div>  
  )
})

export const SupplementaryMaterial = generateCard('Supplementary Material', function fields (i, errors) {
  return (
    <div key={i} className='row'>
      <div className='fieldHolder'>
        <TextInput title='Description' name={`supp_${i}_explanation`}/>
        <TextInput title='URL' name={`supp_${i}_href`} error={errors[`supp_${i}_href`]}/>
      </div>
      <div className='errorHolder'></div>
    </div> 
  )
})

export const Other = generateCard('Other', function fields (i, errors) {
  return (
    <div key={i}>
      <div className='row'>
        <div className='fieldHolder'>
          <TextInput title={`Label ${i+1}`} name={`other_${i}_label`}/>
          <TextInput title='Description' name={`other_${i}_explanation`}/>
        </div>
        <div className='errorHolder'></div>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <TextInput title='URL' name={`other_${i}_href`} style="floatRight" error={errors[`other_${i}_href`]}/>
        </div>
        <div className='errorHolder'></div>
      </div>
    </div>
  )
})

export const StatusUpdate = generateCard('Status Update', function fields (i, errors, card) {
  return (
    <div key={i}>
      <div className='row'>
        <div className='fieldHolder'>
          <Selector handler={card.requireHandler.bind(null, i)} title='Update Type (Required)' name={`update_${i}_type`} style="textAlignSelect" options={['', ...updateTypes]}/>
          <Date title="Update Date" name={`update_${i}`} required={card.state[`require_${i}`]} error={errors[`update_${i}_year`]}/>
        </div>
        <div className='errorHolder'></div>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <TextInput title='DOI for Update' name={`update_${i}_DOI`} required={card.state[`require_${i}`]} error={errors[`update_${i}_DOI_Invalid`] || errors[`update_${i}_DOI_Missing`]}/>
        </div>
        <div className='errorHolder'></div>
      </div>
    </div>
  )
})

export const ClinicalTrials = generateCard('Linked Clinical Trials', function fields (i, errors) {
  return (
    <div key={i}>
      <div className='row'>
        <div className='fieldHolder'>
          <Selector
            title='Clinical trial registry (Required)'
            name={`clinical_${i}_registry`} required={true}
            error={errors[`clinical_${i}_registry`]}
            options={['', ...Object.keys(registryDois)]}/>
          <TextInput title="Registered trial number (Required)" name={`clinical_${i}_trialNumber`} required={true} error={errors[`clinical_${i}_trialNumber`]}/>
        </div>
        <div className='errorHolder'></div>
      </div>

      <div className='row'>
        <div className='fieldHolder'>
          <Selector title='Relationship of publication to trial' name={`clinical_${i}_type`} options={['', 'Pre-Results', 'Results', 'Post-Results']}/>
        </div>
        <div className='errorHolder'></div>
      </div>
    </div>
  )
})


const TextInput = ({title, name, number, style, required, error}) =>
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
          name={name} className={`height32${error ? ' fieldError' : ''}`}/>
      </div>
    </div>
  </div>


const Selector = ({ title, name, number, style, handler, required, error, options=['', 1,2,3]}) =>
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
          handler={handler} name={name} className={`height32${error ? ' fieldError' : ''}`} options={options}/>
      </div>
    </div>
  </div>



class Date extends Component {
  state = { month: '' }

  render() {
    const { title, name, number, required, error } = this.props;
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
                  className={`height32 datepickselects ${error ? 'fieldError' : ''}`}
                  options={dateOptions.years}/>
              </div>
              <div className='dateselectholder'>
                <div>Month</div>
                <ReduxSelectInput
                  name={`${name}_month`}
                  className={`height32 datepickselects ${error ? 'fieldError' : ''}`}
                  handler={(e)=>this.setState({month:e.target.value})}
                  options={dateOptions.months}/>
              </div>
              <div className='dateselectholder'>
                <div>Day</div>
                <ReduxSelectInput
                  name={`${name}_day`}
                  className={`height32 datepickselects ${error ? 'fieldError' : ''}`}
                  options={dateOptions[this.state.month]}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
