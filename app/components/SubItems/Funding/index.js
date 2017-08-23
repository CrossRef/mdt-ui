import React, { Component } from 'react'
import update from 'immutability-helper'
import Autosuggest from 'react-autosuggest'
import {stateTrackerII} from 'my_decorators'

import {routes} from '../../../routing'


function renderSuggestion(suggestion) {
  return (
    <span>{`${suggestion.name} (${suggestion.id})`}</span>
  );
}



export default class Funding extends Component {
  constructor (props) {
    super(props)
    const {index, grantNumbers, funding} = this.props
    this.state = {
      showSubItem: index === 0,
      suggestions: [],
      value: funding.funderRegistryID.trim().length ? funding.funderRegistryID : '',
      funderRegistryID: funding.funderRegistryID.trim().length ? funding.funderRegistryID : '',
      funder_identifier: funding.funder_identifier.trim().length ? funding.funder_identifier : '',
      isLoading: false,
      grantNumbers: grantNumbers.length > 0 ? funding.grantNumbers : [''],
    }
  }

  componentDidUpdate () {
    this.props.positionErrorBubble();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      funder_identifier: nextProps.funding.funder_identifier,
      grantNumbers: nextProps.grantNumbers,
    })
  }

  getSuggestionValue = (suggestion) => {
    return suggestion
  }

  onChange = (e, {newValue}) => {
    if (newValue.id || newValue === '') {
      const event = {
        target: {
          name: 'funderRegistryID',
          id: newValue.id || '',
          uri: newValue.uri || '',
        }
      }
      this.handleFunding(event)
      this.setState({
        value: newValue.id || '',
        funderRegistryID: newValue.id || '',
        funder_identifier: newValue.uri || ''
      })
    } else {
      this.setState({
        value: newValue
      })
    }
  }

  getSuggestions (value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : languages.filter(lang =>
        lang.name.toLowerCase().slice(0, inputLength) === inputValue
    )
  }

  onSuggestionsFetchRequested ({ value }) {
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

  onSuggestionsClearRequested () {
    this.setState({
      suggestions: []
    })
  }

  toggle () {
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
      fundername: this.props.funding.fundername,
      funderRegistryID: this.state.funderRegistryID,
      funder_identifier: this.state.funder_identifier,
      grantNumbers: this.state.grantNumbers
    }

    if(e.target.name === 'funderRegistryID') {
      funder.funderRegistryID = e.target.id;
      funder.funder_identifier = e.target.uri;
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
                <input
                    className='height32'
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
        ))
      ];
      return renderRet
  }

  render () {
    const inputProps = {
      placeholder: 'Type a Funder Name to look up ID.',
      value: this.state.value,
      onChange: this.onChange
    };
    const status = (this.state.isLoading ? 'Loading...' : 'Loading...');
    return (
        <div>
            <div className='row subItemRow' onClick={this.toggle.bind(this)}>
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
                                        <input
                                            className='height32'
                                            type='text'
                                            name='fundername'
                                            onChange={this.handleFunding}
                                            value={this.props.funding.fundername}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='fieldHolder'>
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>Funder Registry ID</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className='requiredholder norequire'>
                                        <div className='required height32'>
                                        </div>
                                    </div>
                                    <div className='field'>
                                        <Autosuggest
                                            renderSuggestion={renderSuggestion}
                                            suggestions={this.state.suggestions}
                                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
                                            onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
                                            getSuggestionValue={this.getSuggestionValue}
                                            inputProps={inputProps}
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
                                        <a className='AddNewGrantNumberButton' onClick={this.addGrant}>Add New Grant Number</a>
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

                </div>
            }
        </div>
    )
  }
}
