import React, { Component } from 'react'
import Switch from 'react-toggle-switch'

import { ClassWrapper } from '../../utilities/helpers'
import {articleTooltips as tooltips} from '../../utilities/lists/tooltipMessages'
import {routes} from '../../routing'
import FormDate from '../Common/formDate'
import FormTextArea from '../Common/formTextArea'




export class InfoHelperRow extends Component {
  render() {
    return (
      <div className='row infohelper'>

        <ClassWrapper classNames={['fieldHolder', 'fieldinnerholder fulllength', 'labelholder', 'labelinnerholder']}>
          <div className='label'>* Indicates Required fields</div>
        </ClassWrapper>

        <ClassWrapper classNames={['errorHolder','switchOuterHolder','switchInnerHolder','switchLicense']}>
          <div className='switchLabel'><span>Show Help</span></div>
          <Switch
            ref='showHelper'
            onClick={() => this.props.setState({showHelper: !this.props.showHelper})}
            on={this.props.showHelper}
          />
        </ClassWrapper>
      </div>
    )
  }
}




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
              label="Subtitle (Optional)"
              name="subtitle"
              value={this.props.subtitle}
              changeHandler={this.props.handleChange}
              onBlur={this.props.validate}
              deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
              tooltip={this.props.tooltip && tooltips.articleSubtitle}/>
          </div>

          <div className='fieldHolder'>
            <FormTextArea
              label="Original Language Title (Optional)"
              name="originallanguagetitle"
              value={this.props.originallanguagetitle}
              changeHandler={this.props.handleChange}
              onBlur={this.props.validate}
              deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
              tooltip={this.props.tooltip && tooltips.alternateTitle}/>
          </div>

          <div className='fieldHolder'>
            <FormTextArea
              label="Original Language Title Subtitle"
              name="originallanguagetitlesubtitle"
              value={this.props.originallanguagetitlesubtitle}
              changeHandler={this.props.handleChange}
              onBlur={this.props.validate}
              deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
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
            required={!onlineDateYear}
            deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
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
            required={!printDateYear}
            deferredTooltipBubbleRefresh={this.props.deferredTooltipBubbleRefresh}
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
      </div>
    )
  }
}



