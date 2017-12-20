import React, { Component } from 'react'

import {articleTooltips as tooltips} from '../../utilities/lists/tooltipMessages'
import {routes} from '../../routing'
import FormDate from '../Common/formDate'
import FormTextArea from '../Common/formTextArea'
import ErrorIndicator from '../Common/errorIndicator'





export class OptionalTitleData extends Component {

  toggle = () => {
    this.props.toggleFields()
  }

  render() {
    return(
      <div className='OptionalTitleFields'>
        <div className='toggleButton' onClick={this.toggle}>
            <span className={'arrowHolder' + (this.props.show ? ' openArrowHolder' : '')}>
              <img src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </span>
          <span>Optional Title Data</span>
        </div>
        <div className={'hiddenFields' + (this.props.show ? 'showOptionalTitle':'')}>
          <div className='fieldHolder first'>
            <FormTextArea
              label="Article subtitle"
              name="subtitle"
              value={this.props.subtitle}
              changeHandler={this.props.handleChange}
              onBlur={this.props.validate}
              errorUtility={this.props.errorUtility}
              tooltipUtility={this.props.tooltipUtility}
              tooltip={this.props.tooltip && tooltips.articleSubtitle}/>
          </div>

          <div className='fieldHolder'>
            <FormTextArea
              label="Alternate title (translated works)"
              name="originallanguagetitle"
              value={this.props.originallanguagetitle}
              changeHandler={this.props.handleChange}
              onBlur={this.props.validate}
              errorUtility={this.props.errorUtility}
              tooltipUtility={this.props.tooltipUtility}
              tooltip={this.props.tooltip && tooltips.alternateTitle}/>
          </div>

          <div className='fieldHolder'>
            <FormTextArea
              label="Alternate subtitle (translated works)"
              name="originallanguagetitlesubtitle"
              value={this.props.originallanguagetitlesubtitle}
              changeHandler={this.props.handleChange}
              onBlur={this.props.validate}
              errorUtility={this.props.errorUtility}
              tooltipUtility={this.props.tooltipUtility}
              tooltip={this.props.tooltip && tooltips.alternateSubtitle}/>
          </div>
        </div>
      </div>
    )
  }
}


export class DatesRow extends Component {
  render() {
    const errors = this.props.errors
    const {printDateYear, printDateMonth, printDateDay, onlineDateYear, onlineDateMonth, onlineDateDay} = this.props.article
    const {printDateInvalid, printDateIncomplete, onlineDateInvalid, onlineDateIncomplete} = this.props.errors
    return (
      <div className='row'>
        <div className='fieldHolder'>
          <FormDate
            label="Print Date"
            name="printDate"
            changeHandler={this.props.handleChange}
            onSelect={this.props.validate}
            tooltip={this.props.tooltip && tooltips.printDate}
            error={printDateInvalid}
            indicatorErrors={['printDateInvalid', 'printDateYear', 'printDateIncomplete']}
            errorUtility={this.props.errorUtility}
            required={!onlineDateYear}
            tooltipUtility={this.props.tooltipUtility}
            fields={{
              year: {
                value: printDateYear,
                error: errors.printDateYear || (!printDateYear && printDateIncomplete),
                required: !onlineDateYear
              },
              month: {
                value: printDateMonth,
                error: printDateIncomplete && !printDateMonth
              },
              day: {
                value: printDateDay
              }
            }}/>

          <FormDate
            label="Online Date"
            name="onlineDate"
            changeHandler={this.props.handleChange}
            onSelect={this.props.validate}
            tooltip={this.props.tooltip && tooltips.onlineDate}
            error={onlineDateInvalid}
            indicatorErrors={['onlineDateInvalid', 'onlineDateYear', 'onlineDateIncomplete']}
            errorUtility={this.props.errorUtility}
            required={!printDateYear}
            tooltipUtility={this.props.tooltipUtility}
            fields={{
              year: {
                value: onlineDateYear,
                error: errors.onlineDateYear || (!onlineDateYear && onlineDateIncomplete),
                required: !printDateYear
              },
              month: {
                value: onlineDateMonth,
                error: onlineDateIncomplete && !onlineDateMonth
              },
              day: {
                value: onlineDateDay
              }
            }}/>
        </div>

        <ErrorIndicator
          style="dateErrorHolder"
          indicatorErrors={['printDateYear', 'printDateIncomplete', 'printDateInvalid', 'onlineDateYear', 'onlineDateIncomplete', 'onlineDateInvalid']}
          errorMessages={this.props.errorMessages}
          allErrors={this.props.errors}
          tooltipUtility={this.props.tooltipUtility}
          errorUtility={this.props.errorUtility}/>
      </div>
    )
  }
}



