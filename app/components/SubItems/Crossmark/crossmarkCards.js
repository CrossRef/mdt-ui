import React, { Component } from 'react'

import ReduxTextInput from './reduxTextInput'
import ReduxSelectInput from './reduxSelectInput'


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

export class PublicationHistory extends Component {
  render() {
    return(
      <div className='optionalissueiinfo'>
        <div className='innerCardHolder'>
          <div className='row subItemRow'>

            <div className='subItemHeader subItemTitle'>
              <span>Publication History</span>
            </div>

            <div className='subItemHeader subItemButton'>
              <a onClick={this.props.remove}>Remove</a>
            </div>
          </div>

          <div className='row'>
            <div className='fieldHolder'>
              <Selector title='' name="pubHistSelect1" style="dateAlignSelect"/>
              <Date title="Date" name="pubHistDate1"/>
            </div>
            <div className='errorHolder'></div>
          </div>

          <div className='row'>
            <div className='fieldHolder'>
              <Selector title='' name="pubHistSelect2" style="dateAlignSelect"/>
              <Date title="Date" name="pubHistDate2"/>
            </div>
            <div className='errorHolder'></div>
          </div>
        </div>
      </div>
    )
  }
}

export class PeerReview extends Component {
  render() {
    return(
      <div className='optionalissueiinfo'>
        <div className='innerCardHolder'>
          <div className='row subItemRow'>

            <div className='subItemHeader subItemTitle'>
              <span>Peer Review</span>
            </div>

            <div className='subItemHeader subItemButton'>
              <a onClick={this.props.remove}>Remove</a>
            </div>
          </div>

          <div className='row'>
            <div className='fieldHolder'>
              <Selector title='' name="peerReviewSelect1" style="textAlignSelect"/>
              <TextInput title='Description' name="peerReviewDescription1" />
            </div>
            <div className='errorHolder'></div>
          </div>

          <div className='row'>
            <div className='fieldHolder'>
              <TextInput title='URL' name="peerReviewUrl1" style="floatRight"/>
            </div>
            <div className='errorHolder'></div>
          </div>

          <div className='row'>
            <div className='fieldHolder'>
              <Selector title='' name="peerReviewSelect2" style="textAlignSelect"/>
              <TextInput title='Description' name="peerReviewDescription2"/>
            </div>
            <div className='errorHolder'></div>
          </div>

          <div className='row'>
            <div className='fieldHolder'>
              <TextInput title='URL' name="peerReviewUrl1" style="floatRight"/>
            </div>
            <div className='errorHolder'></div>
          </div>
        </div>
      </div>
    )
  }
}

export class Copyright extends Component {
  render() {
    return(
      <div className='optionalissueiinfo'>
        <div className='innerCardHolder'>
          <div className='row subItemRow'>

            <div className='subItemHeader subItemTitle'>
              <span>Copyright & Licensing</span>
            </div>

            <div className='subItemHeader subItemButton'>
              <a onClick={this.props.remove}>Remove</a>
            </div>
          </div>

          <div className='row'>
            <div className='fieldHolder'>
              <Selector title='' name="peerReviewSelect1" style="textAlignSelect"/>
              <TextInput title='Description' name="copyrightDescription1" />
            </div>
            <div className='errorHolder'></div>
          </div>

          <div className='row'>
            <div className='fieldHolder'>
              <TextInput title='URL' name="copyrightUrl1" style="floatRight"/>
            </div>
            <div className='errorHolder'></div>
          </div>

          <div className='row'>
            <div className='fieldHolder'>
              <Selector title='' name="copyrightSelect2" style="textAlignSelect"/>
              <TextInput title='Description' name="copyrightDescription2"/>
            </div>
            <div className='errorHolder'></div>
          </div>

          <div className='row'>
            <div className='fieldHolder'>
              <TextInput title='URL' name="copyrightUrl2" style="floatRight"/>
            </div>
            <div className='errorHolder'></div>
          </div>
        </div>
      </div>
    )
  }
}

export class SupplementaryMaterial extends Component {
  render() {
    return(
      <div className='optionalissueiinfo'>
        <div className='innerCardHolder'>
          <div className='row subItemRow'>

            <div className='subItemHeader subItemTitle'>
              <span>Supplementary Material</span>
            </div>

            <div className='subItemHeader subItemButton'>
              <a onClick={this.props.remove}>Remove</a>
            </div>
          </div>

          <div className='row'>
            <div className='fieldHolder'>
              <TextInput title='Description' name="peerReviewDescription1" />
              <TextInput title='URL' name="peerReviewUrl1" />
            </div>
            <div className='errorHolder'></div>
          </div>
        </div>
      </div>
    )
  }
}

export class Other extends Component {
  render() {
    return(
      <div className='optionalissueiinfo'>
        <div className='innerCardHolder'>
          <div className='row subItemRow'>

            <div className='subItemHeader subItemTitle'>
              <span>Other</span>
            </div>

            <div className='subItemHeader subItemButton'>
              <a onClick={this.props.remove}>Remove</a>
            </div>
          </div>

          <div className='row'>
            <div className='fieldHolder'>
              <TextInput title='Label 1' name="otherLabel1" />
              <TextInput title='URL' name="otherDescription1" />
            </div>
            <div className='errorHolder'></div>
          </div>

          <div className='row'>
            <div className='fieldHolder'>
              <TextInput title='URL' name="otherUrl1" style="floatRight"/>
            </div>
            <div className='errorHolder'></div>
          </div>
        </div>
      </div>
    )
  }
}

export class StatusUpdate extends Component {
  render() {
    return(
      <div className='optionalissueiinfo'>
        <div className='innerCardHolder'>
          <div className='row subItemRow'>

            <div className='subItemHeader subItemTitle'>
              <span>Status Update</span>
            </div>

            <div className='subItemHeader subItemButton'>
              <a onClick={this.props.remove}>Remove</a>
            </div>
          </div>

          <div className='row'>
            <div className='fieldHolder'>
              <Selector title='Update Type (Required)' name="statusUpdateSelect1" style="textAlignSelect"/>
              <Date title="Update Date" name="statusUpdateDate1"/>
            </div>
            <div className='errorHolder'></div>
          </div>

          <div className='row'>
            <div className='fieldHolder'>
              <TextInput title='DOI for Update (Required)' name="statusUpdateInput1"/>
            </div>
            <div className='errorHolder'></div>
          </div>
        </div>
      </div>
    )
  }
}

export class ClinicalTrials extends Component {
  render() {
    return(
      <div className='optionalissueiinfo'>
        <div className='innerCardHolder'>
          <div className='row subItemRow'>

            <div className='subItemHeader subItemTitle'>
              <span>Linked Clinical Trials</span>
            </div>

            <div className='subItemHeader subItemButton'>
              <a onClick={this.props.remove}>Remove</a>
            </div>
          </div>

          <div className='row'>
            <div className='fieldHolder'>
              <Selector title='Clinical trial registry (Required)' name="clinicalTrialsSelect1" />
              <TextInput title="Registered trial number (Required)" name="Registered trial number (Required)"/>
            </div>
            <div className='errorHolder'></div>
          </div>

          <div className='row'>
            <div className='fieldHolder'>
              <Selector title='Relationship of publication to trial' name="clinicalTrialsSelect2"/>
            </div>
            <div className='errorHolder'></div>
          </div>
        </div>
      </div>
    )
  }
}




const TextInput = ({title, name, style}) =>
  <div className={`fieldinnerholder halflength ${style}`}>
    <div className='labelholder'>
      <div className='labelinnerholder'>
        <div className='label'>{title}</div>
      </div>
    </div>
    <div className='requrefieldholder'>
      <div className='requiredholder norequire'>
        <div className='required height32'>
        </div>
      </div>
      <div className='field'>
        <ReduxTextInput
          name={name} className="height32"
        />
      </div>
    </div>
  </div>


const Selector = ({ title, name, style, options=['', 1,2,3] }) =>
  <div className={`fieldinnerholder halflength ${style}`}>
    <div className='labelholder'>
      <div className='labelinnerholder'>
        <div className='label'>{title}</div>
      </div>
    </div>
    <div className='requrefieldholder'>
      <div className='requiredholder norequire'>
        <div className='required height32'>
        </div>
      </div>
      <div className='field'>
        <ReduxSelectInput
          name={name} className="height32" options={options}/>
      </div>
    </div>
  </div>



const Date = ({title, name}) =>
  <div className='fieldinnerholder halflength'>
    <div className='labelholder'>
      <div className='labelinnerholder'>
        <div className='label'>{title}</div>
      </div>
    </div>
    <div className='requrefieldholder'>
      <div className='requiredholder norequire'>
        <div className='required height32'>
        </div>
      </div>
      <div className='field'>
        <div className='datepickerholder'>
          <div className='dateselectholder'>
            <div>Year</div>
            <ReduxSelectInput
              name={`${name}Year`} className="height32 datepickselects" options={['', '2017', '2016', '2015']}/>
          </div>
          <div className='dateselectholder'>
            <div>Month</div>
            <ReduxSelectInput
              name={`${name}Month`} className="height32 datepickselects" options={['', 'January', 'February', 'March']}/>
          </div>
          <div className='dateselectholder'>
            <div>Day</div>
            <ReduxSelectInput
              name={`${name}Day`} className="height32 datepickselects" options={['', 1,2,3,4]}/>
          </div>
          <div>
          </div>
        </div>
      </div>
    </div>
  </div>
