import React, { Component } from 'react'
import Switch from 'react-toggle-switch'
import { stateTrackerII } from 'my_decorators'

const Languages = require('../../../utilities/language.json')
import { ArchiveLocations } from '../../../utilities/archiveLocations'

const PublicationTypes = require('../../../utilities/publicationTypes.json')


export default class AdditionalInformation extends Component {
  constructor (props) {
    super(props)
    const {handler, addInfo, makeDateDropDown} = this.props
    this.state = {
      handler: handler,
      addInfo: addInfo,
      makeDateDropDown: makeDateDropDown,
      on: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      addInfo: nextProps.addInfo
    })
  }

  componentWillMount () {
    if (this.state.addInfo.freetolicense === 'yes') {
        this.setState({
            on: true
        })
    }
  }

  displayLanguages () {
      var languages = [
        <option key='-1'></option>,
        ...Languages.map((language, i) => (<option key={i} value={language.abbr}>{language.name}</option>))
      ]

      return (
          <select
            ref='language'
            onChange={() => {this.state.handler(this)}}
            className='height32'
            value={this.state.addInfo.language}
            >
              {languages}
          </select>
      )
  }

  displayArchiveLocations () {
      var locations = [
        <option key='-1'></option>,
        ...ArchiveLocations.map((location, i) => (<option key={i} value={location.value}>{location.name}</option>))
      ]

      return (
          <select
            ref='archiveLocation'
            onChange={() => {this.state.handler(this)}}
            className='height32'
            value={this.state.addInfo.archiveLocation}
            >
              {locations}
          </select>
      )
  }

  displayPublicationTypes () {
      var publicationType = [
        <option key='-1'></option>,
        ...PublicationTypes.map((pubtype, i) => (<option key={i} value={pubtype.value}>{pubtype.name}</option>))
      ]

      return (
          <select
            ref='publicationType'
            onChange={() => {this.state.handler(this)}}
            className='height32'
            value={this.state.addInfo.publicationType}
            >
              {publicationType}
          </select>
      )
  }

  render () {
    return (
        <div className='noAddable'>
            <div>
                <div className='row'>
                    <div className='fieldHolder'>
                        <div className='fieldinnerholder halflength'>
                            <div className='labelholder'>
                                <div></div>
                                <div className='labelinnerholder'>
                                    <div className='label'>Similarity Check URL</div>
                                </div>
                            </div>
                            <div className='requrefieldholder'>
                                <div className='requiredholder norequire'>
                                    <div className='required height32'>
                                    </div>
                                </div>
                                <div className='field'>
                                    <input
                                        className='height32'
                                        type='text'
                                        ref='similarityCheckURL'
                                        onChange={() => {this.state.handler(this)}}
                                        value={this.state.addInfo.similarityCheckURL}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='fieldinnerholder halflength'>
                            <div className='labelholder'>
                                <div></div>
                                <div className='labelinnerholder'>
                                    <div className='label'>Archive Location</div>
                                </div>
                            </div>
                            <div className='requrefieldholder'>
                                <div className='requiredholder norequire'>
                                    <div className='required height32'>
                                    </div>
                                </div>
                                <div className='field'>
                                    {this.displayArchiveLocations()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='errorHolder'>
                    </div>
                </div>
                <div className='row'>
                    <div className='fieldHolder'>
                        <div className='fieldinnerholder halflength'>
                            <div className='labelholder'>
                                <div></div>
                                <div className='labelinnerholder'>
                                    <div className='label'>Language</div>
                                </div>
                            </div>
                            <div className='requrefieldholder'>
                                <div className='requiredholder norequire'>
                                    <div className='required height32'>
                                    </div>
                                </div>
                                <div className='field'>
                                    {this.displayLanguages()}
                                </div>
                            </div>
                        </div>
                        <div className='fieldinnerholder halflength'>
                            <div className='labelholder'>
                                <div></div>
                                <div className='labelinnerholder'>
                                    <div className='label'>Publication Type</div>
                                </div>
                            </div>
                            <div className='requrefieldholder'>
                                <div className='requiredholder norequire'>
                                    <div className='required height32'>
                                    </div>
                                </div>
                                <div className='field'>
                                    {this.displayPublicationTypes()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='errorHolder'>
                    </div>
                </div>
                <div className='row'>
                    <div className='fieldHolder'>
                        <div className='fieldinnerholder halflength'>
                            <div className='labelholder'>
                                <div></div>
                                <div className='labelinnerholder'>
                                    <div className='label'>&nbsp;</div>
                                </div>
                            </div>
                            <div className='requrefieldholder'>
                                <div className='field'>
                                    <div className='switchOuterHolder'>
                                        <div className='switchInnerHolder'>
                                            <div>&nbsp;</div>
                                            <div className='switchLicense'>
                                                <div className='switchLabel'><span>Free to License</span></div>
                                                <Switch
                                                    ref='freetolicense'
                                                    onClick={() => {
                                                        this.setState({on: !this.state.on}, ()=>{
                                                            this.state.handler(this)
                                                        })
                                                    }}
                                                    on={this.state.on}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className='errorHolder'>
                    </div>
                </div>
        </div>
    )
  }
}
