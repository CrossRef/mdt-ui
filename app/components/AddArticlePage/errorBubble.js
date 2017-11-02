import React from 'react'
import ReactDom from 'react-dom'
import is from 'prop-types'
import $ from 'jquery'

import {ClassWrapper} from '../../utilities/helpers'
import {cardNames} from '../../utilities/crossmarkHelpers'
const {pubHist, peer, update, clinical, copyright, other, supp} = cardNames
import {ArticleMessages} from '../../utilities/lists/validationMessages'
import {routes} from '../../routing'




export default class ErrorBubble extends React.Component{

  static propTypes = {
    errors: is.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      requiredMessageInUse: false,
      errorBubbleOffscreen: undefined,
      errorBubblePosition: undefined
    }
  }


  componentDidMount() {
    this.refreshErrorBubble()
    this.deferredErrorBubbleRefresh()
  }


  refreshErrorBubble = () => {
    const firstError = $('.fieldError').first()
    const switchLicense = $('.switchLicense').first()
    let newErrorBubblePosition
    try {
      newErrorBubblePosition = `${((firstError.offset().top + (firstError.position().top - (firstError.position().top * .9)) - (switchLicense.position().top + 15) - (switchLicense.offset().top + 15))) + 25}px`
    } catch (e) {
      newErrorBubblePosition = false
    }

    if(!newErrorBubblePosition && this.state.errorBubblePosition) {
      document.removeEventListener('scroll', this.refreshStickyError, false)
    } else if (newErrorBubblePosition && !this.state.errorBubblePosition) {
      document.addEventListener('scroll', this.refreshStickyError, false)
    }

    if(this.state.errorBubblePosition !== newErrorBubblePosition) {
      this.setState({errorBubblePosition: newErrorBubblePosition}, newErrorBubblePosition ? this.refreshStickyError : null)
    }
  }


  refreshStickyError = () => {
    const bounds = ReactDom.findDOMNode(this.refs.ErrorBubble).getBoundingClientRect()
    const ErrorIsVisible = bounds.top < window.innerHeight && bounds.bottom > 0
    const errorIsAbove = bounds.top < 0
    let errorBubbleOffscreen
    if (ErrorIsVisible) {
      errorBubbleOffscreen = false
    } else {
      errorBubbleOffscreen =  errorIsAbove ? 'above' : 'below'
    }
    if(!errorBubbleOffscreen && this.state.errorBubbleOffscreen) {
      this.setState({errorBubbleOffscreen})
    } else if (errorBubbleOffscreen && !this.state.errorBubbleOffscreen) {
      this.setState({errorBubbleOffscreen})
    }
  }


  deferredErrorBubbleRefresh = () => {
    this.props.deferredErrorBubbleRefresh.reset()
    this.props.deferredErrorBubbleRefresh.promise
      .then(()=>{
        if(this._calledComponentWillUnmount) {
          return
        }
        this.refreshErrorBubble()
        this.deferredErrorBubbleRefresh()
      })
  }


  requiredMessage = () => {
    if(!this.state.requiredMessageInUse) {
      this.state.requiredMessageInUse = true
      return <div><b>Required.</b><br />Please provide required information.</div>
    } else {
      return null
    }
  }


  errorMessage = (error) => {
    if(ArticleMessages[error].type === 'required') {
      return this.requiredMessage()
    }
    return <div><b>{ArticleMessages[error].bold}</b><br/>{ArticleMessages[error].message}</div>
  }


  scrollToError = () => {
    $('html, body').animate({
      scrollTop: this.state.errorBubblePosition
    }, 1000);
  }


  componentWillUnmount () {
    document.removeEventListener('scroll', this.refreshStickyError, false)
    this.props.deferredErrorBubbleRefresh.reject()
  }


  render() {
    const errors = this.props.errors
    return (
      <div>
        {this.state.errorBubblePosition &&
          <ClassWrapper
            classNames={['errorHolder talltooltip fullError', 'toolTipHolder', ['a', "tooltips"]]}>

            <div className="toolmsgholder" ref="ErrorBubble" style={{top: this.state.errorBubblePosition}}>
              <div className="errormsgholder">
                <div className="errormsginnerholder">
                  <div><img src={`${routes.images}/AddArticle/Asset_Icons_White_Caution.svg`}/></div>

                  {this.state.requiredMessageInUse = false}
                  {errors.title && this.errorMessage('title')}
                  {errors.doi && this.errorMessage('doi')}
                  {errors.invaliddoi && this.errorMessage('invaliddoi')}
                  {errors.invalidDoiPrefix && this.errorMessage('invalidDoiPrefix')}
                  {errors.dupedoi && this.errorMessage('dupedoi')}
                  {errors.url && this.errorMessage('url')}
                  {errors.invalidurl && this.errorMessage('invalidurl')}
                  {(errors.printDateYear || errors.onlineDateYear) && this.errorMessage('printDateYear')}
                  {(errors.printDateIncomplete || errors.onlineDateIncomplete) && this.errorMessage('printDateIncomplete')}
                  {errors.printDateInvalid && this.errorMessage('printDateInvalid')}
                  {errors.onlineDateInvalid && this.errorMessage('onlineDateInvalid')}
                  {errors.firstPage && this.errorMessage('')}

                  {errors.contributorLastName && this.errorMessage('contributorLastName')}
                  {errors.contributorRole && this.errorMessage('contributorRole')}
                  {errors.contributorGroupRole && this.errorMessage('contributorGroupRole')}
                  {errors.contributorGroupName && this.errorMessage('contributorGroupName')}

                  {errors.freetolicense && this.errorMessage('freetolicense')}
                  {errors.licenseDateIncomplete && this.errorMessage('licenseDateIncomplete')}
                  {errors.licenseDateInvalid && this.errorMessage('licenseDateInvalid')}
                  {errors.licenseUrl && this.errorMessage('licenseUrl')}
                  {errors.licenseUrlInvalid && this.errorMessage('licenseUrlInvalid')}

                  {errors.relatedItemDoiInvalid && this.errorMessage('relatedItemDoiInvalid')}
                  {errors.relatedItemIdType && this.errorMessage('relatedItemIdType')}
                  {errors.relatedItemRelType && this.errorMessage('relatedItemRelType')}

                  {errors.simCheckUrlInvalid && this.errorMessage('simCheckUrlInvalid')}

                  {errors[`${pubHist} Label`] && this.errorMessage(`${pubHist} Label`)}
                  {errors[`${peer} Label`] && this.errorMessage(`${peer} Label`)}
                  {errors[`${peer} Href`] && this.errorMessage(`${peer} Href`)}
                  {errors[`${copyright} Label`] && this.errorMessage(`${copyright} Label`)}
                  {errors[`${copyright} Href`] && this.errorMessage(`${copyright} Href`)}
                  {errors[`${other} Label`] && this.errorMessage(`${other} Label`)}
                  {errors[`${other} Href`] && this.errorMessage(`${other} Href`)}
                  {errors[`${supp} Href`] && this.errorMessage(`${supp} Href`)}
                  {errors[`${update} Type`] && this.errorMessage(`${update} Type`)}
                  {errors[`${update} Date`] && this.errorMessage(`${update} Date`)}
                  {errors[`${update} DOI`] && this.errorMessage(`${update} DOI`)}
                  {errors[`${update} DOIinvalid`] && this.errorMessage(`${update} DOIinvalid`)}
                  {errors[`${update} DOINotExist`] && this.errorMessage(`${update} DOINotExist`)}
                  {errors[`${clinical} Registry`] && this.errorMessage(`${clinical} Registry`)}
                  {errors[`${clinical} TrialNumber`] && this.errorMessage(`${clinical} TrialNumber`)}
                </div>
              </div>
            </div>

            {this.state.errorBubbleOffscreen &&
              <div className={`stickyError ${this.state.errorBubbleOffscreen === 'below' ? 'errorBelow' : 'errorAbove'}`} ref="StickyError"
                onClick={this.scrollToError}>
                  <p>More Errors</p>
                  <img className={this.state.errorBubbleOffscreen === 'below' && 'rotate'} src={`${routes.images}/AddArticle/Triangle.svg`}/>
              </div>
            }
          </ClassWrapper>
        }
      </div>
    )
  }
}