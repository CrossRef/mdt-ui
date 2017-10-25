import React from 'react'
import is from 'prop-types'
import $ from 'jquery'

import {IssueMessages} from '../../utilities/lists/validationMessages'
import {routes} from '../../routing'




export default class ErrorBubble extends React.Component{

  static propTypes = {
    errors: is.object.isRequired
  }
  

  constructor() {
    super()
    this.state = {
      requiredMessageInUse: false,
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

    if(this.state.errorBubblePosition !== newErrorBubblePosition) {
      this.setState({errorBubblePosition: newErrorBubblePosition})
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
    if(IssueMessages[error].type === 'required') {
      return this.requiredMessage()
    }
    return <div><b>{IssueMessages[error].bold}</b><br/>{IssueMessages[error].message}</div>
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
          <div className='errorHolder talltooltip fullError'>
            <div className='toolTipHolder'>
              <a className="tooltips">
                <div className='toolmsgholder' style={{top: this.state.errorBubblePosition}}>
                  <div className='errormsgholder'>
                    <div className='errormsginnerholder'>
                      <div><img src={`${routes.images}/AddArticle/Asset_Icons_White_Help.svg`} /></div>

                      {this.state.requiredMessageInUse = false}
                      {errors.issueVolume && this.errorMessage('issueVolume')}
                      {errors.issuedoi && this.errorMessage('issuedoi')}
                      {errors.issueUrl && this.errorMessage('issueUrl')}
                      {(errors.printDateYear || errors.onlineDateYear) && this.errorMessage('printDateYear')}
                      {errors.printDateIncomplete && this.errorMessage('printDateIncomplete')}
                      {errors.onlineDateIncomplete && this.errorMessage('onlineDateIncomplete')}
                      {errors.volumeUrl && this.errorMessage('volumeUrl')}
                      {errors.volumedoi && this.errorMessage('volumedoi')}
                      {errors.contributorLastName && this.errorMessage('contributorLastName')}
                      {errors.contributorRole && this.errorMessage('contributorRole')}
                      {errors.invalidissuedoi && this.errorMessage('invalidissuedoi')}
                      {errors.invalidissuedoi && this.errorMessage('invalidissuedoi')}
                      {errors.invalidIssueDoiPrefix && this.errorMessage('invalidIssueDoiPrefix')}
                      {errors.dupeissuedoi && this.errorMessage('dupeissuedoi')}
                      {errors.dupeDois && this.errorMessage('dupeDois')}
                      {errors.invalidissueurl && this.errorMessage('invalidissueurl')}
                      {errors.printDateInvalid && this.errorMessage('printDateInvalid')}
                      {errors.onlineDateInvalid && this.errorMessage('onlineDateInvalid')}
                      {errors.invalidvolumedoi && this.errorMessage('invalidvolumedoi')}
                      {errors.invalidVolumeDoiPrefix && this.errorMessage('invalidVolumeDoiPrefix')}
                      {errors.dupevolumedoi && this.errorMessage('dupevolumedoi')}
                      {errors.invalidvolumeurl && this.errorMessage('invalidvolumeurl')}

                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        }
      </div>
    )
  }
}