import React from 'react'
import is from 'prop-types'
import Switch from 'react-toggle-switch'

import {routes} from '../../routing'
import { ArchiveLocations } from '../../utilities/lists/archiveLocations'
import SubItem from '../Common/subItem'
import OptionalIssueInfo from './optionalIssueInfo'
import {urlEntered, doiEntered} from  '../../utilities/helpers'
import ErrorBubble from './errorBubble'
import TooltipBubble from '../Common/tooltipBubble'
import FormInput from '../Common/formInput'
import FormTextArea from '../Common/formTextArea'
import FormSelect from '../Common/formSelect'
import FormDate from '../Common/formDate'
import ErrorIndicator from '../Common/errorIndicator'
import {issueTooltips as tooltips} from '../../utilities/lists/tooltipMessages'




AddIssueCard.propTypes = {
  save: is.func.isRequired,
  duplicate: is.bool,
  handler: is.func.isRequired,
  optionalIssueInfoHandlers: is.func.isRequired,
  closeModal: is.func.isRequired,
  helperSwitch: is.func.isRequired,
  errorUtility: is.object.isRequired,
  boundSetState: is.func.isRequired
}


export default function AddIssueCard (props) {

  const { errors } = props;
  const volumeSectionRequired =  !!(doiEntered(props.issue.volumeDoi, props.ownerPrefix) || urlEntered(props.issue.volumeUrl));
  const issueDoiDataRequired = !!(doiEntered(props.issue.issueDoi, props.ownerPrefix) || urlEntered(props.issue.issueUrl))
  return (
    <div className='addIssueCard'>
      <div>
        <form className='addIssues'>
          <div className='articleInnerForm'>
            <div className='body'>


              <div className='row infohelper'>
                <div className={`saveConfirmation ${props.confirmationPayload.status}`}><p>{props.confirmationPayload.message}</p></div>
                <div className='errorHolder'>
                  <div className='switchOuterHolder'>
                    <div className='switchInnerHolder'>
                      <div className='switchLicense'>
                        <div className='switchLabel'><span>Show Help</span></div>
                        <Switch
                          onClick={props.helperSwitch}
                          on={props.showHelper}
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
                    value={props.issue.issue}
                    changeHandler={props.handler}
                    error={errors.issueVolume}
                    trackErrors={['issueVolume']}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    tooltip={props.showHelper && tooltips.issueNumber}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                    onBlur={props.validate}
                    required={!props.issue.volume}/>

                  <FormInput
                    label="Issue Title"
                    name="issue.issueTitle"
                    value={props.issue.issueTitle}
                    changeHandler={props.handler}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    tooltip={props.showHelper && tooltips.issueTitle}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}/>
                </div>

                <ErrorIndicator issue trackErrors={['issueVolume']} errorMessages={props.errorMessages} errorUtility={props.errorUtility} allErrors={props.errors}/>

                {props.showHelper && <TooltipBubble issue deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh} errorUtility={props.errorUtility}/>}

              </div>


              <div className='row'>
                <div className='fieldHolder'>
                  <FormInput
                    label="Issue DOI"
                    name="issue.issueDoi"
                    value={props.issue.issueDoi}
                    changeHandler={props.handler}
                    disabled={props.issueDoiDisabled}
                    error={errors.issuedoi || errors.dupeissuedoi || errors.invalidissuedoi || errors.invalidIssueDoiPrefix}
                    trackErrors={['issuedoi', 'dupeissuedoi', 'invalidissuedoi', 'invalidIssueDoiPrefix']}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    tooltip={props.showHelper && tooltips.issueDoi}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                    onBlur={props.validate}
                    required={issueDoiDataRequired}/>

                  <FormInput
                    label="Issue URL"
                    name="issue.issueUrl"
                    value={props.issue.issueUrl}
                    changeHandler={props.handler}
                    error={errors.issueUrl || errors.invalidissueurl}
                    trackErrors={['issueUrl', 'invalidissueurl']}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    tooltip={props.showHelper && tooltips.issueUrl}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                    onBlur={props.validate}
                    required={issueDoiDataRequired}/>
                </div>

                <ErrorIndicator
                  issue
                  trackErrors={['issuedoi', 'dupeissuedoi', 'invalidissuedoi', 'invalidIssueDoiPrefix', 'issueUrl', 'invalidissueurl']}
                  errorMessages={props.errorMessages}
                  errorUtility={props.errorUtility}
                  allErrors={props.errors}/>
              </div>


              <div className='row'>
                <div className='fieldHolder'>
                  <FormDate issue
                    label="Print Date"
                    name="issue.printDate"
                    required={!props.issue.onlineDateYear || errors.printDateIncomplete}
                    changeHandler={props.handler}
                    onSelect={props.validate}
                    tooltip={props.showHelper && tooltips.printDate}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                    error={errors.printDateInvalid}
                    trackErrors={['printDateInvalid', 'printDateYear', 'printDateIncomplete']}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    fields={{
                      year: {
                        value: props.issue.printDateYear,
                        error: errors.printDateYear || errors.printDateIncomplete,
                        required: !props.issue.onlineDateYear || errors.printDateIncomplete
                      },
                      month: {
                        value: props.issue.printDateMonth
                      },
                      day: {
                        value: props.issue.printDateDay
                      }
                    }}/>

                  <FormDate issue
                    label="Online Date"
                    name="issue.onlineDate"
                    required={!props.issue.printDateYear || errors.onlineDateIncomplete}
                    changeHandler={props.handler}
                    onSelect={props.validate}
                    tooltip={props.showHelper && tooltips.onlineDate}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                    error={errors.onlineDateInvalid}
                    trackErrors={['onlineDateInvalid', 'onlineDateYear', 'onlineDateIncomplete']}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    fields={{
                      year: {
                        value: props.issue.onlineDateYear,
                        error: errors.onlineDateYear || errors.onlineDateIncomplete,
                        required: !props.issue.onlineDateYear || errors.onlineDateIncomplete
                      },
                      month: {
                        value: props.issue.onlineDateMonth
                      },
                      day: {
                        value: props.issue.onlineDateDay
                      }
                    }}/>
                </div>

                <ErrorIndicator
                  issue
                  style="dateErrorHolder"
                  trackErrors={['printDateInvalid', 'printDateYear', 'printDateIncomplete', 'onlineDateInvalid', 'onlineDateYear', 'onlineDateIncomplete']}
                  errorMessages={props.errorMessages}
                  errorUtility={props.errorUtility}
                  allErrors={props.errors}/>
              </div>


              <div className='row'>
                <div className='fieldHolder'>
                  <FormSelect
                    label="Archive Location"
                    name="issue.archiveLocation"
                    value={props.issue.archiveLocation}
                    options={ArchiveLocations}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    tooltip={props.showHelper && tooltips.archiveLocation}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                    changeHandler={props.handler}
                    onSelect={props.validate}/>

                  <FormInput
                    label="Special Issue Number"
                    name="issue.specialIssueNumber"
                    value={props.issue.specialIssueNumber}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    changeHandler={props.handler}
                    tooltip={props.showHelper && tooltips.specialNumber}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}/>
                </div>
              </div>


              <hr />

              <div className='row'>
                <div className='fieldHolder'>
                  <FormInput
                    label="Volume"
                    name="issue.volume"
                    value={props.issue.volume}
                    changeHandler={props.handler}
                    disabled={props.issueDoiDisabled}
                    error={errors.issueVolume}
                    trackErrors={['issueVolume']}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    tooltip={props.showHelper && tooltips.volumeNumber}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                    onBlur={props.validate}
                    required={!props.issue.issue || volumeSectionRequired}/>
                </div>

                <ErrorIndicator
                  issue
                  trackErrors={['issueVolume']}
                  errorMessages={props.errorMessages}
                  errorUtility={props.errorUtility}
                  allErrors={props.errors}/>
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
                          className={`height32 ${(errors.volumedoi || errors.dupevolumedoi || errors.invalidvolumedoi || errors.dupeDois || errors.invalidVolumeDoiPrefix) && 'fieldError'} ${props.volumeDoiDisabled && 'disabledDoi'}`}
                          type='text'
                          name='issue.volumeDoi'
                          onChange={props.handler}
                          value={props.issue.volumeDoi}
                          disabled={props.volumeDoiDisabled}
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
                          onChange={props.handler}
                          value={props.issue.volumeUrl}
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
              addHandler={props.addSubItem}
              boundSetState={props.boundSetState}
              showSection={props.showSection}>
                <ErrorIndicator
                  trackErrors={['contributorLastName', 'contributorRole']}
                  errorMessages={[]}
                  errorUtility={props.errorUtility}
                  allErrors={props.errors}/>

                {props.optionalIssueInfo.map((data, i)=>
                  <OptionalIssueInfo
                    key={i}
                    openSubItems={props.openSubItems}
                    validate={props.validate}
                    optionalIssueInfo={data}
                    handler={props.boundSetState}
                    remove={props.removeSubItem}
                    data={props.optionalIssueInfo}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                    tooltip={props.showHelper}
                    errorMessages={props.errorMessages}
                    errorUtility={props.errorUtility}
                    allErrors={props.errors}
                    index={i}/>
                )}
            </SubItem>
            <div className='saveButtonAddIssueHolder'>
              <div onClick={props.save} className='saveButton addIssue actionTooltip'>
                Save
              </div>
              <button onClick={props.closeModal} type='button' className='cancelButton addIssue'>Close</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}