import React, { Component } from 'react'
import is from 'prop-types'
import {stateTrackerII} from 'my_decorators'

import SubItem from '../SubItems/subItem'
import ActionBar from './actionBar'
import { TopBar, InfoBubble, InfoHelperRow, ErrorBubble, ArticleTitleField, OptionalTitleData, ArticleDOIField, ArticleUrlField, DatesRow, BottomFields } from './articleFormComponents'
import { makeDateDropDown } from '../../utilities/date'






export default class AddArticleCard extends Component {

  static propTypes = {
    back: is.func.isRequired,
    addToCart: is.func.isRequired,
    save: is.func.isRequired,
    openReviewArticleModal: is.func.isRequired,
    handleChange: is.func.isRequired,
    toggleFields: is.func.isRequired,
    boundSetState: is.func.isRequired,
    removeSection: is.func.isRequired,
    addSection: is.func.isRequired
  }

  render () {
    return (
      <div>

        <div className={'addarticlecard'}>

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
                  <ArticleTitleField handleChange={this.props.handleChange} title={this.props.article.title} errors={this.props.errors}/>
                  {(!this.props.error && this.props.showHelper) && <InfoBubble/> }
                  {(this.props.error) && <ErrorBubble errors={this.props.errors} crossmarkErrors={this.props.crossmarkErrors}/> }
                </div>

                <div className='row'>
                  <OptionalTitleData
                    show={this.props.showOptionalTitleData}
                    toggleFields={this.props.toggleFields}
                    subtitle={this.props.article.subtitle}
                    originallanguagetitle={this.props.article.originallanguagetitle}
                    originallanguagetitlesubtitle={this.props.article.originallanguagetitlesubtitle}
                    handleChange={this.props.handleChange}/>
                </div>

                <div className='row'>
                  <div className="fieldHolder">
                    <ArticleDOIField disabled={this.props.doiDisabled} doi={this.props.article.doi} handleChange={this.props.handleChange} errors={this.props.errors}/>
                    <ArticleUrlField url={this.props.article.url} handleChange={this.props.handleChange} errors={this.props.errors} />
                  </div>
                </div>

                <DatesRow
                  article={this.props.article}
                  errors={this.props.errors}
                  makeDateDropDown={makeDateDropDown}
                  handleChange={this.props.handleChange}
                />

                <BottomFields
                  article={this.props.article}
                  errors={this.props.errors}
                  makeDateDropDown={makeDateDropDown}
                  handleChange={this.props.handleChange}
                />

              </div>

              <SubItem
                title={'Contributor'}
                validating={this.props.validating}
                addable={true}
                incomingData={this.props.contributors}
                handler={this.props.boundSetState}
                remove={this.props.removeSection.bind(null, 'contributors')}
                showSection={this.props.openItems.Contributors}
                addHandler={this.props.addSection.bind(null, 'contributors')}
              />
              <SubItem
                title={'Funding'}
                validating={this.props.validating}
                addable={true}
                incomingData={this.props.funding}
                handler={this.props.boundSetState}
                remove={this.props.removeSection.bind(null, 'funding')}
                showSection={this.props.openItems.Funding}
                addHandler={this.props.addSection.bind(null, 'funding')}
              />
              <SubItem
                title={'License'}
                validating={this.props.validating}
                addable={true}
                incomingData={this.props.license}
                handler={this.props.boundSetState}
                remove={this.props.removeSection.bind(null, 'license')}
                showSection={this.props.openItems.Licenses}
                addHandler={this.props.addSection.bind(null, 'license')}
                freetoread={this.props.addInfo.freetolicense}
                makeDateDropDown={makeDateDropDown}
              />
              <SubItem
                title={'Related Items'}
                validating={this.props.validating}
                addable={true}
                incomingData={this.props.relatedItems}
                handler={this.props.boundSetState}
                remove={this.props.removeSection.bind(null, 'relatedItems')}
                showSection={this.props.openItems.relatedItems}
                addHandler={this.props.addSection.bind(null, 'relatedItems')}
              />
              <SubItem
                title={'Additional Information'}
                validating={this.props.validating}
                addable={false}
                incomingData={this.props.addInfo}
                handler={this.props.boundSetState}
                showSection={this.props.openItems.addInfo}
                freetoread={this.props.addInfo.freetolicense}
                simCheckError={this.props.errors.simCheckUrlInvalid}
              />
              {this.props.crossmark &&
                <SubItem
                  title={'Crossmark'}
                  showCards={this.props.showCards}
                  crossmarkErrors={this.props.crossmarkErrors}
                  reduxDeleteCard={this.props.reduxDeleteCard}
                />
              }

            </div>
          </form>
        </div>
      </div>
    )
  }
}
