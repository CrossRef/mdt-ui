import React from 'react'
import is from 'prop-types'
import Switch from 'react-toggle-switch'

import {routes} from '../../routing'
import { displayArchiveLocations } from '../../utilities/lists/archiveLocations'
import SubItem from '../Common/subItem'
import OptionalIssueInfo from './optionalIssueInfo'
import {makeDateDropDown} from  '../../utilities/date'
import {urlEntered, doiEntered} from  '../../utilities/helpers'
import ErrorBubble from './errorBubble'
import TooltipBubble from '../Common/tooltipBubble'
import FormInput from '../Common/formInput'
import FormTextArea from '../Common/formTextArea'
import FormSelect from '../Common/formSelect'
import FormDate from '../Common/formDate'
import ErrorIndicator from '../Common/errorIndicator'
import {issueTooltips as tooltips} from '../../utilities/lists/tooltipMessages'



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

                    <FormInput
                      label="Issue"
                      name="issue.issue"
                      value={this.props.issue.issue}
                      changeHandler={this.props.handler}
                      error={errors.issueVolume}
                      setErrorMessages={this.props.errorUtility.setErrorMessages}
                      tooltip={this.props.showHelper && tooltips.issueNumber}
                      deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                      required={!this.props.issue.volume}/>



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


                    <FormInput label="Issue Title" name="issue.issueTitle" value={this.props.issue.issueTitle} changeHandler={this.props.handler} label="" name="" value="" changeHandler=""/>


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
                  {(this.props.error) && <ErrorBubble errors={errors} deferredErrorBubbleRefresh={this.props.deferredErrorBubbleRefresh}/>}
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
                            className={`height32 ${errors.issueVolume && 'fieldError'}`}
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
                deferredErrorBubbleRefresh={this.props.deferredErrorBubbleRefresh}
                showSection={this.props.showSection}>
                  {this.props.optionalIssueInfo.map((data, i)=>
                    <OptionalIssueInfo
                      key={i}
                      optionalIssueInfo={data}
                      optionalIssueInfoHandlers={this.props.optionalIssueInfoHandlers}
                      data={this.props.optionalIssueInfo}
                      deferredErrorBubbleRefresh={this.props.deferredErrorBubbleRefresh}
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