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
import {urlEntered} from '../../utilities/helpers'
import {articleTooltips as tooltip} from '../../utilities/lists/tooltipMessages'








export default class AddArticleView extends Component {

  static propTypes = {
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
    errorUtility: is.object.isRequired
  }

  render () {
    const errors = this.props.errors

    return (
      <div>

        <div className='addarticlecard'>

          <form className='addArticleForm'>

            <ActionBar
              back={this.props.back}
              addToCart={this.props.addToCart}
              save={this.props.save}
              openReviewArticleModal={this.props.openReviewArticleModal}
              saving={this.props.saving}
              inCart={this.props.inCart}
              criticalErrors={this.props.criticalErrors}/>

            <div className='articleInnerForm'>

              <div className="topbar">
                <div className="titleholder">
                  <div className="titleinnerholder">
                    <div className='titleIconHolder'>
                      <img src={`${routes.images}/AddArticle/Asset_Icons_White_Write.svg`} />
                    </div>
                    <div className='articletitle'>
                      {this.props.article.title}
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
                            onClick={() => this.props.boundSetState({showHelper: !this.props.showHelper})}
                            on={this.props.showHelper}
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
                      value={this.props.article.title}
                      required={true}
                      error={this.props.errors.title}
                      trackErrors={['title']}
                      setErrorMessages={this.props.errorUtility.setErrorMessages}
                      changeHandler={this.props.handleChange}
                      onBlur={this.props.validate}/>
                  </div>

                  <ErrorIndicator
                    trackErrors={['title']}
                    allErrors={this.props.errors}
                    errorMessages={this.props.errorMessages}
                    errorUtility={this.props.errorUtility}/>


                  {this.props.showHelper &&
                    <TooltipBubble
                      errorUtility={this.props.errorUtility}
                      deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}/> }

                </div>

                <div className='row'>
                  <OptionalTitleData
                    show={this.props.showOptionalTitleData}
                    toggleFields={this.props.toggleFields}
                    subtitle={this.props.article.subtitle}
                    originallanguagetitle={this.props.article.originallanguagetitle}
                    originallanguagetitlesubtitle={this.props.article.originallanguagetitlesubtitle}
                    validate={this.props.validate}
                    deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                    tooltip={this.props.showHelper}
                    setErrorMessages={this.props.errorUtility.setErrorMessages}
                    handleChange={this.props.handleChange}/>
                </div>

                <div className='row'>
                  <div className="fieldHolder">
                    <FormInput
                      label="Article DOI (Required)"
                      name="doi"
                      value={this.props.article.doi}
                      required={true}
                      error={this.props.errors.doi || this.props.errors.dupedoi || this.props.errors.invaliddoi || this.props.errors.invalidDoiPrefix}
                      trackErrors={['doi', 'dupedoi', 'invaliddoi', 'invalidDoiPrefix']}
                      setErrorMessages={this.props.errorUtility.setErrorMessages}
                      disabled={this.props.doiDisabled}
                      changeHandler={this.props.handleChange}
                      onBlur={this.props.validate}/>

                    <FormInput
                      label="Article URL (Required)"
                      name="url"
                      value={ urlEntered(this.props.article.url) ? this.props.article.url : 'http://' }
                      required={true}
                      error={this.props.errors.url || this.props.errors.invalidurl}
                      trackErrors={['url', 'invalidurl']}
                      setErrorMessages={this.props.errorUtility.setErrorMessages}
                      changeHandler={this.props.handleChange}
                      onBlur={this.props.validate}/>
                  </div>

                  <ErrorIndicator
                    trackErrors={['doi', 'dupedoi', 'invaliddoi', 'invalidDoiPrefix', 'url', 'invalidurl']}
                    allErrors={this.props.errors}
                    errorMessages={this.props.errorMessages}
                    errorUtility={this.props.errorUtility}/>
                </div>

                <DatesRow
                  article={this.props.article}
                  errors={this.props.errors}
                  handleChange={this.props.handleChange}
                  validate={this.props.validate}
                  deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                  tooltip={this.props.showHelper}
                  errorUtility={this.props.errorUtility}
                  errorMessages={this.props.errorMessages}
                />

                <div className='row'>
                  <div className='fieldHolder'>
                    <FormInput
                      label="First Page"
                      name="firstPage"
                      value={this.props.article.firstPage}
                      required={!!this.props.article.lastPage}
                      error={this.props.errors.firstPage}
                      trackErrors={['firstPage']}
                      setErrorMessages={this.props.errorUtility.setErrorMessages}
                      changeHandler={this.props.handleChange}
                      onBlur={this.props.validate}/>

                    <FormInput
                      label="Last Page"
                      name="lastPage"
                      value={this.props.article.lastPage}
                      changeHandler={this.props.handleChange}
                      setErrorMessages={this.props.errorUtility.setErrorMessages}
                      onBlur={this.props.validate}/>
                  </div>

                  <ErrorIndicator
                    trackErrors={['firstPage']}
                    allErrors={this.props.errors}
                    errorMessages={this.props.errorMessages}
                    errorUtility={this.props.errorUtility}/>
                </div>

                <div className='row'>
                  <div className='fieldHolder'>
                    <FormInput
                      label="Article / Electronic Location ID"
                      name="locationId"
                      value={this.props.article.locationId}
                      changeHandler={this.props.handleChange}
                      onBlur={this.props.validate}
                      setErrorMessages={this.props.errorUtility.setErrorMessages}
                      deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                      tooltip={this.props.showHelper && tooltip.locationId}/>
                  </div>
                </div>

                <div className='row'>
                  <div className='fieldHolder'>
                    <FormTextArea
                      label="Abstract"
                      name="abstract"
                      value={this.props.article.abstract}
                      setErrorMessages={this.props.errorUtility.setErrorMessages}
                      changeHandler={this.props.handleChange}/>
                  </div>
                </div>

              </div>


              <SubItem
                title={'Contributor'}
                openSubItems={this.props.openSubItems}
                showSection={this.props.openItems.Contributors}
                addHandler={this.props.addSection.bind(null, 'contributors')}>
                  <ErrorIndicator
                    trackErrors={['contributorLastName', 'contributorRole', 'contributorGroupName', 'contributorGroupRole']}
                    errorMessages={[]}
                    errorUtility={this.props.errorUtility}
                    allErrors={this.props.errors}/>

                  {this.props.contributors.map((data, i)=>
                    <Contributor
                      openSubItems={this.props.openSubItems}
                      validate={this.props.validate}
                      key={i}
                      contributor={data}
                      remove={this.props.removeSection.bind(null, 'contributors', i)}
                      handler={this.props.boundSetState}
                      data={this.props.contributors}
                      deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                      tooltip={this.props.showHelper}
                      errorMessages={this.props.errorMessages}
                      errorUtility={this.props.errorUtility}
                      allErrors={this.props.errors}
                      index={i}/>
                  )}
              </SubItem>


              <SubItem
                title={'Funding'}
                openSubItems={this.props.openSubItems}
                showSection={this.props.openItems.Funding}
                addHandler={this.props.addSection.bind(null, 'funding')}>
                  {this.props.funding.map((data, i)=>
                    <Funding
                      openSubItems={this.props.openSubItems}
                      validate={this.props.validate}
                      key={i}
                      funding={data}
                      remove={this.props.removeSection.bind(null, 'funding', i)}
                      handler={this.props.boundSetState}
                      data={this.props.funding}
                      deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                      tooltip={this.props.showHelper}
                      index={i}/>
                  )}
              </SubItem>


              <SubItem
                title={'License'}
                openSubItems={this.props.openSubItems}
                showSection={this.props.openItems.Licenses}
                addHandler={this.props.addSection.bind(null, 'license')}>
                  <ErrorIndicator
                    trackErrors={['licenseUrl', 'licenseUrlInvalid', 'licenseDateInvalid', 'licenseDateIncomplete']}
                    errorMessages={[]}
                    errorUtility={this.props.errorUtility}
                    allErrors={this.props.errors}/>

                  <div className="freeToLicense">
                    <div className='row'>
                      <div className='fieldHolder'>
                        <FormSelect
                          label="Free to License"
                          name="freetolicense"
                          value={this.props.article.freetolicense}
                          options={[
                              {value: 'yes', name: 'Yes'},
                              {value: 'no', name: 'No'}
                          ]}
                          setErrorMessages={this.props.errorUtility.setErrorMessages}
                          changeHandler={this.props.handleChange}
                          onSelect={this.props.validate}/>
                      </div>
                    </div>
                  </div>

                  {this.props.license.map((data, i)=>
                    <License
                      openSubItems={this.props.openSubItems}
                      validate={this.props.validate}
                      key={i}
                      license={data}
                      remove={this.props.removeSection.bind(null, 'license', i)}
                      handler={this.props.boundSetState}
                      data={this.props.license}
                      index={i}
                      errorMessages={this.props.errorMessages}
                      errorUtility={this.props.errorUtility}
                      allErrors={this.props.errors}
                      freetolicense={i===0 ? this.props.article.freetolicense : ''}/>
                  )}
              </SubItem>


              <SubItem
                title={'Related Items'}
                openSubItems={this.props.openSubItems}
                showSection={this.props.openItems.relatedItems}
                addHandler={this.props.addSection.bind(null, 'relatedItems')}>
                  <ErrorIndicator
                    trackErrors={['relatedItemIdType', 'relatedItemRelType', 'relatedItemDoiInvalid']}
                    errorMessages={[]}
                    errorUtility={this.props.errorUtility}
                    allErrors={this.props.errors}/>

                  {this.props.relatedItems.map((data, i)=>
                    <RelatedItems
                      openSubItems={this.props.openSubItems}
                      validate={this.props.validate}
                      key={i}
                      relateditem={data}
                      remove={this.props.removeSection.bind(null, 'relatedItems', i)}
                      handler={this.props.boundSetState}
                      data={this.props.relatedItems}
                      deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                      tooltip={this.props.showHelper}
                      errorMessages={this.props.errorMessages}
                      errorUtility={this.props.errorUtility}
                      allErrors={this.props.errors}
                      index={i}/>
                  )}
              </SubItem>


              <SubItem
                title={'Additional Information'}
                openSubItems={this.props.openSubItems}
                showSection={this.props.openItems.addInfo}>
                  <ErrorIndicator
                    trackErrors={['simCheckUrlInvalid']}
                    errorMessages={[]}
                    errorUtility={this.props.errorUtility}
                    allErrors={this.props.errors}/>

                  <AdditionalInformation
                    addInfo={this.props.addInfo}
                    handler={this.props.boundSetState}
                    validate={this.props.validate}
                    tooltip={this.props.showHelper}
                    deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                    errorMessages={this.props.errorMessages}
                    errorUtility={this.props.errorUtility}
                    allErrors={this.props.errors}
                    simCheckError={this.props.errors.simCheckUrlInvalid}/>
              </SubItem>


              {this.props.crossmark &&
                <SubItem
                  title={'Crossmark'}
                  showSection={!!Object.keys(this.props.showCards).length || !!this.props.reduxForm.size}
                  openSubItems={this.props.openSubItems}
                  CrossmarkAddButton={CrossmarkAddButton}>
                    <Crossmark
                      showCards={this.props.showCards}
                      validate={this.props.validate}
                      tooltip={this.props.showHelper}
                      deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
                      reduxDeleteCard={this.props.reduxDeleteCard}/>
                </SubItem>
              }

            </div>
          </form>
        </div>
      </div>
    )
  }
}
