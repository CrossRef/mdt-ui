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
import References from './SubItems/references'
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
  tooltipUtility: is.object.isRequired,
  errorUtility: is.object.isRequired,
  crossmarkUtility: is.object.isRequired
}


export default function AddArticleView (props) {

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
                          onClick={() => props.boundSetState({
                            showHelper: !props.showHelper,
                            focusedInput: ''
                          })}
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
                    required
                    error={props.errors.title}
                    indicatorErrors={['title']}
                    changeHandler={props.handleChange}
                    tooltipUtility={props.tooltipUtility}
                    errorUtility={props.errorUtility}
                    onBlur={props.validate}/>
                </div>

                <ErrorIndicator
                  indicatorErrors={['title']}
                  allErrors={props.errors}
                  errorMessages={props.errorMessages}
                  tooltipUtility={props.tooltipUtility}
                  errorUtility={props.errorUtility}/>


                {props.showHelper &&
                  <TooltipBubble
                    errorUtility={props.errorUtility}
                    tooltipUtility={props.tooltipUtility}/>}


                {props.error &&
                  <StickyError errorUtility={props.errorUtility}/>}

              </div>

              <div className='row'>
                <OptionalTitleData
                  show={props.showOptionalTitleData}
                  toggleFields={props.toggleFields}
                  subtitle={props.article.subtitle}
                  originallanguagetitle={props.article.originallanguagetitle}
                  originallanguagetitlesubtitle={props.article.originallanguagetitlesubtitle}
                  validate={props.validate}
                  tooltipUtility={props.tooltipUtility}
                  tooltip={props.showHelper}
                  errorUtility={props.errorUtility}
                  handleChange={props.handleChange}/>
              </div>

              <div className='row'>
                <div className="fieldHolder">
                  <FormInput
                    label="Article DOI (Required)"
                    name="doi"
                    value={props.article.doi}
                    required
                    errorUtility={props.errorUtility}
                    error={props.errors.doi || props.errors.dupedoi || props.errors.invaliddoi || props.errors.invalidDoiPrefix}
                    indicatorErrors={['doi', 'dupedoi', 'invaliddoi', 'invalidDoiPrefix']}
                    tooltip={props.showHelper && tooltip.doi}
                    tooltipUtility={props.tooltipUtility}
                    disabled={props.doiDisabled}
                    changeHandler={props.handleChange}
                    onBlur={props.validate}/>

                  <FormInput
                    label="Article URL (Required)"
                    name="url"
                    value={ urlEntered(props.article.url) ? props.article.url : 'http://' }
                    required
                    error={props.errors.url || props.errors.invalidurl}
                    indicatorErrors={['url', 'invalidurl']}
                    errorUtility={props.errorUtility}
                    tooltip={props.showHelper && tooltip.url}
                    tooltipUtility={props.tooltipUtility}
                    changeHandler={props.handleChange}
                    onBlur={props.validate}/>
                </div>

                <ErrorIndicator
                  indicatorErrors={['doi', 'dupedoi', 'invaliddoi', 'invalidDoiPrefix', 'url', 'invalidurl']}
                  allErrors={props.errors}
                  errorMessages={props.errorMessages}
                  tooltipUtility={props.tooltipUtility}
                  errorUtility={props.errorUtility}/>
              </div>

              <DatesRow
                article={props.article}
                errors={props.errors}
                handleChange={props.handleChange}
                validate={props.validate}
                tooltipUtility={props.tooltipUtility}
                tooltip={props.showHelper}
                errorUtility={props.errorUtility}
                errorMessages={props.errorMessages}
                activeCalendar={props.activeCalendar}
                calendarHandler={props.calendarHandler}
              />

              <div className='row'>
                <div className='fieldHolder'>
                  <FormInput
                    label="First Page"
                    name="firstPage"
                    value={props.article.firstPage}
                    required={!!props.article.lastPage}
                    error={props.errors.firstPage || props.errors.firstPageLimit}
                    indicatorErrors={['firstPage', 'firstPageLimit']}
                    errorUtility={props.errorUtility}
                    changeHandler={props.handleChange}
                    tooltipUtility={props.tooltipUtility}
                    onBlur={props.validate}/>

                  <FormInput
                    label="Last Page"
                    name="lastPage"
                    value={props.article.lastPage}
                    error={props.errors.lastPageLimit || props.errors.lastPageLessFirst}
                    indicatorErrors={['lastPageLimit', 'lastPageLessFirst']}
                    changeHandler={props.handleChange}
                    errorUtility={props.errorUtility}
                    tooltipUtility={props.tooltipUtility}
                    onBlur={props.validate}/>
                </div>

                <ErrorIndicator
                  indicatorErrors={['firstPage', 'firstPageLimit', 'lastPageLimit', 'lastPageLessFirst']}
                  allErrors={props.errors}
                  errorMessages={props.errorMessages}
                  tooltipUtility={props.tooltipUtility}
                  errorUtility={props.errorUtility}/>
              </div>

              <div className='row'>
                <div className='fieldHolder'>
                  <FormInput
                    label="Article / Electronic Location ID"
                    name="locationId"
                    value={props.article.locationId}
                    error={props.errors.locationIdLimit}
                    indicatorErrors={['locationIdLimit']}
                    changeHandler={props.handleChange}
                    onBlur={props.validate}
                    errorUtility={props.errorUtility}
                    tooltipUtility={props.tooltipUtility}
                    tooltip={props.showHelper && tooltip.locationId}/>
                </div>

                <ErrorIndicator
                  indicatorErrors={['locationIdLimit']}
                  allErrors={props.errors}
                  errorMessages={props.errorMessages}
                  tooltipUtility={props.tooltipUtility}
                  errorUtility={props.errorUtility}/>
              </div>

              <div className='row'>
                <div className='fieldHolder'>
                  <FormTextArea
                    label="Abstract"
                    name="abstract"
                    value={props.article.abstract}
                    errorUtility={props.errorUtility}
                    tooltip={props.showHelper && tooltip.abstract}
                    tooltipUtility={props.tooltipUtility}
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
                  indicatorErrors={['contributorLastName', 'contributorRole', 'contributorGroupName', 'contributorGroupRole', 'contributorSuffixLimit']}
                  errorUtility={props.errorUtility}
                  tooltipUtility={props.tooltipUtility}
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
                    tooltipUtility={props.tooltipUtility}
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
                    tooltipUtility={props.tooltipUtility}
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
                  indicatorErrors={['licenseUrl', 'licenseUrlInvalid', 'licenseDateInvalid', 'licenseDateIncomplete']}
                  errorUtility={props.errorUtility}
                  tooltipUtility={props.tooltipUtility}
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
                        errorUtility={props.errorUtility}
                        changeHandler={props.handleChange}
                        tooltipUtility={props.tooltipUtility}
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
                    tooltipUtility={props.tooltipUtility}
                    activeCalendar={props.activeCalendar}
                    calendarHandler={props.calendarHandler}
                    freetolicense={i===0 ? props.article.freetolicense : ''}/>
                )}
            </SubItem>


            <SubItem
              title={'References'}
              boundSetState={props.boundSetState}
              openSubItems={props.openSubItems}
              showSection={props.openItems.References}>


                <References references={props.references} setReferences={props.boundSetState}/>
            </SubItem>


            <SubItem
              title={'Related Items'}
              boundSetState={props.boundSetState}
              openSubItems={props.openSubItems}
              showSection={props.openItems.RelatedItems}
              addHandler={props.addSection.bind(null, 'relatedItems')}>
                <ErrorIndicator
                  indicatorErrors={['relatedItemIdType', 'relatedItemRelType', 'relatedItemDoiInvalid']}
                  errorUtility={props.errorUtility}
                  tooltipUtility={props.tooltipUtility}
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
                    tooltipUtility={props.tooltipUtility}
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
                  indicatorErrors={['simCheckUrlInvalid']}
                  errorUtility={props.errorUtility}
                  tooltipUtility={props.tooltipUtility}
                  allErrors={props.errors}/>

                <AdditionalInformation
                  addInfo={props.addInfo}
                  handler={props.boundSetState}
                  validate={props.validate}
                  tooltip={props.showHelper}
                  tooltipUtility={props.tooltipUtility}
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
                    indicatorErrors={crossmarkErrors}
                    errorUtility={props.errorUtility}
                    tooltipUtility={props.tooltipUtility}
                    allErrors={props.errors}/>

                  <Crossmark
                    crossmarkUtility={props.crossmarkUtility}
                    crossmarkCards={props.crossmarkCards}
                    validate={props.validate}
                    tooltip={props.showHelper}
                    tooltipUtility={props.tooltipUtility}
                    errorMessages={props.errorMessages}
                    errorUtility={props.errorUtility}
                    activeCalendar={props.activeCalendar}
                    calendarHandler={props.calendarHandler}
                    reduxDeleteCard={props.reduxDeleteCard}/>
              </SubItem>
            }

          </div>
        </form>
      </div>
    </div>
  )
}
