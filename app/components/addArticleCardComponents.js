import React, { Component } from 'react'
import Switch from 'react-toggle-switch'

import { ClassWrapper } from '../utilities/helpers'


export const TopBar = ({title}) =>
  <ClassWrapper classNames={['topbar', 'titleholder', 'titleinnerholder']}>
    <div className='titleIconHolder'>
      <img src='/images/AddArticle/Asset_Icons_White_Write.svg' />
    </div>
    <div className='articletitle'>
      {title}
    </div>
  </ClassWrapper>


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
            onClick={() => {
              this.props.setState({on: !this.props.on}, ()=>{
                this.props.setState({showHelper: this.props.on})
              })
            }}
            on={this.props.on}
          />
        </ClassWrapper>
      </div>
    )
  }
}


export const InfoBubble = () =>
  <ClassWrapper classNames={['errorHolder talltooltip helpers', 'toolTipHolder', ['a', "tooltips"], 'toolmsgholder', 'errormsgholder']}>
    <div className='errormsginnerholder'>
      <img src='/images/AddArticle/Asset_Icons_White_Help.svg' />
      Please provide a Title that fully describes your Article
    </div>
  </ClassWrapper>


export const ErrorBubble = ({errors}) =>
  <ClassWrapper classNames={['errorHolder talltooltip fullError', 'toolTipHolder', ['a', "tooltips"], 'toolmsgholder', 'errormsgholder', 'errormsginnerholder']}>
    <div><img src='/images/AddArticle/Asset_Icons_White_Help.svg' /></div>
    {(
      errors.doi ||
      errors.url ||
      errors.title ||
      errors.printDateYear ||
      errors.onlineDateYear ||
      errors.licenseStartDate
    ) &&
    <div><b>Required.</b><br />Please provide required informaton.</div>
    }
    {(errors.invalidurl) &&
    <div><b>Invalid URL.</b><br />Please check your URL.</div>
    }
    {(errors.invaliddoi) &&
    <div><b>Invalid DOI.</b><br />Please check your DOI (10.xxxx/xx...).</div>
    }
    {(errors.dupedoi) &&
    <div><b>Duplicate DOI.</b><br />Registering a new DOI? This one already exists.</div>
    }
  </ClassWrapper>



export class ArticleTitleField extends Component {
  render() {
    return(

      <div className='fieldHolder'>
        <div className='fieldinnerholder fulllength'>
          <ClassWrapper classNames={['labelholder', 'labelinnerholder']}> <div className='label'>Article Title (Required)</div> </ClassWrapper>
          <div className='requrefieldholder'>
            <ClassWrapper classNames={['requiredholder', 'required height64']}><span>*</span></ClassWrapper>
            <div className='field'>
              <textarea
                className={'height64' + ((this.props.errors.title) ? ' fieldError': '')}
                type='text'
                name="title"
                onChange={this.props.handleChange}
                value={this.props.title}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export class OptionalTitleData extends Component {
  render() {
    return(
      <div>
        <div className='toggleButton' onClick={this.props.toggleFields}>
            <span className={'arrowHolder' + (this.props.show ? ' openArrowHolder' : '')}>
              <img src="/images/AddArticle/DarkTriangle.svg" />
            </span>
          <span>Optional Title Data</span>
        </div>
        <div className={'hiddenFields' + (this.props.show ? 'showOptionalTitle':'')}>
          <div className='fieldHolder'>
            <div className='fieldinnerholder fulllength'>
              <div className='labelholder'>
                <div className='labelinnerholder'>
                  <div className='label'>Subtitle (Optional)</div>
                </div>
              </div>
              <div className='requrefieldholder'>
                <div className='requiredholder norequire'>
                  <div className='required height64'></div>
                </div>
                <div className='field'>
                  <textarea
                    className='height64'
                    type='text'
                    name="subtitle"
                    onChange={this.props.handleChange}
                    value={this.props.subtitle}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='fieldHolder'>
            <div className='fieldinnerholder fulllength'>
              <div className='labelholder'>
                <div className='labelinnerholder'>
                  <div className='label'>Original Language Title (Optional)</div>
                </div>
              </div>
              <div className='requrefieldholder'>
                <div className='requiredholder norequire'>
                  <div className='required height64'></div>
                </div>
                <div className='field'>
                  <textarea
                    className='height64'
                    type='text'
                    name="originallanguagetitle"
                    onChange={this.props.handleChange}
                    value={this.props.originallanguagetitle}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='fieldHolder'>
            <div className='fieldinnerholder fulllength'>
              <div className='labelholder'>
                <div></div>
                <div className='labelinnerholder'>
                  <div className='label'>Original Language Title Subtitle</div>
                </div>
              </div>
              <div className='requrefieldholder'>
                <div className='requiredholder norequire'>
                  <div className='required height64'></div>
                </div>
                <div className='field'>
                  <textarea
                    className='height64'
                    type='text'
                    name="originallanguagetitlesubtitle"
                    onChange={this.props.handleChange}
                    value={this.props.originallanguagetitlesubtitle}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export class ArticleDOIField extends Component {
  render() {
    return(
      <div >
        <div className='fieldinnerholder halflength'>
          <div className='labelholder'>
            <div className='labelinnerholder'>
              <div className='label'>Article DOI (Required)</div>
            </div>
          </div>
          <div className='requrefieldholder'>
            <div className='requiredholder'>
              <div className='required height32'>
                <span>*</span>
              </div>
            </div>
            <div className='field'>
              <input
                className={'height32' + ((this.props.errors.doi || this.props.errors.dupedoi || this.props.errors.invaliddoi) ? ' fieldError': '')}
                type='text'
                name="doi"
                onChange={this.props.handleChange}
                value={this.props.doi}
                disabled={this.props.doiDisabled}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export class ArticleUrlField extends Component {
  render() {
    return(
      <div >
        <div className='fieldinnerholder halflength'>
          <div className='labelholder'>
            <div className='labelinnerholder'>
              <div className='label'>Article URL (Required)</div>
            </div>
          </div>
          <div className='requrefieldholder'>
            <div className='requiredholder'>
              <div className='required height32'>
                <span>*</span>
              </div>
            </div>
            <div className='field'>
              <input
                className={'height32' + ((this.props.errors.url) ? ' fieldError': '')}
                type='text'
                name="url"
                onChange={this.props.handleChange}
                value={this.props.url}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}


