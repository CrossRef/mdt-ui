import React, { Component } from 'react'
import Switch from 'react-toggle-switch'

import { ClassWrapper } from '../../utilities/helpers'
import {cardNames} from '../../utilities/crossmarkHelpers'
const {pubHist, peer, update, clinical, copyright, other, supp} = cardNames
import {routes} from '../../routing'



export const TopBar = ({title}) =>
  <ClassWrapper classNames={['topbar', 'titleholder', 'titleinnerholder']}>
    <div className='titleIconHolder'>
      <img src={`${routes.images}/AddArticle/Asset_Icons_White_Write.svg`} />
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
      <div><img src={`${routes.images}/AddArticle/Asset_Icons_Grey_Help.svg`} /></div>
      <div>Please provide a Title that fully describes your Article</div>
    </div>
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
                onBlur={this.props.validate}
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
      <div className='OptionalTitleFields'>
        <div className='toggleButton' onClick={this.props.toggleFields}>
            <span className={'arrowHolder' + (this.props.show ? ' openArrowHolder' : '')}>
              <img src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
            </span>
          <span>Optional Title Data</span>
        </div>
        <div className={'hiddenFields' + (this.props.show ? 'showOptionalTitle':'')}>
          <div className='fieldHolder first'>
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
                    onBlur={this.props.validate}
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
                    onBlur={this.props.validate}
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
                    onBlur={this.props.validate}
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
    const {errors, disabled, handleChange, doi} = this.props
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
                className={`height32 ${(errors.doi || errors.dupedoi || errors.invaliddoi || errors.invalidDoiPrefix) && 'fieldError'} ${disabled && 'disabledDoi'}`}
                type='text'
                name="doi"
                onChange={handleChange}
                value={doi}
                disabled={disabled}
                onBlur={this.props.validate}
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
                className={'height32' + ((this.props.errors.url || this.props.errors.invalidurl) ? ' fieldError': '')}
                type='text'
                name="url"
                onChange={this.props.handleChange}
                value={!!this.props.url?this.props.url:'http://'}
                onBlur={this.props.validate}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export class DatesRow extends Component {

  onSelect = async (e) => {
    await this.props.handleChange(e)
    this.props.validate()
  }

  render() {
    const errors = this.props.errors
    const {printDateYear, printDateMonth, printDateDay, onlineDateYear, onlineDateMonth, onlineDateDay} = this.props.article
    const {printDateInvalid, printDateIncomplete, onlineDateInvalid, onlineDateIncomplete} = this.props.errors
    const printYearError = errors.printDateYear || (!printDateYear && printDateIncomplete) || printDateInvalid
    const onlineYearError = errors.onlineDateYear || (!onlineDateYear && onlineDateIncomplete) || onlineDateInvalid
    return (
      <div className='row'>
        <div className='fieldHolder'>
          <div className='fieldinnerholder halflength'>
            <div className='labelholder'>
              <div className='labelinnerholder'>
                <div className='label'>Print Date</div>
              </div>
            </div>
            <div className='requrefieldholder'>
              <div className={'requiredholder' + (((this.props.article.onlineDateYear ? this.props.article.onlineDateYear : '').length === 0)? ' dateselectrequire':' norequire')}>
                <div className='required height32'>
                  {((this.props.article.onlineDateYear ? this.props.article.onlineDateYear : '').length === 0 ? <span>*</span> : <span></span>)}
                </div>
              </div>
              <div className='field'>
                <div className='datepickerholder'>
                  <div className='dateselectholder'>
                    <div>Year {((this.props.article.onlineDateYear ? this.props.article.onlineDateYear : '').length === 0 ? '(*)' : '')}</div>
                    <div>
                      {this.props.makeDateDropDown(this.onSelect, 'printDateYear', 'y', printDateYear, printYearError)}
                    </div>
                  </div>
                  <div className='dateselectholder'>
                    <div>Month</div>
                    <div>
                      {this.props.makeDateDropDown(this.onSelect, 'printDateMonth', 'm', printDateMonth, (printDateIncomplete && !printDateMonth) || printDateInvalid)}
                    </div>
                  </div>
                  <div className='dateselectholder'>
                    <div>Day</div>
                    <div>
                      {this.props.makeDateDropDown(this.onSelect, 'printDateDay', 'd', printDateDay, printDateInvalid)}
                    </div>
                  </div>
                  <div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className='fieldinnerholder halflength'>
            <div className='labelholder'>
              <div className='labelinnerholder'>
                <div className='label'>Online Date</div>
              </div>
            </div>
            <div className='requrefieldholder'>
              <div className={'requiredholder' + (((this.props.article.printDateYear ? this.props.article.printDateYear : '').length === 0)? ' dateselectrequire':' norequire')}>
                <div className='required height32'>
                  {((this.props.article.printDateYear ? this.props.article.printDateYear : '').length === 0 ? <span>*</span> : <span></span>)}
                </div>
              </div>
              <div className='field'>
                <div className='datepickerholder'>
                  <div className='dateselectholder'>
                    <div>Year {((this.props.article.printDateYear ? this.props.article.printDateYear : '').length === 0 ? '(*)' : '')}</div>
                    <div>{this.props.makeDateDropDown(this.onSelect, 'onlineDateYear', 'y', onlineDateYear, onlineYearError)}</div>
                  </div>
                  <div className='dateselectholder'>
                    <div>Month</div>
                    <div>
                      {this.props.makeDateDropDown(this.onSelect, 'onlineDateMonth', 'm', onlineDateMonth, (onlineDateIncomplete && !onlineDateMonth) || onlineDateInvalid)}
                    </div>
                  </div>
                  <div className='dateselectholder'>
                    <div>Day</div>
                    <div>
                      {this.props.makeDateDropDown(this.onSelect, 'onlineDateDay', 'd', onlineDateDay, onlineDateInvalid)}
                    </div>
                  </div>
                  <div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export class BottomFields extends Component {
  render() {
    return(
      <div>
        <div className='row'>
          <div className='fieldHolder'>
            <div className='fieldinnerholder halflength'>
              <div className='labelholder'>
                <div className='labelinnerholder'>
                  <div className='label'>First Page</div>
                </div>
              </div>
              <div className='requrefieldholder'>
                <div className={`requiredholder ${!this.props.article.lastPage && 'norequire'}`}>
                  <div className='required height32'>{this.props.article.lastPage && <span>*</span>}</div>
                </div>
                <div className='field'>
                  <input
                      name="firstPage"
                      className={`height32 ${this.props.errors.firstPage && 'fieldError'}`}
                      type='text'
                      onChange={this.props.handleChange}
                      value={this.props.article.firstPage}
                      onBlur={this.props.validate}
                  />
                </div>
              </div>
            </div>
            <div className='fieldinnerholder halflength'>
              <div className='labelholder'>
                <div className='labelinnerholder'>
                  <div className='label'>Last Page</div>
                </div>
              </div>
              <div className='requrefieldholder'>
                <div className='requiredholder norequire'>
                  <div className='required height32'>
                  </div>
                </div>
                <div className='field'>
                  <input
                    className='height32'
                    type='text'
                    name='lastPage'
                    onChange={this.props.handleChange}
                    value={this.props.article.lastPage}
                    onBlur={this.props.validate}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='errorHolder'>
          </div>
        </div>

        <div className='row'>
          <div className='fieldHolder'>
            <div className='fieldinnerholder halflength'>
              <div className='labelholder'>
                <div className='labelinnerholder'>
                  <div className='label'>Article / Electronic Location ID</div>
                </div>
              </div>
              <div className='requrefieldholder'>
                <div className='requiredholder norequire'>
                  <div className='required height32'>
                  </div>
                </div>
                <div className='field'>
                  <input
                      className='height32'
                      type='text'
                      name='locationId'
                      onChange={this.props.handleChange}
                      value={this.props.article.locationId}
                      onBlur={this.props.validate}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='errorHolder'>
          </div>
        </div>

        <div className='row'>
          <div className='fieldHolder'>
            <div className='fieldinnerholder fulllength'>
              <div className='labelholder'>
                <div></div>
                <div className='labelinnerholder'>
                  <div className='label'>Abstract</div>
                </div>
              </div>
              <div className='requrefieldholder'>
                <div className='requiredholder norequire'>
                  <div className='required height64'>
                  </div>
                </div>
                <div className='field'>
                  <textarea
                      className='height64'
                      type='text'
                      name='abstract'
                      onChange={this.props.handleChange}
                      value={this.props.article.abstract}
                      onBlur={this.props.validate}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='errorHolder'>
          </div>
        </div>
      </div>
    )
  }
}


