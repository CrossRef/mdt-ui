import React from 'react'
import is from 'prop-types'

import {ArticleMessages} from '../../utilities/lists/validationMessages'
import {routes} from '../../routing'




export default class ErrorBubble extends React.Component{

  static propTypes = {
    errorMessages: is.array.isRequired,
    activeErrors: is.array.isRequired,
    errorUtility: is.object.isRequired,
    saveRef: is.func.isRequired,
  }

  constructor(props) {
    super()

    //Clicking a subItem indicator sets errorMessages to all errors tracked by that subItem, so this
    //code runs on the first errorBubble created and resets the errorMessages to just the errors in first row
    if(props.errorMessages.length > props.activeErrors.length && !props.errorUtility.openingSubItem) {
      props.errorUtility.setErrorMessages(props.activeErrors)
      props.errorUtility.openingSubItem = true
    }
  }


  errorMessage = (error) => {
    return <div className="msgContainer" key={error}><b>{ArticleMessages[error].bold}</b><br/><span>{ArticleMessages[error].message}</span></div>
  }


  filterErrors = (errors) => {
    const newErrors = [...errors]
    if(newErrors.indexOf('printDateYear') > -1 && newErrors.indexOf('onlineDateYear') > -1) {
      const onlineDateYearIndex = newErrors.indexOf('onlineDateYear')
      newErrors.splice(onlineDateYearIndex, 1)
    }
    return newErrors
  }


  render() {
    return (
      <div id="errorBubble" className="fullErrorHolder" ref={(node)=>this.props.saveRef(node)}>
        <div className="errormsgholder">
          <div className="errormsginnerholder">
            <div className="errorIndicator2"
              onClick={()=>this.props.errorUtility.setErrorMessages([])}>
                <img src={`${routes.images}/Deposit/Asset_Icons_Red_Caution.png`}/>
            </div>

            {this.filterErrors(this.props.errorMessages).map((error) => this.errorMessage(error))}
          </div>
        </div>
      </div>
    )
  }
}




// {this.state.errorBubbleOffscreen &&
// <div className={`stickyError ${this.state.errorBubbleOffscreen === 'below' ? 'errorBelow' : 'errorAbove'}`} ref="StickyError"
//      onClick={this.scrollToError}>
//   <p>More Errors</p>
//   <img className={this.state.errorBubbleOffscreen === 'below' && 'rotate'} src={`${routes.images}/AddArticle/Triangle.svg`}/>
// </div>
// }


// refreshStickyError = () => {
//   const bounds = ReactDom.findDOMNode(this.refs.ErrorBubble).getBoundingClientRect()
//   const ErrorIsVisible = bounds.top < window.innerHeight && bounds.bottom > 0
//   const errorIsAbove = bounds.top < 0
//   let errorBubbleOffscreen
//   if (ErrorIsVisible) {
//     errorBubbleOffscreen = false
//   } else {
//     errorBubbleOffscreen =  errorIsAbove ? 'above' : 'below'
//   }
//   if(!errorBubbleOffscreen && this.state.errorBubbleOffscreen) {
//     this.setState({errorBubbleOffscreen})
//   } else if (errorBubbleOffscreen && !this.state.errorBubbleOffscreen) {
//     this.setState({errorBubbleOffscreen})
//   }
// }

//document.removeEventListener('scroll', this.refreshStickyError, false)

// scrollToError = () => {
//   $('html, body').animate({
//     scrollTop: this.state.errorBubblePosition
//   }, 1000);
// }


