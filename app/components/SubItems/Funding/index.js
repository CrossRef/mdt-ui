import React, { Component } from 'react'
import update from 'immutability-helper'
import Autosuggest from 'react-autosuggest'
import { stateTrackerII } from 'my_decorators'


function getSuggestionValue(suggestion) {
  this.handleFunding(suggestion.uri)
  this.setState({
    funder_identifier: suggestion.uri
  })
  return suggestion.id;
}

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
      showSubItem: index === 0 ? true : false,
      suggestions: [],
      value: funding.funderRegistryID.trim().length ? funding.funderRegistryID : '',
      funder_identifier: funding.funder_identifier.trim().length ? funding.funder_identifier : '',
      isLoading: false,
      grantNumbers: grantNumbers.length > 0 ? funding.grantNumbers : [''],
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      funder_identifier: nextProps.funding.funder_identifier,
      grantNumbers: nextProps.grantNumbers,
    })
  }

  getSuggestions (value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : languages.filter(lang =>
        lang.name.toLowerCase().slice(0, inputLength) === inputValue
    )
  }

  onChange (event, { newValue }) {
    this.setState({
      value: newValue
    });
  }

  loadSuggestions(value) {
    this.setState({
      isLoading: true
    });

    fetch(`https://api.crossref.org/funders?query=${value}`)
    .then((response) => {
        return response.json();
    })
    .then(function(stories) {
        this.setState({
            isLoading: false,
            suggestions: stories.message.items
        });
    }.bind(this))
  }

  onSuggestionsFetchRequested ({ value }) {
    this.loadSuggestions(value)
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

  handleFunding = (uri) => {
    var funder = {}
    var grants = []
    var funder_ident_count = 0
    for(var i in this.refs){
      if(i === 'funderRegistryID') {
        funder[i] = this.state.value
        funder['funder_identifier'] = uri
      } else if ((i !== 'funder_identifier') && (i !== 'funderRegistryID') && (i.indexOf('grantNumbers') < 0)){
        funder[i] = this.refs[i].value
      } else if (i.indexOf('grantNumber') > -1){
        grants.push(this.refs[i].value)
      }
    }

    funder.grantNumbers = grants

    this.props.handler({ // this situation, state did NOT update immediately to see change, must pass in a call back
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
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: 'Type a Funder Name to look up ID.',
      value,
      onChange: this.onChange.bind(this)
    };
    const status = (this.state.isLoading ? 'Loading...' : 'Loading...');
    return (
        <div>
            <div className='row subItemRow' onClick={this.toggle.bind(this)}>
                <div className='subItemHeader subItemTitle'>
                    <span className={'arrowHolder' + (this.state.showSubItem ? ' openArrowHolder' : '')}>
                        <img src="'images/AddArticle/DarkTriangle.svg" />
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
                                            ref='fundername'
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
                                            ref='funderRegistryID'
                                            renderSuggestion={renderSuggestion}
                                            suggestions={this.state.suggestions}
                                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
                                            onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
                                            getSuggestionValue={getSuggestionValue.bind(this)}
                                            inputProps={inputProps}
                                         />
                                        {this.state.isLoading &&
                                            <div className="status">
                                                <img src='images/AddArticle/ajax-loader-transparent.gif' />
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
