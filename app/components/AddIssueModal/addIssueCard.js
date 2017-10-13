import React from 'react'
import is from 'prop-types'
import Switch from 'react-toggle-switch'

import {routes} from '../../routing'
import { displayArchiveLocations } from '../../utilities/lists/archiveLocations'
import SubItem from '../Common/subItem'
import OptionalIssueInfo from './optionalIssueInfo'
import {makeDateDropDown} from  '../../utilities/date'
import {urlEntered, doiEntered} from  '../../utilities/helpers'



export default class AddIssueCard extends React.Component {
  static propTypes = {
    save: is.func.isRequired,
    duplicate: is.bool,
    handler: is.func.isRequired,
    optionalIssueInfoHandlers: is.func.isRequired,
    closeModal: is.func.isRequired,
    helperSwitch: is.func.isRequired
  }

  render () {
    const { errors } = this.props;
    const volumeSectionRequired =  !!(doiEntered(this.props.issue.volumeDoi, this.props.ownerPrefix) || urlEntered(this.props.issue.volumeUrl));
    const issueDoiDataRequired = !!(doiEntered(this.props.issue.issueDoi, this.props.ownerPrefix) || urlEntered(this.props.issue.issueUrl))
    return (
      <div className='addIssueCard'>
        <div>
          <form className='addIssues'>
            <div className='articleInnerForm'>
              <div className='body'>
                <div className='row infohelper'>
                  <div className={`saveConfirmation ${this.props.confirmationPayload.status}`}><p>{this.props.confirmationPayload.message}</p></div>
                  <div className='errorHolder'>
                    <div className='switchOuterHolder'>
                      <div className='switchInnerHolder'>
                        <div className='switchLicense'>
                          <div className='switchLabel'><span>Show Help</span></div>
                          <Switch
                            ref='showHelper'
                            onClick={this.props.helperSwitch}
                            on={this.props.showHelper}
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
                        <div className={`requiredholder ${this.props.issue.volume && 'norequire'}`}>
                          <div className='required height32'>
                            {!this.props.issue.volume && <span>*</span>}
                          </div>
                        </div>
                        <div className='field'>
                          <input
                            className={`height32 ${errors.issue && 'fieldError'}`}
                            type='text'
                            name='issue.issue'
                            onChange={this.props.handler}
                            value={this.props.issue.issue}
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
                            onChange={this.props.handler}
                            value={this.props.issue.issueTitle}
                            name='issue.issueTitle'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {(!this.props.error && this.props.showHelper) &&
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
                  {(this.props.error) &&
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
                          <div className='label'>Issue DOI</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className={`requiredholder ${issueDoiDataRequired ? '' : 'norequire'}`}>
                          <div className='required height32'>{issueDoiDataRequired && <span>*</span>}</div>
                        </div>
                        <div className='field'>
                          <input
                            className={`height32 ${(errors.issuedoi || errors.dupeissuedoi || errors.invalidissuedoi || errors.invalidIssueDoiPrefix) && 'fieldError'} ${this.props.issueDoiDisabled && 'disabledDoi'}`}
                            type='text'
                            name='issue.issueDoi'
                            onChange={this.props.handler}
                            value={this.props.issue.issueDoi}
                            disabled={this.props.issueDoiDisabled && !this.props.duplicate}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Issue URL</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className={`requiredholder ${issueDoiDataRequired ? '' : 'norequire'}`}>
                          <div className='required height32'>{issueDoiDataRequired && <span>*</span>}</div>
                        </div>
                        <div className='field'>
                          <input
                            className={'height32' + ((errors.issueUrl || errors.invalidissueurl) ? ' fieldError': '')}
                            type='text'
                            name='issue.issueUrl'
                            value={this.props.issue.issueUrl}
                            onChange={this.props.handler}
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
                        <div className={'requiredholder' + (!this.props.issue.onlineDateYear || errors.printDateIncomplete ? ' dateselectrequire':' norequire')}>
                          <div className='required height32'>
                            {(!this.props.issue.onlineDateYear || errors.printDateIncomplete) && <span>*</span>}
                          </div>
                        </div>
                        <div className='field'>
                          <div className='datepickerholder'>
                            <div className='dateselectholder'>
                              <div>Year {((this.props.issue.onlineDateYear ? this.props.issue.onlineDateYear : '').length === 0 ? '(*)' : '')}</div>
                              <div>{makeDateDropDown(this.props.handler, 'issue.printDateYear', 'y', this.props.issue.printDateYear, errors.printDateInvalid || errors.printDateYear || errors.printDateIncomplete)}</div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Month</div>
                              <div>
                                {makeDateDropDown(this.props.handler, 'issue.printDateMonth', 'm', this.props.issue.printDateMonth, errors.printDateInvalid)}
                              </div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Day</div>
                              <div>
                                {makeDateDropDown(this.props.handler, 'issue.printDateDay', 'd', this.props.issue.printDateDay, errors.printDateInvalid)}
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
                        <div className={'requiredholder' + (!this.props.issue.printDateYear || errors.onlineDateIncomplete ? ' dateselectrequire':' norequire')}>
                          <div className='required height32'>
                            {(!this.props.issue.printDateYear || errors.onlineDateIncomplete) && <span>*</span>}
                          </div>
                        </div>
                        <div className='field'>
                          <div className='datepickerholder'>
                            <div className='dateselectholder'>
                              <div>Year {((this.props.issue.printDateYear ? this.props.issue.printDateYear : '').length === 0 ? '(*)' : '')}</div>
                              <div>{makeDateDropDown(this.props.handler, 'issue.onlineDateYear', 'y', this.props.issue.onlineDateYear, errors.onlineDateInvalid || errors.onlineDateYear || errors.onlineDateIncomplete)}</div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Month</div>
                              <div>
                                {makeDateDropDown(this.props.handler, 'issue.onlineDateMonth', 'm', this.props.issue.onlineDateMonth, errors.onlineDateInvalid)}
                              </div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Day</div>
                              <div>
                                {makeDateDropDown(this.props.handler, 'issue.onlineDateDay', 'd', this.props.issue.onlineDateDay, errors.onlineDateInvalid)}
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
                          {displayArchiveLocations(this.props.handler, this.props.issue.archiveLocation)}
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
                            onChange={this.props.handler}
                            value={this.props.issue.specialIssueNumber}
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
                        <div className={`requiredholder ${this.props.issue.issue && !volumeSectionRequired && 'norequire'}`}>
                          <div className='required height32'>{(!this.props.issue.issue || volumeSectionRequired) && <span>*</span>}</div>
                        </div>
                        <div className='field'>
                          <input
                            className={`height32 ${errors.volume && 'fieldError'}`}
                            type='text'
                            name='issue.volume'
                            onChange={this.props.handler}
                            value={this.props.issue.volume}
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
                            className={`height32 ${(errors.volumedoi || errors.dupevolumedoi || errors.invalidvolumedoi || errors.dupeDois || errors.invalidVolumeDoiPrefix) && 'fieldError'} ${this.props.volumeDoiDisabled && 'disabledDoi'}`}
                            type='text'
                            name='issue.volumeDoi'
                            onChange={this.props.handler}
                            value={this.props.issue.volumeDoi}
                            disabled={this.props.volumeDoiDisabled}
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
                            onChange={this.props.handler}
                            value={this.props.issue.volumeUrl}
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
                optionalIssueInfoHandlers={this.props.optionalIssueInfoHandlers}
                validating={this.props.validating}
                showSection={this.props.showSection}>
                  {this.props.optionalIssueInfo.map((data, i)=>
                    <OptionalIssueInfo
                      key={i}
                      optionalIssueInfo={data}
                      optionalIssueInfoHandlers={this.props.optionalIssueInfoHandlers}
                      data={this.props.optionalIssueInfo}
                      index={i}/>
                  )}
              </SubItem>
              <div className='saveButtonAddIssueHolder'>
                <div onClick={this.props.save} className='saveButton addIssue actionTooltip'>
                  Save
                </div>
                <button onClick={this.props.closeModal} type='button' className='cancelButton addIssue'>Close</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}