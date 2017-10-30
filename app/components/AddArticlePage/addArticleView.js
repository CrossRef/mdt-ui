import React, { Component } from 'react'
import is from 'prop-types'
import Switch from 'react-toggle-switch'

import SubItem from '../Common/subItem'
import ActionBar from './actionBar'
import { TopBar, InfoBubble, InfoHelperRow, ArticleTitleField, OptionalTitleData, ArticleDOIField, ArticleUrlField, DatesRow, BottomFields } from './articleFormComponents'
import ErrorBubble from './errorBubble'
import { makeDateDropDown } from '../../utilities/date'
import Contributor from './SubItems/contributor'
import Funding from './SubItems/funding'
import License from './SubItems/license'
import RelatedItems from './SubItems/relatedItems'
import AdditionalInformation from './SubItems/additionalInfo'
import { CrossmarkCards, CrossmarkAddButton } from './SubItems/Crossmark/crossmark'








export default class AddArticleCard extends Component {

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

              <TopBar title={this.props.article.title} />

              <div className='body'>

                <InfoHelperRow setState={this.props.boundSetState} on={this.props.on}/>

                <div className='row'>
                  <ArticleTitleField
                    handleChange={this.props.handleChange}
                    title={this.props.article.title}
                    validate={this.props.validate}
                    errors={this.props.errors}/>

                  {(!this.props.error && this.props.showHelper) && <InfoBubble/> }

                  {(this.props.error) &&
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
                    <ArticleDOIField
                      disabled={this.props.doiDisabled}
                      doi={this.props.article.doi}
                      handleChange={this.props.handleChange}
                      validate={this.props.validate}
                      errors={this.props.errors}/>

                    <ArticleUrlField url={this.props.article.url}
                      handleChange={this.props.handleChange}
                      validate={this.props.validate}
                      errors={this.props.errors} />
                  </div>
                </div>

                <DatesRow
                  article={this.props.article}
                  errors={this.props.errors}
                  makeDateDropDown={makeDateDropDown}
                  handleChange={this.props.handleChange}
                  validate={this.props.validate}
                />

                <BottomFields
                  article={this.props.article}
                  errors={this.props.errors}
                  makeDateDropDown={makeDateDropDown}
                  handleChange={this.props.handleChange}
                  validate={this.props.validate}
                />

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
                        <div className='fieldinnerholder halflength'>
                          <div className='labelholder'>
                            <div></div>
                            <div className='labelinnerholder'>
                              <div className='label'>Free to License</div>
                            </div>
                          </div>
                          <div className='requrefieldholder'>
                            <div className='requiredholder norequire'>
                              <div className='required height32'>
                              </div>
                            </div>
                            <div className='field'>
                              <select
                                name="freetolicense"
                                onChange={async (e) => {
                                  await this.props.handleChange(e)
                                  this.props.validate()
                                }}
                                className='height32'
                                value={this.props.article.freetolicense}>
                                  <option key='-1' value={''}>{''}</option>
                                  <option key='0' value={'yes'}>Yes</option>
                                  <option key='1' value={'no'}>No</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='errorHolder'>
                      </div>
                    </div>
                    <div className='errorHolder'>
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
                      makeDateDropDown={makeDateDropDown}
                      deferredErrorBubbleRefresh={this.props.deferredErrorBubbleRefresh}
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
                    simCheckError={this.props.errors.simCheckUrlInvalid}/>
              </SubItem>

              {this.props.crossmark &&
                <SubItem
                  title={'Crossmark'}
                  showSection={!!Object.keys(this.props.showCards).length}
                  validating={this.props.validating}
                  deferredErrorBubbleRefresh={this.props.deferredErrorBubbleRefresh}
                  CrossmarkAddButton={CrossmarkAddButton}>
                    <CrossmarkCards
                      showCards={this.props.showCards}
                      validate={this.props.validate}
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
