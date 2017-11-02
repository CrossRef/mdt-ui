import React, { Component } from 'react'
import is from 'prop-types'
import Switch from 'react-toggle-switch'

import {routes} from '../../routing'
import SubItem from '../Common/subItem'
import ActionBar from './actionBar'
import { InfoBubble, InfoHelperRow, OptionalTitleData, DatesRow } from './articleFormComponents'
import ErrorBubble from './errorBubble'
import Contributor from './SubItems/contributor'
import Funding from './SubItems/funding'
import License from './SubItems/license'
import RelatedItems from './SubItems/relatedItems'
import AdditionalInformation from './SubItems/additionalInfo'
import { CrossmarkCards, CrossmarkAddButton } from './SubItems/Crossmark/crossmark'
import FormInput from '../Common/formInput'
import FormTextArea from '../Common/formTextArea'
import FormSelect from '../Common/formSelect'
import {urlEntered} from '../../utilities/helpers'








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
    deferredErrorBubbleRefresh: is.object.isRequired
  }

  render () {
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

                <InfoHelperRow setState={this.props.boundSetState} showHelper={this.props.showHelper}/>

                <div className='row'>
                  <div className='fieldHolder'>
                    <FormTextArea
                      label="Article Title (Required)"
                      name="title"
                      value={this.props.article.title}
                      required={true}
                      error={this.props.errors.title}
                      changeHandler={this.props.handleChange}
                      onBlur={this.props.validate}
                      tooltip={this.props.showHelper}/>
                  </div>

                  {this.props.showHelper && <InfoBubble/> }

                  {this.props.error &&
                    <ErrorBubble
                      deferredErrorBubbleRefresh={this.props.deferredErrorBubbleRefresh}
                      errors={this.props.errors}
                      crossmarkErrors={this.props.crossmarkErrors}/>}
                </div>

                <div className='row'>
                  <OptionalTitleData
                    show={this.props.showOptionalTitleData}
                    toggleFields={this.props.toggleFields}
                    subtitle={this.props.article.subtitle}
                    originallanguagetitle={this.props.article.originallanguagetitle}
                    originallanguagetitlesubtitle={this.props.article.originallanguagetitlesubtitle}
                    validate={this.props.validate}
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
                      disabled={this.props.doiDisabled}
                      changeHandler={this.props.handleChange}
                      onBlur={this.props.validate}
                      tooltip={this.props.showHelper}/>

                    <FormInput
                      label="Article URL (Required)"
                      name="url"
                      value={ urlEntered(this.props.article.url) ? this.props.article.url : 'http://' }
                      required={true}
                      error={this.props.errors.url || this.props.errors.invalidurl}
                      changeHandler={this.props.handleChange}
                      onBlur={this.props.validate}
                      tooltip={this.props.showHelper}/>
                  </div>
                </div>

                <DatesRow
                  article={this.props.article}
                  errors={this.props.errors}
                  handleChange={this.props.handleChange}
                  validate={this.props.validate}
                  tooltip={this.props.showHelper}
                />

                <div className='row'>
                  <div className='fieldHolder'>
                    <FormInput
                      label="First Page"
                      name="firstPage"
                      value={this.props.article.firstPage}
                      required={!!this.props.article.lastPage}
                      error={this.props.errors.firstPage}
                      changeHandler={this.props.handleChange}
                      onBlur={this.props.validate}
                      tooltip={this.props.showHelper}/>

                    <FormInput
                      label="Last Page"
                      name="lastPage"
                      value={this.props.article.lastPage}
                      changeHandler={this.props.handleChange}
                      onBlur={this.props.validate}
                      tooltip={this.props.showHelper}/>
                  </div>
                </div>

                <div className='row'>
                  <div className='fieldHolder'>
                    <FormInput
                      label="Article / Electronic Location ID"
                      name="locationId"
                      value={this.props.article.locationId}
                      changeHandler={this.props.handleChange}
                      onBlur={this.props.validate}
                      tooltip={this.props.showHelper}/>
                  </div>
                </div>

                <div className='row'>
                  <div className='fieldHolder'>
                    <FormTextArea
                      label="Abstract"
                      name="abstract"
                      value={this.props.article.abstract}
                      changeHandler={this.props.handleChange}
                      tooltip={this.props.showHelper}/>
                  </div>
                </div>

              </div>


              <SubItem
                title={'Contributor'}
                validating={this.props.validating}
                showSection={this.props.openItems.Contributors}
                deferredErrorBubbleRefresh={this.props.deferredErrorBubbleRefresh}
                addHandler={this.props.addSection.bind(null, 'contributors')}>
                  {this.props.contributors.map((data, i)=>
                    <Contributor
                      validating={this.props.validating}
                      validate={this.props.validate}
                      key={i}
                      contributor={data}
                      remove={this.props.removeSection.bind(null, 'contributors', i)}
                      handler={this.props.boundSetState}
                      data={this.props.contributors}
                      deferredErrorBubbleRefresh={this.props.deferredErrorBubbleRefresh}
                      tooltip={this.props.showHelper}
                      index={i}/>
                  )}
              </SubItem>

              <SubItem
                title={'Funding'}
                validating={this.props.validating}
                showSection={this.props.openItems.Funding}
                deferredErrorBubbleRefresh={this.props.deferredErrorBubbleRefresh}
                addHandler={this.props.addSection.bind(null, 'funding')}>
                  {this.props.funding.map((data, i)=>
                    <Funding
                      validating={this.props.validating}
                      validate={this.props.validate}
                      key={i}
                      funding={data}
                      remove={this.props.removeSection.bind(null, 'funding', i)}
                      handler={this.props.boundSetState}
                      data={this.props.funding}
                      deferredErrorBubbleRefresh={this.props.deferredErrorBubbleRefresh}
                      tooltip={this.props.showHelper}
                      index={i}/>
                  )}
              </SubItem>

              <SubItem
                title={'License'}
                validating={this.props.validating}
                showSection={this.props.openItems.Licenses}
                addHandler={this.props.addSection.bind(null, 'license')}
                deferredErrorBubbleRefresh={this.props.deferredErrorBubbleRefresh}>

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
                          changeHandler={this.props.handleChange}
                          onSelect={this.props.validate}
                          tooltip={this.props.showHelper}/>
                      </div>
                    </div>
                  </div>

                  {this.props.license.map((data, i)=>
                    <License
                      validating={this.props.validating}
                      validate={this.props.validate}
                      key={i}
                      license={data}
                      remove={this.props.removeSection.bind(null, 'license', i)}
                      handler={this.props.boundSetState}
                      data={this.props.license}
                      index={i}
                      deferredErrorBubbleRefresh={this.props.deferredErrorBubbleRefresh}
                      tooltip={this.props.showHelper}
                      freetolicense={i===0 ? this.props.article.freetolicense : ''}/>
                  )}
              </SubItem>

              <SubItem
                title={'Related Items'}
                validating={this.props.validating}
                showSection={this.props.openItems.relatedItems}
                deferredErrorBubbleRefresh={this.props.deferredErrorBubbleRefresh}
                addHandler={this.props.addSection.bind(null, 'relatedItems')}>
                  {this.props.relatedItems.map((data, i)=>
                    <RelatedItems
                      validating={this.props.validating}
                      validate={this.props.validate}
                      key={i}
                      relateditem={data}
                      remove={this.props.removeSection.bind(null, 'relatedItems', i)}
                      handler={this.props.boundSetState}
                      data={this.props.relatedItems}
                      deferredErrorBubbleRefresh={this.props.deferredErrorBubbleRefresh}
                      tooltip={this.props.showHelper}
                      index={i}/>
                  )}
              </SubItem>

              <SubItem
                title={'Additional Information'}
                validating={this.props.validating}
                deferredErrorBubbleRefresh={this.props.deferredErrorBubbleRefresh}
                showSection={this.props.openItems.addInfo}>
                  <AdditionalInformation
                    addInfo={this.props.addInfo}
                    handler={this.props.boundSetState}
                    validate={this.props.validate}
                    tooltip={this.props.showHelper}
                    simCheckError={this.props.errors.simCheckUrlInvalid}/>
              </SubItem>

              {this.props.crossmark &&
                <SubItem
                  title={'Crossmark'}
                  showSection={!!Object.keys(this.props.showCards).length || !!this.props.reduxForm.size}
                  validating={this.props.validating}
                  deferredErrorBubbleRefresh={this.props.deferredErrorBubbleRefresh}
                  CrossmarkAddButton={CrossmarkAddButton}>
                    <CrossmarkCards
                      showCards={this.props.showCards}
                      validate={this.props.validate}
                      tooltip={this.props.showHelper}
                      deferredErrorBubbleRefresh={this.props.deferredErrorBubbleRefresh}
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
