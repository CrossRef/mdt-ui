import React, { Component } from 'react'
import Switch from 'react-toggle-switch'
import $ from 'jquery'

import { ClassWrapper } from '../utilities/classwrapper'
import {cardNames} from '../utilities/crossmarkHelpers'
const {pubHist, peer, update, clinical, copyright, other, supp} = cardNames;
import {routes} from '../routing'


export class ActionBar extends Component {

  state = {
    menuOpen: false
  }

  toggleMenu = () => {
    this.setState({menuOpen: !this.state.menuOpen})
  }

  handleClick = e => {
    const element = $(e.target);
    if(!(element.parents('.actionBarDropDown').length || element.is('.actionBarDropDown, .actionTooltip'))) {
      this.setState({ menuOpen: false })
    }
  }

  componentWillUpdate (nextProps, nextState) {
    if(nextState.menuOpen) {
      document.addEventListener('click', this.handleClick, false);
    } else if (!nextState.menuOpen) {
      document.removeEventListener('click', this.handleClick, false);
    }
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleClick, false);
  }

  render() {
    return (
      <div className="reviewArticleButtonDiv">
        <button type='button' onClick={this.props.back} className="addPublication pull-left backbutton"><img className='backbuttonarrow' src={`${routes.images}/AddArticle/DarkTriangle.svg`} /><span>Back</span></button>
        <div onClick={this.toggleMenu} className={'addPublication saveButton actionTooltip'}>
          Action
          {this.state.menuOpen && <div className='actionBarDropDown'>
            <p onClick={this.props.addToCart}>Add to Cart</p>
            <p onClick={()=>this.props.save()}>Save</p>
            <p onClick={this.props.openReviewArticleModal}>Review</p>
          </div>}
        </div>
      </div>
    )
  }
}


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



let requiredMessageInUse = false;
const requiredMessage = () => {
  if(!requiredMessageInUse) {
    requiredMessageInUse = true;
    return <div><b>Required.</b><br />Please provide required information.</div>
  } else {
    return null
  }
}

export const ErrorBubble = ({errors, crossmarkErrors}) =>
  <ClassWrapper classNames={['errorHolder talltooltip fullError', 'toolTipHolder', ['a', "tooltips"], 'toolmsgholder', 'errormsgholder', 'errormsginnerholder']}>
    <div><img src={`${routes.images}/AddArticle/Asset_Icons_Grey_Caution.svg`} /></div>

    {requiredMessageInUse = false}
    {errors.title && requiredMessage()}
    {errors.doi && requiredMessage()}
    {(errors.invaliddoi) && <div><b>Invalid Article DOI.</b><br/>Please check your DOI (10.xxxx/xx...).</div>}
    {(errors.invalidDoiPrefix) && <div><b>Invalid Article DOI.</b><br/>DOI prefix needs to match journal DOI prefix.</div>}
    {(errors.dupedoi) && <div><b>Duplicate DOI.</b><br />Registering a new DOI? This one already exists.</div>}
    {errors.url && requiredMessage()}
    {(errors.invalidurl) && <div><b>Invalid Article URL.</b><br />Please check your URL.</div>}
    {(errors.printDateYear || errors.onlineDateYear) && <div><b>Required.</b><br />Please provide either a print or online date.</div>}
    {(errors.printDateIncomplete || errors.onlineDateIncomplete) && requiredMessage()}
    {(errors.printDateInvalid || errors.onlineDateInvalid) && <div><b>Invalid Publication Date.</b><br />Please check your date.</div>}
    {errors.firstPage && requiredMessage()}

    {errors.contributorLastName && requiredMessage()}
    {errors.contributorRole && requiredMessage()}
    {errors.contributorGroupRole && requiredMessage()}
    {errors.contributorGroupName && requiredMessage()}

    {(errors.licenseFreeToRead) && <div><b>License Url Required.</b><br />Please provide a license URL.</div>}
    {errors.licenseDateIncomplete && requiredMessage()}
    {(errors.licenseDateInvalid) && <div><b>Invalid License Date.</b><br />Please check your Date.</div>}
    {errors.licenseUrl && requiredMessage()}
    {(errors.licenseUrlInvalid) && <div><b>Invalid License URL.</b><br />Please check your URL.</div>}

    {(errors.relatedItemDoiInvalid) && <div><b>Invalid Related Item DOI.</b><br />Please check your DOI (10.xxxx/xx...)..</div>}
    {errors.relatedItemIdType && requiredMessage()}
    {errors.relatedItemRelType && requiredMessage()}

    {errors.simCheckUrlInvalid && <div><b>Invalid Similarity Check URL.</b><br />Please check your URL.</div>}

    {errors[`${pubHist} Label`] && requiredMessage()}
    {errors[`${peer} Label`] && requiredMessage()}
    {errors[`${peer} Href`] && <div><b>Invalid Crossmark URL.</b><br />Please check your Peer Review URL.</div>}
    {errors[`${copyright} Label`] && requiredMessage()}
    {errors[`${copyright} Href`] && <div><b>Invalid Crossmark URL.</b><br />Please check your Copyright / Licensing URL.</div>}
    {errors[`${other} Label`] && requiredMessage()}
    {errors[`${other} Href`] && <div><b>Invalid Crossmark URL.</b><br />Please check your Other URL.</div>}
    {errors[`${supp} Href`] && <div><b>Invalid Crossmark URL.</b><br />Please check your Supplementary Material URL.</div>}
    {errors[`${update} Type`] && requiredMessage()}
    {errors[`${update} Date`] && requiredMessage()}
    {errors[`${update} DOI`] && requiredMessage()}
    {errors[`${update} DOIinvalid`] && <div><b>Invalid Crossmark DOI.</b><br />Please check your Status Update DOI (10.xxxx/xx...).</div>}
    {errors[`${clinical} Registry`] && requiredMessage()}
    {errors[`${clinical} TrialNumber`] && requiredMessage()}

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
    const {errors, disabled, handleChange, doi} = this.props;
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
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export class DatesRow extends Component {

  render() {
    const errors = this.props.errors;
    const {printDateYear, printDateMonth, printDateDay, onlineDateYear, onlineDateMonth, onlineDateDay} = this.props.article;
    const {printDateInvalid, printDateIncomplete, onlineDateInvalid, onlineDateIncomplete} = this.props.errors;
    const printYearError = errors.printDateYear || printDateIncomplete || printDateInvalid;
    const onlineYearError = errors.onlineDateYear || onlineDateIncomplete || onlineDateInvalid;
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
                      {this.props.makeDateDropDown(this.props.handleChange, 'printDateYear', 'y', printDateYear, printYearError)}
                    </div>
                  </div>
                  <div className='dateselectholder'>
                    <div>Month</div>
                    <div>
                      {this.props.makeDateDropDown(this.props.handleChange, 'printDateMonth', 'm', printDateMonth, printDateInvalid)}
                    </div>
                  </div>
                  <div className='dateselectholder'>
                    <div>Day</div>
                    <div>
                      {this.props.makeDateDropDown(this.props.handleChange, 'printDateDay', 'd', printDateDay, printDateInvalid)}
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
                    <div>{this.props.makeDateDropDown(this.props.handleChange, 'onlineDateYear', 'y', onlineDateYear, onlineYearError)}</div>
                  </div>
                  <div className='dateselectholder'>
                    <div>Month</div>
                    <div>
                      {this.props.makeDateDropDown(this.props.handleChange, 'onlineDateMonth', 'm', onlineDateMonth, onlineDateInvalid)}
                    </div>
                  </div>
                  <div className='dateselectholder'>
                    <div>Day</div>
                    <div>
                      {this.props.makeDateDropDown(this.props.handleChange, 'onlineDateDay', 'd', onlineDateDay, onlineDateInvalid)}
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
                  <div className='label'>Accepted Date</div>
                </div>
              </div>
              <div className='requrefieldholder'>
                <div className='requiredholder dateselectrequire norequire'>
                  <div className='required height32'>
                  </div>
                </div>
                <div className='field'>
                  <div className='datepickerholder'>
                    <div className='dateselectholder'>
                      <div>Year</div>
                      <div>{this.props.makeDateDropDown(this.props.handleChange, 'acceptedDateYear', 'y', this.props.article.acceptedDateYear, false)}</div>
                    </div>
                    <div className='dateselectholder'>
                      <div>Month</div>
                      <div>
                        {this.props.makeDateDropDown(this.props.handleChange, 'acceptedDateMonth', 'm', this.props.article.acceptedDateMonth, false)}
                      </div>
                    </div>
                    <div className='dateselectholder'>
                      <div>Day</div>
                      <div>
                        {this.props.makeDateDropDown(this.props.handleChange,'acceptedDateDay', 'd', this.props.article.acceptedDateDay, false)}
                      </div>
                    </div>
                    <div>
                    </div>
                  </div>
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


