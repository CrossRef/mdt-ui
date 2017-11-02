import React, { Component } from 'react'
import Switch from 'react-toggle-switch'

import { ClassWrapper } from '../../utilities/helpers'
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


export const InfoBubble = () =>
  <ClassWrapper classNames={['errorHolder talltooltip helpers', 'toolTipHolder', ['a', "tooltips"], 'toolmsgholder', 'errormsgholder']}>
    <div className='errormsginnerholder'>
      <div><img src={`${routes.images}/AddArticle/Asset_Icons_Grey_Help.svg`} /></div>
      <div>Please provide a Title that fully describes your Article</div>
    </div>
  </ClassWrapper>




export class OptionalTitleData extends Component {
  render() {
    return(
      <div className='OptionalTitleFields'>
        <div className='toggleButton' onClick={this.props.toggleFields}>
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
              tooltip={false}/>
          </div>

          <div className='fieldHolder'>
            <FormTextArea
              label="Original Language Title (Optional)"
              name="originallanguagetitle"
              value={this.props.originallanguagetitle}
              changeHandler={this.props.handleChange}
              onBlur={this.props.validate}
              tooltip={false}/>
          </div>

          <div className='fieldHolder'>
            <FormTextArea
              label="Original Language Title Subtitle"
              name="originallanguagetitlesubtitle"
              value={this.props.originallanguagetitlesubtitle}
              changeHandler={this.props.handleChange}
              onBlur={this.props.validate}
              tooltip={false}/>
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
            tooltip={this.props.tooltip}
            error={printDateInvalid}
            required={!onlineDateYear}
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
            tooltip={this.props.tooltip}
            error={onlineDateInvalid}
            required={!printDateYear}
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



