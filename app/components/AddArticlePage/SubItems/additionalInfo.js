import React, { Component } from 'react'
import update from 'immutability-helper'

const Languages = require('../../../utilities/lists/language.json')
import { ArchiveLocations } from '../../../utilities/lists/archiveLocations'

export default class AdditionalInformation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      on: false
    }
  }

  componentWillMount () {
    if (this.props.addInfo.freetolicense) {
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
            onChange={this.handleAddInfo}
            className='height32'
            value={this.props.addInfo.language}
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
            onChange={this.handleAddInfo}
            className='height32'
            value={this.props.addInfo.archiveLocation}
            >
              {locations}
          </select>
      )
  }

  handleAddInfo = () => {
    this.props.handler({
      addInfo: update(this.props.addInfo, {$set:{
        archiveLocation: this.refs.archiveLocation.value,
        language: this.refs.language.value,
        similarityCheckURL: this.refs.similarityCheckURL.value,
      }})
    })
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
                                        className={`height32 ${this.props.simCheckError && 'fieldError'}`}
                                        type='text'
                                        ref='similarityCheckURL'
                                        onChange={this.handleAddInfo}
                                        value={!!this.props.addInfo.similarityCheckURL?this.props.addInfo.similarityCheckURL:'http://'}
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
                    </div>
                    <div className='errorHolder'>
                    </div>
                </div>
            </div>
        </div>
    )
  }
}
