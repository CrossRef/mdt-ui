import React, { Component } from 'react'
import is from 'prop-types'
import update from 'immutability-helper'
import Autosuggest from 'react-autosuggest'

import {routes} from '../../../routing'
import {articleTooltips as tooltips} from '../../../utilities/lists/tooltipMessages'
import ErrorIndicator from '../../Common/errorIndicator'



export default class Funding extends Component {
  constructor (props) {
    super(props)
    const {funding, validate} = this.props
    this.state = {
      showSubItem: true,
      suggestions: [],
      isValidFunder: false,
      funderName: funding.funderName || '',
      funder_identifier: funding.funder_identifier.trim().length ? funding.funder_identifier : '',
      isLoading: false,
      grantNumbers: funding.grantNumbers.length > 0 ? funding.grantNumbers : [''],
    }
  }


  componentWillReceiveProps(nextProps) {
    this.setState({
      showSubItem: nextProps.openSubItems ? true : this.state.showSubItem,
      funder_identifier: nextProps.funding.funder_identifier,
      grantNumbers: nextProps.funding.grantNumbers,
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
        funder_identifier: newValue.uri || '',
        isValidFunder: true
      })
    } else {
      this.setState({
        funderName: newValue,
        isValidFunder: false
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
    this.props.handler({})
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
      for (const i in this.grantInputNodes) {
        grants.push(this.grantInputNodes[i].value)
      }
      funder.grantNumbers = grants
    } else {
      funder[e.target.name] = e.target.value
    }

    this.props.handler({
      funding: update(this.props.data, {[this.props.index]: {$set: funder }})
    })
  }


  grantInputNodes = {}

  displayGrants () {
    this.grantInputNodes = {}
    var renderRet = [
      ...this.state.grantNumbers.map((grantNumber, i) => {
        return (
          <GrantField
            key={i}
            validate={this.props.validate}
            grantInputNodes={this.grantInputNodes}
            handleFunding={this.handleFunding}
            index={i}
            subItemIndex={this.props.index}
            value={grantNumber}
            removeGrant={this.removeGrant}
            tooltip={this.props.tooltip}
            tooltipUtility={this.props.tooltipUtility}
          />
        )
      })
    ];
    return renderRet
  }


  render () {
    const focusFunderId = `funderId-${this.props.index}`
    const funderIdFocused = this.props.tooltipUtility.getFocusedInput() === focusFunderId
    const errors = this.props.funding.errors || {}
    const fundingName = ['fundingName']
    const required = !!(this.props.funding.grantNumbers.toString())

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
              {!this.state.showSubItem}
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
                                        <div className='label'>Funder name {this.props.index + 1}</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                  <div className={`requiredholder ${!required && 'norequire'}`}>
                                    <div className='required height30'>{required && <span>*</span>}
                                    </div>
                                    </div>
                                  <div className='field'>
                                    <Autosuggest
                                      renderSuggestion={this.renderSuggestion}
                                      suggestions={this.state.suggestions}
                                      onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                      onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                      getSuggestionValue={this.getSuggestionValue}
                                      renderInputComponent={(inputProps) =>
                                        <div>
                                          {this.props.tooltip && funderIdFocused && <img className='infoFlag infoFlagInput' src={`${routes.images}/AddArticle/Asset_Icons_GY_HelpFlag.svg`} />}
                                            <input
                                              {...inputProps}
                                              className={`height32 ${this.props.error ? 'fieldError' : ''}${this.props.tooltip && funderIdFocused ? 'infoFlagBorder' : ''}`
                                              }
                                              onFocus={()=>{
                                                inputProps.onFocus()
                                                if(errors.fundingName && fundingName) {
                                                  this.props.errorUtility.setErrorMessages(fundingName, errors.fundingName)
                                                } else if (this.props.tooltip) {
                                                  this.props.errorUtility.setErrorMessages([])
                                                }
                                                this.props.tooltipUtility.assignFocus(focusFunderId, tooltips.funderId)
                                              }}
                                              onBlur={this.state.suggestions.length == 0 ? ()=>{
                                                this.props.validate()
                                                if (!this.state.isValidFunder){
                                                  this.setState({
                                                    funderName: "",
                                                  })
                                                }
                                              }:null}
                                            />
                                        </div>
                                      }
                                      inputProps={{
                                        placeholder: 'Search for funders.',
                                        value: this.state.funderName,
                                        onChange: this.onChange
                                      }}
                                    />
                                    {this.state.isLoading &&
                                    <div className="status">
                                      {/*<img src={`${routes.images}/AddArticle/ajax-loader-transparent.gif`} />*/}
                                    </div>
                                    }
                                  </div>
                                </div>
                            </div>
                        </div>
                      <ErrorIndicator
                        indicatorErrors={fundingName}
                        errorMessages={this.props.errorMessages}
                        errorUtility={this.props.errorUtility}
                        tooltipUtility={this.props.tooltipUtility}
                        allErrors={errors}
                        subItem='funding'
                        subItemIndex={String(this.props.index)}
                      />
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
                              <a className='AddNewGrantNumberButton' onClick={this.addGrant}>Add new award number</a>
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




class GrantField extends React.Component {

  static propTypes = {
    handleFunding: is.func.isRequired,
    validate: is.func.isRequired,
    index: is.number.isRequired,
    subItemIndex: is.number.isRequired,
    value: is.string.isRequired,
    removeGrant: is.func.isRequired,
    tooltip:is.oneOfType([is.string, is.bool]).isRequired,
    tooltipUtility: is.object.isRequired,
    grantInputNodes: is.object.isRequired
  }

  render() {
    const focusGrantId = `funderGrantNumber-${this.props.subItemIndex}-${this.props.index}`
    const grantIsFocused = this.props.tooltipUtility.getFocusedInput() === focusGrantId

    return (
      <div className='grantSection' key={this.props.index} >
        <div className='grantTitle'>Grant number {this.props.index + 1}</div>
        <div className="grantRow">
          {this.props.tooltip && grantIsFocused && <img className='infoFlag infoFlagGrant' src={`${routes.images}/AddArticle/Asset_Icons_GY_HelpFlag.svg`} />}
          <input
            className={`height32 grantInput ${this.props.tooltip && grantIsFocused ? 'infoFlagBorder' : ''}`}
            type='text'
            ref={(node)=>{
              this.props.grantInputNodes[`grantNumber_${this.props.index}`] = node
            }}
            name="grantNumber"
            onChange={this.props.handleFunding}
            value={this.props.value}
            onBlur={()=>{
              this.props.validate()
            }}
            onFocus={()=>{
              this.props.tooltipUtility.assignFocus(focusGrantId, tooltips.grantNumber)
            }}
          />
          {this.props.index > 0 &&
          <div className='grantRemove'>
            <a style={{cursor: 'pointer'}} onClick={() => this.props.removeGrant(this.props.index)}>
              Remove
            </a>
          </div>
          }
        </div>
      </div>
    )
  }
}