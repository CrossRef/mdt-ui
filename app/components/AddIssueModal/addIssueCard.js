import React from 'react'
import is from 'prop-types'
import Switch from 'react-toggle-switch'

import { ArchiveLocations } from '../../utilities/lists/archiveLocations'
import SubItem from '../Common/subItem'
import OptionalIssueInfo from './optionalIssueInfo'
import {urlEntered, doiEntered} from  '../../utilities/helpers'
import TooltipBubble from '../Common/tooltipBubble'
import FormInput from '../Common/formInput'
import FormSelect from '../Common/formSelect'
import FormDate from '../Common/formDate'
import ErrorIndicator from '../Common/errorIndicator'
import {issueTooltips as tooltips} from '../../utilities/lists/tooltipMessages'




AddIssueCard.propTypes = {
  save: is.func.isRequired,
  handler: is.func.isRequired,
  closeModal: is.func.isRequired,
  helperSwitch: is.func.isRequired,
  errorUtility: is.object.isRequired,
  boundSetState: is.func.isRequired,
  tooltipUtility: is.object.isRequired,
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
                    error={errors.issueVolume || (!!props.issue.issue && errors.dupTitleIdIssue) || errors.issueNumberLimit}
                    trackErrors={['issueVolume', props.issue.issue ? 'dupTitleIdIssue' : '', 'issueNumberLimit']}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    tooltip={props.showHelper && tooltips.issueNumber}
                    tooltipUtility={props.tooltipUtility}
                    onBlur={props.validate}
                    required={!props.issue.volume}/>

                  <FormInput
                    label="Issue Title"
                    name="issue.issueTitle"
                    value={props.issue.issueTitle}
                    changeHandler={props.handler}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    tooltip={props.showHelper && tooltips.issueTitle}
                    tooltipUtility={props.tooltipUtility}/>
                </div>

                <ErrorIndicator
                  issue
                  trackErrors={['issueVolume', props.issue.issue ? 'dupTitleIdIssue' : '', 'issueNumberLimit']}
                  errorMessages={props.errorMessages}
                  errorUtility={props.errorUtility}
                  tooltipUtility={props.tooltipUtility}
                  allErrors={props.errors}/>

                {props.showHelper && <TooltipBubble issue tooltipUtility={props.tooltipUtility} errorUtility={props.errorUtility}/>}

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
                    tooltipUtility={props.tooltipUtility}
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
                    tooltipUtility={props.tooltipUtility}
                    onBlur={props.validate}
                    required={issueDoiDataRequired}/>
                </div>

                <ErrorIndicator
                  issue
                  trackErrors={['issuedoi', 'dupeissuedoi', 'invalidissuedoi', 'invalidIssueDoiPrefix', 'issueUrl', 'invalidissueurl']}
                  errorMessages={props.errorMessages}
                  errorUtility={props.errorUtility}
                  tooltipUtility={props.tooltipUtility}
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
                    tooltipUtility={props.tooltipUtility}
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
                    tooltipUtility={props.tooltipUtility}
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
                  tooltipUtility={props.tooltipUtility}
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
                    tooltipUtility={props.tooltipUtility}
                    changeHandler={props.handler}
                    onSelect={props.validate}/>

                  <FormInput
                    label="Special Issue Number"
                    name="issue.specialIssueNumber"
                    value={props.issue.specialIssueNumber}
                    error={errors.specialNumberLimit}
                    trackErrors={['specialNumberLimit']}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    onBlur={props.validate}
                    changeHandler={props.handler}
                    tooltip={props.showHelper && tooltips.specialNumber}
                    tooltipUtility={props.tooltipUtility}/>
                </div>

                <ErrorIndicator
                  issue
                  trackErrors={['specialNumberLimit']}
                  errorMessages={props.errorMessages}
                  errorUtility={props.errorUtility}
                  tooltipUtility={props.tooltipUtility}
                  allErrors={props.errors}/>
              </div>


              <hr />

              <div className='row'>
                <div className='fieldHolder'>
                  <FormInput
                    label="Volume"
                    name="issue.volume"
                    value={props.issue.volume}
                    changeHandler={props.handler}
                    error={errors.volumeIssue || (!!props.issue.volume && errors.dupTitleIdVolume) || errors.volumeNumberLimit}
                    trackErrors={['volumeIssue', props.issue.volume ? 'dupTitleIdVolume' : '', 'volumeNumberLimit']}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    tooltip={props.showHelper && tooltips.volumeNumber}
                    tooltipUtility={props.tooltipUtility}
                    onBlur={props.validate}
                    required={!props.issue.issue || volumeSectionRequired}/>
                </div>

                <ErrorIndicator
                  issue
                  trackErrors={['volumeIssue', props.issue.volume ? 'dupTitleIdVolume' : '', 'volumeNumberLimit']}
                  errorMessages={props.errorMessages}
                  errorUtility={props.errorUtility}
                  tooltipUtility={props.tooltipUtility}
                  allErrors={props.errors}/>
              </div>


              <div className='row'>
                <div className='fieldHolder'>
                  <FormInput
                    label="Volume DOI"
                    name="issue.volumeDoi"
                    value={props.issue.volumeDoi}
                    changeHandler={props.handler}
                    disabled={props.volumeDoiDisabled}
                    error={errors.volumedoi || errors.dupevolumedoi || errors.invalidvolumedoi || errors.dupeDois || errors.invalidVolumeDoiPrefix}
                    trackErrors={['volumedoi', 'dupevolumedoi', 'invalidvolumedoi', 'dupeDois', 'invalidVolumeDoiPrefix']}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    tooltip={props.showHelper && tooltips.volumeDoi}
                    tooltipUtility={props.tooltipUtility}
                    onBlur={props.validate}
                    required={volumeSectionRequired}/>

                  <FormInput
                    label="Volume URL"
                    name="issue.volumeUrl"
                    value={props.issue.volumeUrl}
                    changeHandler={props.handler}
                    error={errors.volumeUrl || errors.invalidvolumeurl}
                    trackErrors={['volumeUrl', 'invalidvolumeurl']}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    tooltip={props.showHelper && tooltips.volumeUrl}
                    tooltipUtility={props.tooltipUtility}
                    onBlur={props.validate}
                    required={volumeSectionRequired}/>
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
                  trackErrors={['contributorLastName', 'contributorRole', 'contributorSuffixLimit']}
                  errorMessages={[]}
                  errorUtility={props.errorUtility}
                  tooltipUtility={props.tooltipUtility}
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
                    tooltipUtility={props.tooltipUtility}
                    tooltip={props.showHelper}
                    errorMessages={props.errorMessages}
                    errorUtility={props.errorUtility}
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