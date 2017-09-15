import React, { Component } from 'react'
import is from 'prop-types'
import update from 'immutability-helper'
import Switch from 'react-toggle-switch'

import {makeDateDropDown} from  '../utilities/date'
import SubItem from './SubItems/subItem'
import JSesc from '../utilities/jsesc'
import { displayArchiveLocations } from '../utilities/archiveLocations'
import { getIssueXml } from '../utilities/xmlGenerator'
import {routes} from '../routing'
import refreshErrorBubble from '../utilities/refreshErrorBubble'
import {asyncValidateIssue} from '../utilities/validation'
import parseXMLIssue from '../utilities/parseXMLIssue'
import {stateTrackerII} from 'my_decorators'



const defaultState = {
  validating: false,
  showSection: false,
  showIssueDoiReq: false,
  showHelper: false,
  on: false,
  error: false,
  version: '1',
  errors: {
    issueUrl: false,
    printDateYear: false,
    onlineDateYear: false,
    invalidissueurl: false,
    dupeissuedoi: false,
    invalidissuedoi: false,
    invalidIssueDoiPrefix: false,
    issuedoi: false,
    volumeUrl: false,
    invalidvolumeurl: false,
    dupevolumedoi: false,
    invalidvolumedoi: false,
    invalidVolumeDoiPrefix: false,
    volumedoi: false,
    dupeDois: false
  },
  issue: {
    issue: '',
    issueTitle: '',
    issueDoi: '',
    issueUrl: 'http://',
    printDateYear: '',
    printDateMonth: '',
    printDateDay: '',
    onlineDateYear: '',
    onlineDateMonth: '',
    onlineDateDay: '',
    archiveLocation: '',
    specialIssueNumber: '',
    volume: '',
    volumeDoi: '',
    volumeUrl: 'http://'
  },
  optionalIssueInfo: [{
    firstName: '',
    lastName: '',
    suffix: '',
    affiliation: '',
    orcid: '',
    alternativeName: '',
    role: ''
  }]
}


export default class AddIssueCard extends Component {

  static propTypes = {
    ownerPrefix: is.string.isRequired,
    reduxControlModal: is.func.isRequired,

    asyncSubmitIssue: is.func.isRequired,
    asyncGetItem: is.func,
    asyncGetPublications: is.func.isRequired
  }

  constructor (props) {
    super(props);
    this.state = defaultState;
    this.state.issue.issueDoi = props.ownerPrefix + '/'
  }

  async componentDidMount () {
    const isSearch = this.props.mode === 'search'
    if(this.props.mode === 'edit' || isSearch) {
      let doi, Publication, message, Issue;

      if (!isSearch) {
        doi = this.props.issue.doi
        Publication = await this.props.asyncGetItem(doi)
        message = Publication.message
        Issue = message.contains[0]

      } else {
        Issue = this.props.issue
      }

      const version = Issue['mdt-version']

      const {issue, optionalIssueInfo, showSection} = parseXMLIssue(Issue.content, this.props.duplicate, this.props.ownerPrefix)

      if(isSearch) issue.issueDoi = this.props.ownerPrefix

      const issueDoiDisabled = !this.props.duplicate && !isSearch
      const volumeDoiDisabled = issue.volumeDoi && !this.props.duplicate

      const {validatedPayload} = await this.validation(issue, optionalIssueInfo, issueDoiDisabled, volumeDoiDisabled)

      const setStatePayload = {
        version: version,
        issueDoiDisabled: issueDoiDisabled,
        volumeDoiDisabled: volumeDoiDisabled,
        issue:  issue,
        optionalIssueInfo: optionalIssueInfo,
        showSection: showSection,
        ...validatedPayload
      }

      this.setState(setStatePayload, ()=> this.state.validating = false)
    }
  }


  async validation (issueData, optionalIssueInfo, issueDoiDisabled, volumeDoiDisabled) {

    const { criticalErrors, warnings, contributors, enableVolumeDoi } = await asyncValidateIssue(issueData, optionalIssueInfo, this.props.ownerPrefix, issueDoiDisabled, volumeDoiDisabled)

    const validatedPayload = {
      validating: true,
      error: false,
      errors: {...criticalErrors, ...warnings},
      optionalIssueInfo: (contributors && contributors.length) ? contributors : optionalIssueInfo
    }
    if(enableVolumeDoi) {
      validatedPayload.volumeDoiDisabled = false
    }
    let valid = true;

    for(const key in warnings) {
      if (warnings[key]) {
        validatedPayload.error = true;
      }
    }

    for(const key in criticalErrors) {
      if(criticalErrors[key]) {
        validatedPayload.error = true
        valid = false;
      }
    }

    return {valid, validatedPayload}
  }


  onSubmit = async (e) => {
    e.preventDefault()

    const {valid, validatedPayload} = await this.validation(this.state.issue, this.state.optionalIssueInfo, this.state.issueDoiDisabled, this.state.volumeDoiDisabled)

    if (valid) {
      const { publication, asyncSubmitIssue, asyncGetPublications, mode } = this.props;

      const issueXML = getIssueXml(this.state)

      let version = this.state.version

      if (mode === 'edit') {
        version = String(parseInt(this.state.version) + 1)
      }

      const title = JSesc(this.state.issue.issueTitle);
      const issue = JSesc(this.state.issue.issue);
      const volume = JSesc(this.state.issue.volume);

      const newRecord = {
        'title': {title, issue, volume},
        'date': new Date(),
        'doi': this.state.issue.issueDoi,
        'owner-prefix': this.props.ownerPrefix,
        'type': 'issue',
        'mdt-version': version,
        'status': 'draft',
        'content': issueXML.replace(/(\r\n|\n|\r)/gm,''),
      }

      publication.message.contains = [newRecord]
      asyncSubmitIssue(publication, () => {
        if(this.props.mode === 'search') {
          newRecord.contains = [this.props.savedArticle]
          asyncSubmitIssue(publication, () => {
            asyncGetPublications(publication.message.doi)
            return this.closeModal()
          })
        }
        asyncGetPublications(publication.message.doi)
        this.closeModal()
      })
    } else {
      this.setState(validatedPayload, () => this.state.validating = false)
    }
  }


  optionalIssueInfoHandler (index, OptIssueInfo) {
    var optIssueInfo = {}
    for(var i in OptIssueInfo.refs){
      if(OptIssueInfo.refs[i]){
        optIssueInfo[i] = OptIssueInfo.refs[i].value
      }
    }

    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
      optionalIssueInfo: update(this.state.optionalIssueInfo, {[index]: {$set: optIssueInfo }})
    })
  }

  addOptionalIssueInfo () {
    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
      optionalIssueInfo: update(this.state.optionalIssueInfo, {$push:
        [{
          firstName: '',
          lastName: '',
          suffix: '',
          affiliation: '',
          orcid: '',
          alternativeName: '',
          role: '',
          errors: {}
        }]
      })
    })
  }

  removeOptionalIssueInfo (index) {
    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
      optionalIssueInfo: update(this.state.optionalIssueInfo, {$splice: [[index, 1]] })
    })
  }

  handler = (e) => {
    const name = e.currentTarget.name.substr(e.currentTarget.name.indexOf('.') + 1, e.currentTarget.name.length-1)

    if (name === 'issueUrl') {
      (e.currentTarget.value.trim().length > 0) ? this.setState({showIssueDoiReq:true}) : this.setState({showIssueDoiReq:false})
    }

    this.setState({
      issue: update(this.state.issue, {[name]: {$set: e.currentTarget.value ? e.currentTarget.value : '' }})
    })
  }

  closeModal () {
    this.props.reduxControlModal({showModal:false})
  }

  componentDidUpdate() {
    refreshErrorBubble()
  }


  render () {
    const { errors } = this.state;
    const volumeSectionRequired =  !!(this.state.issue.volume || this.state.issue.volumeDoi || (this.state.issue.volumeUrl && this.state.issue.volumeUrl !== 'http://'));
     return (
      <div className='addIssueCard'>
        <div>
          <form onSubmit={this.onSubmit} className='addIssues'>
            <div className='articleInnerForm'>
              <div className='body'>
                <div className='row infohelper'>
                  <div className='errorHolder'>
                    <div className='switchOuterHolder'>
                        <div className='switchInnerHolder'>
                            <div className='switchLicense'>
                                <div className='switchLabel'><span>Show Help</span></div>
                                <Switch
                                    ref='showHelper'
                                    onClick={() => {
                                        this.setState({on: !this.state.on}, ()=>{
                                          this.setState({showHelper: this.state.on})
                                        })
                                    }}
                                    on={this.state.on}
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
                          <div className='label'>Issue</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder'>
                          <div className='required height32'>
                            <span>*</span>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className={`height32 ${errors.issue && 'fieldError'}`}
                              type='text'
                              name='issue.issue'
                              onChange={this.handler}
                              value={this.state.issue.issue}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Issue Title</div>
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
                              onChange={this.handler}
                              value={this.state.issue.issueTitle}
                              name='issue.issueTitle'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {(!this.state.error && this.state.showHelper) &&
                    <div className='errorHolder talltooltip helpers'>
                      <div className='toolTipHolder'>
                        <a className="tooltips">
                          <div className='toolmsgholder'>
                            <div className='errormsgholder'>
                              <div className='errormsginnerholder'>
                                <img src={`${routes.images}/AddArticle/Asset_Icons_White_Help.svg`} />
                                Please provide a Title that fully describes your Issue
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  }
                  {(this.state.error) &&
                    <div className='errorHolder talltooltip fullError'>
                      <div className='toolTipHolder'>
                        <a className="tooltips">
                          <div className='toolmsgholder'>
                            <div className='errormsgholder'>
                              <div className='errormsginnerholder'>
                                <div><img src={`${routes.images}/AddArticle/Asset_Icons_White_Help.svg`} /></div>
                                {(()=>{

                                  let requiredError = [];
                                  if(errors.issue) requiredError.push('Please provide an issue number.');
                                  if(errors.issuedoi) requiredError.push('Please provide required DOI.');
                                  if(errors.issueUrl) requiredError.push('Please provide required Issue URL.');
                                  if(errors.printDateYear || errors.onlineDateYear) requiredError.push('Please provide either a print or online date.');
                                  if(errors.printDateIncomplete || errors.onlineDateIncomplete) requiredError.push('Dates require a year value.');
                                  if(errors.volume) requiredError.push('Please provide a volume number.');
                                  if(errors.volumeUrl) requiredError.push('Please provide required Volume URL.');
                                  if(errors.volumedoi) requiredError.push('Please provide required Volume DOI.');
                                  if(errors.contributorLastName) requiredError.push('Last name required with First Name.');
                                  if(errors.contributorRole) requiredError.push('Please provide Contributor Role.');
                                  if(requiredError.length) return (
                                    <div><b>Required.</b><br />{requiredError.length > 1 ? 'Please provide required information.' : requiredError[0]}</div>
                                  );
                                })()}
                                {errors.invalidissuedoi &&
                                  <div><b>Invalid Issue DOI.</b><br />Please check your issue DOI (10.xxxx/xx...).</div>
                                }
                                {errors.invalidIssueDoiPrefix &&
                                <div><b>Invalid Issue DOI.</b><br />DOI prefix needs to match journal DOI prefix.</div>
                                }
                                {(errors.dupeissuedoi) &&
                                <div><b>Duplicate Issue DOI.</b><br />Registering a new DOI? This one already exists.</div>
                                }
                                {(errors.dupeDois) &&
                                <div><b>Duplicate DOIs.</b><br />Issue and Volume DOIs cannot be the same.</div>
                                }
                                {(errors.invalidissueurl) &&
                                  <div><b>Invalid URL.</b><br />Please check your URL.</div>
                                }
                                {errors.printDateInvalid &&
                                <div><b>Invalid Print Date.</b><br />Please verify date.</div>
                                }
                                {errors.onlineDateInvalid &&
                                <div><b>Invalid Online Date.</b><br />Please verify date.</div>
                                }
                                {errors.invalidvolumedoi &&
                                  <div><b>Invalid Volume DOI.</b><br />Please check your volume DOI (10.xxxx/xx...).</div>
                                }
                                {errors.invalidVolumeDoiPrefix &&
                                <div><b>Invalid Volume DOI.</b><br />DOI prefix needs to match journal DOI prefix.</div>
                                }
                                {(errors.dupevolumedoi) &&
                                  <div><b>Duplicate Volume DOI.</b><br />Registering a new DOI? This one already exists.</div>
                                }
                                {errors.invalidvolumeurl &&
                                <div><b>Invalid Volume URL.</b><br />Please check your URL.</div>
                                }
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  }
                </div>
                <div className='row'>
                  <div className='fieldHolder'>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Issue DOI (Required)</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder'>
                          <div className='required height32'>
                            <span>*</span>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className={`height32 ${(errors.issuedoi || errors.dupeissuedoi || errors.invalidissuedoi || errors.invalidIssueDoiPrefix) && 'fieldError'} ${this.state.issueDoiDisabled && 'disabledDoi'}`}
                              type='text'
                              name='issue.issueDoi'
                              onChange={this.handler}
                              value={this.state.issue.issueDoi}
                              disabled={this.state.issueDoiDisabled && !this.props.duplicate}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Issue URL (Required)</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder'>
                          <div className='required height32'>
                            <span>*</span>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className={'height32' + ((errors.issueUrl || errors.invalidissueurl) ? ' fieldError': '')}
                              type='text'
                              name='issue.issueUrl'
                              value={this.state.issue.issueUrl}
                              onChange={this.handler}
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
                          <div className='label'>Print Date</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className={'requiredholder' + (!this.state.issue.onlineDateYear || errors.printDateIncomplete ? ' dateselectrequire':' norequire')}>
                          <div className='required height32'>
                            {(!this.state.issue.onlineDateYear || errors.printDateIncomplete) && <span>*</span>}
                          </div>
                        </div>
                        <div className='field'>
                          <div className='datepickerholder'>
                            <div className='dateselectholder'>
                              <div>Year {((this.state.issue.onlineDateYear ? this.state.issue.onlineDateYear : '').length === 0 ? '(*)' : '')}</div>
                              <div>{makeDateDropDown(this.handler, 'issue.printDateYear', 'y', this.state.issue.printDateYear, errors.printDateInvalid || errors.printDateYear || errors.printDateIncomplete)}</div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Month</div>
                              <div>
                                {makeDateDropDown(this.handler, 'issue.printDateMonth', 'm', this.state.issue.printDateMonth, errors.printDateInvalid)}
                              </div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Day</div>
                              <div>
                                {makeDateDropDown(this.handler, 'issue.printDateDay', 'd', this.state.issue.printDateDay, errors.printDateInvalid)}
                              </div>
                            </div>
                            <div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Online Date</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className={'requiredholder' + (!this.state.issue.printDateYear || errors.onlineDateIncomplete ? ' dateselectrequire':' norequire')}>
                          <div className='required height32'>
                            {(!this.state.issue.printDateYear || errors.onlineDateIncomplete) && <span>*</span>}
                          </div>
                        </div>
                        <div className='field'>
                          <div className='datepickerholder'>
                            <div className='dateselectholder'>
                              <div>Year {((this.state.issue.printDateYear ? this.state.issue.printDateYear : '').length === 0 ? '(*)' : '')}</div>
                              <div>{makeDateDropDown(this.handler, 'issue.onlineDateYear', 'y', this.state.issue.onlineDateYear, errors.onlineDateInvalid || errors.onlineDateYear || errors.onlineDateIncomplete)}</div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Month</div>
                              <div>
                                {makeDateDropDown(this.handler, 'issue.onlineDateMonth', 'm', this.state.issue.onlineDateMonth, errors.onlineDateInvalid)}
                              </div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Day</div>
                              <div>
                                {makeDateDropDown(this.handler, 'issue.onlineDateDay', 'd', this.state.issue.onlineDateDay, errors.onlineDateInvalid)}
                              </div>
                            </div>
                            <div>
                            </div>
                          </div>
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
                          <div className='label'>Archive Location</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder norequire'>
                          <div className='required height32'>
                          </div>
                        </div>
                        <div className='field'>
                          {displayArchiveLocations(this.handler, this.state.issue.archiveLocation)}
                        </div>
                      </div>
                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Special Issue Number</div>
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
                              name='issue.specialIssueNumber'
                              onChange={this.handler}
                              value={this.state.issue.specialIssueNumber}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='errorHolder'>
                  </div>
                </div>
                <hr />
                <div className='row'>
                  <div className='fieldHolder'>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Volume</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className={`requiredholder ${!volumeSectionRequired && 'norequire'}`}>
                          <div className='required height32'>{volumeSectionRequired && <span>*</span>}</div>
                        </div>
                        <div className='field'>
                          <input
                              className={`height32 ${errors.volume && 'fieldError'}`}
                              type='text'
                              name='issue.volume'
                              onChange={this.handler}
                              value={this.state.issue.volume}
                          />
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
                          <div className='label'>Volume DOI</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className={`requiredholder ${!volumeSectionRequired && 'norequire'}`}>
                          <div className='required height32'>{volumeSectionRequired && <span>*</span>}</div>
                        </div>
                        <div className='field'>
                          <input
                              className={`height32 ${(errors.volumedoi || errors.dupevolumedoi || errors.invalidvolumedoi || errors.dupeDois || errors.invalidVolumeDoiPrefix) && 'fieldError'} ${this.state.volumeDoiDisabled && 'disabledDoi'}`}
                              type='text'
                              name='issue.volumeDoi'
                              onChange={this.handler}
                              value={this.state.issue.volumeDoi}
                              disabled={this.state.volumeDoiDisabled}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Volume URL</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className={`requiredholder ${!volumeSectionRequired && 'norequire'}`}>
                          <div className='required height32'>
                            {volumeSectionRequired && <span>*</span>}
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className={'height32' + ((errors.volumeUrl || errors.invalidvolumeurl) ? ' fieldError': '')}
                              type='text'
                              name='issue.volumeUrl'
                              onChange={this.handler}
                              value={this.state.issue.volumeUrl}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <SubItem
                title={'Optional Issue Information (Contributorship)'}
                arrowType={'dark'}
                addable={true}
                incomingData={this.state.optionalIssueInfo}
                handler={this.optionalIssueInfoHandler.bind(this)}
                addHandler={this.addOptionalIssueInfo.bind(this)}
                remove={this.removeOptionalIssueInfo.bind(this)}
                errors={this.state.errors}
                validating={this.state.validating}
                showSection={this.state.showSection}
              />
              <div className='saveButtonAddIssueHolder'>
                <button type='submit' className='saveButton addIssue'>Submit</button>
                <button onClick={() => this.closeModal()} type='button' className='cancelButton addIssue'>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

