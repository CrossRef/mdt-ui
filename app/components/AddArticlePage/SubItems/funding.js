import React, { Component } from 'react'
import update from 'immutability-helper'
import Autosuggest from 'react-autosuggest'

import {routes} from '../../../routing'
import {refreshErrorBubble, refreshStickyError} from '../../../utilities/helpers'





export default class Funding extends Component {
  constructor (props) {
    super(props)
    const {funding} = this.props
    this.state = {
      showSubItem: true,
      suggestions: [],
      funderName: funding.funderName || '',
      funder_identifier: funding.funder_identifier.trim().length ? funding.funder_identifier : '',
      isLoading: false,
      grantNumbers: funding.grantNumbers.length > 0 ? funding.grantNumbers : ['']
    }
  }

  componentDidUpdate () {
    this.props.deferredErrorBubbleRefresh.resolve()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showSubItem: nextProps.validating ? true : this.state.showSubItem,
      funder_identifier: nextProps.funding.funder_identifier,
      grantNumbers: nextProps.funding.grantNumbers
    })
  }

  getSuggestionValue = (suggestion) => {
    return suggestion
  }

  renderSuggestion = (suggestion) => {
    return (
      <span>{suggestion.name}&nbsp;&nbsp;&nbsp;<span className="funderLocation">{suggestion.location}</span></span>
    );
  }

  onChange = (e, {newValue}) => {
    if (newValue.uri || newValue === '') {
      const event = {
        target: {
          name: 'funderName',
          funderName: newValue.name,
          uri: newValue.uri || ''
        }
      }
      this.handleFunding(event)
      this.setState({
        funderName: newValue.name || '',
        funder_identifier: newValue.uri || ''
      })
    } else {
      this.setState({
        funderName: newValue
      })
    }
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      isLoading: true
    });

    fetch(`https://api.crossref.org/funders?query=${value}`)
      .then((response) => {
        return response.json();
      })
      .then((stories) => {
        this.setState({
          isLoading: false,
          suggestions: stories.message.items
        });
      })
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  toggle = () => {
      this.setState({
        showSubItem: !this.state.showSubItem
      })
  }

  addGrant = () => {
    this.props.handler({
     funding: update(this.props.data, {[this.props.index]: {grantNumbers: {$push: ['']}}})
    })
  }

  removeGrant = (grantIndex) => {
    this.props.handler({
      funding: update(this.props.data, {[this.props.index]: {grantNumbers: {$splice: [[grantIndex, 1]]}}})
    })
  }

  handleFunding = (e) => {
    const funder = {
      funderName: this.props.funding.funderName,
      funder_identifier: this.state.funder_identifier,
      grantNumbers: this.state.grantNumbers
    }

    if(e.target.name === 'funderName') {
      funder.funder_identifier = e.target.uri;
      funder.funderName = e.target.funderName
    } else if (e.target.name === 'grantNumber') {
      const grants = [];
      for (const i in this.refs) {
        grants.push(this.refs[i].value)
      }
      funder.grantNumbers = grants
    } else {
      funder[e.target.name] = e.target.value
    }

    this.props.handler({
      funding: update(this.props.data, {[this.props.index]: {$set: funder }})
    })
  }

  displayGrants () {
      var renderRet = [
        ...this.state.grantNumbers.map((grantNumber, i) => (
          <div className='grantSection' key={i} >
            <div className='grantTitle'>Grant Number {i + 1}</div>
            <div className="grantRow">
              <input
                  className='height32 grantInput'
                  type='text'
                  ref={'grantNumbers_'+i}
                  name="grantNumber"
                  onChange={this.handleFunding}
                  value={grantNumber}
              />
              {i > 0 &&
                  <div className='grantRemove'><a onClick={() => this.removeGrant(i)}>Remove</a></div>
              }
            </div>
          </div>
        ))
      ];
      return renderRet
  }

  render () {
    return (
        <div>
            <div className='row subItemRow' onClick={this.toggle}>
                <div className='subItemHeader subItemTitle'>
                    <span className={'arrowHolder' + (this.state.showSubItem ? ' openArrowHolder' : '')}>
                        <img src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
                    </span>
                    <span>Funder {this.props.index + 1}</span>
                </div>
                {this.props.index > 0 &&
                    <div className='subItemHeader subItemButton'>
                        <a onClick={() => {this.props.remove(this.props.index)}}>Remove</a>
                    </div>
                }
            </div>
            {this.state.showSubItem &&
                <div>
                    <br/><br/>
                    <div className='row'>
                        <div className='fieldHolder'>
                            <div className='fieldinnerholder fulllength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>Funder Name {this.props.index + 1}</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className='requiredholder norequire'>
                                        <div className='required height32'>
                                        </div>
                                    </div>
                                  <div className='field'>
                                    <Autosuggest
                                      renderSuggestion={this.renderSuggestion}
                                      suggestions={this.state.suggestions}
                                      onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                      onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                      getSuggestionValue={this.getSuggestionValue}
                                      inputProps={{
                                        placeholder: 'Search for funders.',
                                        value: this.state.funderName,
                                        onChange: this.onChange
                                      }}
                                    />
                                    {this.state.isLoading &&
                                    <div className="status">
                                      <img src={`${routes.images}/AddArticle/ajax-loader-transparent.gif`} />
                                    </div>
                                    }
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='fieldHolder'>
                            <div className='fieldinnerholder halflength'>
                                <div className='requrefieldholder'>
                                    <div className='requiredholder norequire'>
                                        <div className='required height32'>
                                        </div>
                                    </div>
                                    <div className='field'>
                                        {this.displayGrants()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='errorHolder'>
                        </div>
                    </div>
                    <div className='row'>
                      <div className='fieldHolder'>
                        <div className='fieldinnerholder halflength addGrant'>
                          <div className='requrefieldholder'>
                            <div className='requiredholder norequire'>
                              <div className='required height32'>
                              </div>
                            </div>
                            <div className='field'>
                              <a className='AddNewGrantNumberButton' onClick={this.addGrant}>Add New Award Number</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br/><br/><br/>
                </div>
            }
        </div>
    )
  }
}
