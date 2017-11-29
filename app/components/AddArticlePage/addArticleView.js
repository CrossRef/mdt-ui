import React, { Component } from 'react'
import is from 'prop-types'
import Switch from 'react-toggle-switch'

import {routes} from '../../routing'
import SubItem from '../Common/subItem'
import ActionBar from './actionBar'
import { InfoBubble, InfoHelperRow, OptionalTitleData, DatesRow } from './articleFormComponents'
import TooltipBubble from '../Common/tooltipBubble'
import Contributor from './SubItems/contributor'
import Funding from './SubItems/funding'
import License from './SubItems/license'
import RelatedItems from './SubItems/relatedItems'
import AdditionalInformation from './SubItems/additionalInfo'
import { Crossmark, CrossmarkAddButton } from './SubItems/Crossmark/crossmark'
import FormInput from '../Common/formInput'
import FormTextArea from '../Common/formTextArea'
import FormSelect from '../Common/formSelect'
import ErrorIndicator from '../Common/errorIndicator'
import StickyError from '../Common/stickyError'
import {urlEntered} from '../../utilities/helpers'
import {crossmarkErrors} from '../../utilities/crossmarkHelpers'
import {articleTooltips as tooltip} from '../../utilities/lists/tooltipMessages'




AddArticleView.propTypes = {
  back: is.func.isRequired,
  addToCart: is.func.isRequired,
  save: is.func.isRequired,
  validate: is.func.isRequired,
  openReviewArticleModal: is.func.isRequired,
  handleChange: is.func.isRequired,
  toggleFields: is.func.isRequired,
  boundSetState: is.func.isRequired,
  removeSection: is.func.isRequired,
  addSection: is.func.isRequired,
  deferredTooltipBubbleRefresh: is.object.isRequired,
  errorUtility: is.object.isRequired,
  crossmarkUtility: is.object.isRequired
}


export default function AddArticleView (props) {

  const errors = props.errors

  return (
    <div>

      <div className='addarticlecard'>

        <form className='addArticleForm'>

          <ActionBar
            back={props.back}
            addToCart={props.addToCart}
            save={props.save}
            openReviewArticleModal={props.openReviewArticleModal}
            saving={props.saving}
            inCart={props.inCart}
            criticalErrors={props.criticalErrors}/>

          <div className='articleInnerForm'>

            <div className="topbar">
              <div className="titleholder">
                <div className="titleinnerholder">
                  <div className='titleIconHolder'>
                    <img src={`${routes.images}/AddArticle/Asset_Icons_White_Write.svg`} />
                  </div>
                  <div className='articletitle'>
                    {props.article.title}
                  </div>
                </div>
              </div>
            </div>


            <div className='body'>

              <div className='row infohelper'>
                <div className="fieldHolder">
                  <div className="fieldinnerholder fulllength">
                    <div className="labelholder">
                      <div className="labelinnerholder">
                        <div className='label'>* Indicates Required fields</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="errorHolder">
                  <div className="switchOuterHolder">
                    <div className="switchInnerHolder">
                      <div className="switchLicense">
                        <div className='switchLabel'><span>Show Help</span></div>
                        <Switch
                          onClick={() => props.boundSetState({showHelper: !props.showHelper})}
                          on={props.showHelper}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='fieldHolder'>
                  <FormTextArea
                    label="Article Title (Required)"
                    name="title"
                    value={props.article.title}
                    required={true}
                    error={props.errors.title}
                    trackErrors={['title']}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    changeHandler={props.handleChange}
                    onBlur={props.validate}/>
                </div>

                <ErrorIndicator
                  trackErrors={['title']}
                  allErrors={props.errors}
                  errorMessages={props.errorMessages}
                  errorUtility={props.errorUtility}/>


                {props.showHelper &&
                  <TooltipBubble
                    errorUtility={props.errorUtility}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}/>
                }

                {props.error &&
                  <StickyError
                    errorUtility={props.errorUtility}
                    deferredStickyErrorRefresh={props.deferredStickyErrorRefresh}
                  />
                }


              </div>

              <div className='row'>
                <OptionalTitleData
                  show={props.showOptionalTitleData}
                  toggleFields={props.toggleFields}
                  subtitle={props.article.subtitle}
                  originallanguagetitle={props.article.originallanguagetitle}
                  originallanguagetitlesubtitle={props.article.originallanguagetitlesubtitle}
                  validate={props.validate}
                  deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                  tooltip={props.showHelper}
                  setErrorMessages={props.errorUtility.setErrorMessages}
                  handleChange={props.handleChange}/>
              </div>

              <div className='row'>
                <div className="fieldHolder">
                  <FormInput
                    label="Article DOI (Required)"
                    name="doi"
                    value={props.article.doi}
                    required={true}
                    error={props.errors.doi || props.errors.dupedoi || props.errors.invaliddoi || props.errors.invalidDoiPrefix}
                    trackErrors={['doi', 'dupedoi', 'invaliddoi', 'invalidDoiPrefix']}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    tooltip={props.showHelper && tooltip.doi}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                    disabled={props.doiDisabled}
                    changeHandler={props.handleChange}
                    onBlur={props.validate}/>

                  <FormInput
                    label="Article URL (Required)"
                    name="url"
                    value={ urlEntered(props.article.url) ? props.article.url : 'http://' }
                    required={true}
                    error={props.errors.url || props.errors.invalidurl}
                    trackErrors={['url', 'invalidurl']}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    tooltip={props.showHelper && tooltip.url}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                    changeHandler={props.handleChange}
                    onBlur={props.validate}/>
                </div>

                <ErrorIndicator
                  trackErrors={['doi', 'dupedoi', 'invaliddoi', 'invalidDoiPrefix', 'url', 'invalidurl']}
                  allErrors={props.errors}
                  errorMessages={props.errorMessages}
                  errorUtility={props.errorUtility}/>
              </div>

              <DatesRow
                article={props.article}
                errors={props.errors}
                handleChange={props.handleChange}
                validate={props.validate}
                deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                tooltip={props.showHelper}
                errorUtility={props.errorUtility}
                errorMessages={props.errorMessages}
              />

              <div className='row'>
                <div className='fieldHolder'>
                  <FormInput
                    label="First Page"
                    name="firstPage"
                    value={props.article.firstPage}
                    required={!!props.article.lastPage}
                    error={props.errors.firstPage}
                    trackErrors={['firstPage']}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    changeHandler={props.handleChange}
                    onBlur={props.validate}/>

                  <FormInput
                    label="Last Page"
                    name="lastPage"
                    value={props.article.lastPage}
                    changeHandler={props.handleChange}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    onBlur={props.validate}/>
                </div>

                <ErrorIndicator
                  trackErrors={['firstPage']}
                  allErrors={props.errors}
                  errorMessages={props.errorMessages}
                  errorUtility={props.errorUtility}/>
              </div>

              <div className='row'>
                <div className='fieldHolder'>
                  <FormInput
                    label="Article / Electronic Location ID"
                    name="locationId"
                    value={props.article.locationId}
                    changeHandler={props.handleChange}
                    onBlur={props.validate}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                    tooltip={props.showHelper && tooltip.locationId}/>
                </div>
              </div>

              <div className='row'>
                <div className='fieldHolder'>
                  <FormTextArea
                    label="Abstract"
                    name="abstract"
                    value={props.article.abstract}
                    setErrorMessages={props.errorUtility.setErrorMessages}
                    tooltip={props.showHelper && tooltip.abstract}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                    changeHandler={props.handleChange}/>
                </div>
              </div>

            </div>


            <SubItem
              title={'Contributor'}
              boundSetState={props.boundSetState}
              openSubItems={props.openSubItems}
              showSection={props.openItems.Contributors}
              addHandler={props.addSection.bind(null, 'contributors')}>
                <ErrorIndicator
                  trackErrors={['contributorLastName', 'contributorRole', 'contributorGroupName', 'contributorGroupRole']}
                  errorMessages={[]}
                  errorUtility={props.errorUtility}
                  allErrors={props.errors}/>

                {props.contributors.map((data, i)=>
                  <Contributor
                    openSubItems={props.openSubItems}
                    validate={props.validate}
                    key={i}
                    contributor={data}
                    remove={props.removeSection.bind(null, 'contributors', i)}
                    handler={props.boundSetState}
                    data={props.contributors}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                    tooltip={props.showHelper}
                    errorMessages={props.errorMessages}
                    errorUtility={props.errorUtility}
                    allErrors={props.errors}
                    index={i}/>
                )}
            </SubItem>


            <SubItem
              title={'Funding'}
              boundSetState={props.boundSetState}
              openSubItems={props.openSubItems}
              showSection={props.openItems.Funding}
              addHandler={props.addSection.bind(null, 'funding')}>
                {props.funding.map((data, i)=>
                  <Funding
                    openSubItems={props.openSubItems}
                    validate={props.validate}
                    key={i}
                    funding={data}
                    remove={props.removeSection.bind(null, 'funding', i)}
                    handler={props.boundSetState}
                    data={props.funding}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                    tooltip={props.showHelper}
                    index={i}/>
                )}
            </SubItem>


            <SubItem
              title={'License'}
              boundSetState={props.boundSetState}
              openSubItems={props.openSubItems}
              showSection={props.openItems.Licenses}
              addHandler={props.addSection.bind(null, 'license')}>
                <ErrorIndicator
                  trackErrors={['licenseUrl', 'licenseUrlInvalid', 'licenseDateInvalid', 'licenseDateIncomplete']}
                  errorMessages={[]}
                  errorUtility={props.errorUtility}
                  allErrors={props.errors}/>

                <div className="freeToLicense">
                  <div className='row'>
                    <div className='fieldHolder'>
                      <FormSelect
                        label="Free to License"
                        name="freetolicense"
                        value={props.article.freetolicense}
                        options={[
                            {value: 'yes', name: 'Yes'},
                            {value: 'no', name: 'No'}
                        ]}
                        setErrorMessages={props.errorUtility.setErrorMessages}
                        changeHandler={props.handleChange}
                        deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                        tooltip={props.showHelper && tooltip.freeToLicense}
                        onSelect={props.validate}/>
                    </div>
                  </div>
                </div>

                {props.license.map((data, i)=>
                  <License
                    openSubItems={props.openSubItems}
                    validate={props.validate}
                    key={i}
                    license={data}
                    remove={props.removeSection.bind(null, 'license', i)}
                    handler={props.boundSetState}
                    data={props.license}
                    index={i}
                    errorMessages={props.errorMessages}
                    errorUtility={props.errorUtility}
                    allErrors={props.errors}
                    tooltip={props.showHelper}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                    freetolicense={i===0 ? props.article.freetolicense : ''}/>
                )}
            </SubItem>


            <SubItem
              title={'Related Items'}
              boundSetState={props.boundSetState}
              openSubItems={props.openSubItems}
              showSection={props.openItems.relatedItems}
              addHandler={props.addSection.bind(null, 'relatedItems')}>
                <ErrorIndicator
                  trackErrors={['relatedItemIdType', 'relatedItemRelType', 'relatedItemDoiInvalid']}
                  errorMessages={[]}
                  errorUtility={props.errorUtility}
                  allErrors={props.errors}/>

                {props.relatedItems.map((data, i)=>
                  <RelatedItems
                    openSubItems={props.openSubItems}
                    validate={props.validate}
                    key={i}
                    relateditem={data}
                    remove={props.removeSection.bind(null, 'relatedItems', i)}
                    handler={props.boundSetState}
                    data={props.relatedItems}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                    tooltip={props.showHelper}
                    errorMessages={props.errorMessages}
                    errorUtility={props.errorUtility}
                    allErrors={props.errors}
                    index={i}/>
                )}
            </SubItem>


            <SubItem
              title={'Additional Information'}
              boundSetState={props.boundSetState}
              openSubItems={props.openSubItems}
              showSection={props.openItems.addInfo}>
                <ErrorIndicator
                  trackErrors={['simCheckUrlInvalid']}
                  errorMessages={[]}
                  errorUtility={props.errorUtility}
                  allErrors={props.errors}/>

                <AdditionalInformation
                  addInfo={props.addInfo}
                  handler={props.boundSetState}
                  validate={props.validate}
                  tooltip={props.showHelper}
                  deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                  errorMessages={props.errorMessages}
                  errorUtility={props.errorUtility}
                  allErrors={props.errors}
                  simCheckError={props.errors.simCheckUrlInvalid}/>
            </SubItem>


            {props.crossmark &&
              <SubItem
                title={'Crossmark'}
                boundSetState={props.boundSetState}
                showSection={!!Object.keys(props.crossmarkCards).length || !!props.reduxForm.size}
                openSubItems={props.openSubItems}>
                  <ErrorIndicator
                    trackErrors={crossmarkErrors}
                    errorMessages={[]}
                    errorUtility={props.errorUtility}
                    allErrors={props.errors}/>

                  <Crossmark
                    crossmarkUtility={props.crossmarkUtility}
                    crossmarkCards={props.crossmarkCards}
                    validate={props.validate}
                    tooltip={props.showHelper}
                    deferredTooltipBubbleRefresh={props.deferredTooltipBubbleRefresh}
                    errorMessages={props.errorMessages}
                    errorUtility={props.errorUtility}
                    reduxDeleteCard={props.reduxDeleteCard}/>
              </SubItem>
            }

          </div>
        </form>
      </div>
    </div>
  )
}
