import React from 'react'
import ReactDom from 'react-dom'
import is from 'prop-types'
import $ from 'jquery'

import {getErrorPosition} from '../../utilities/helpers'
import {ArticleMessages} from '../../utilities/lists/validationMessages'
import {routes} from '../../routing'
import {cardNames} from '../../utilities/crossmarkHelpers'
const {pubHist, peer, update, clinical, copyright, other, supp} = cardNames




export default class ErrorBubble extends React.Component{

  static propTypes = {
    position: is.object,
    nodeRefs: is.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      errors: 0
    }
  }


  componentDidMount() {

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


  errorMessage = (error) => {
    return <div key={error}><b>{ArticleMessages[error].bold}</b><br/>{ArticleMessages[error].message}</div>
  }


  scrollToError = () => {
    $('html, body').animate({
      scrollTop: this.state.errorBubblePosition
    }, 1000);
  }


  componentWillUnmount () {
    //document.removeEventListener('scroll', this.refreshStickyError, false)
  }


  filterErrors = (errors) => {
    const newErrors = [...errors]
    if(newErrors.indexOf('printDateYear') > -1) {
      const onlineDateYearIndex = newErrors.indexOf('onlineDateYear')
      newErrors.splice(onlineDateYearIndex, 1)
    }

    return newErrors
  }


  renderErrorBubble = (errorIndicators) => {
    const errors = Array.from(errorIndicators).map((errorIndicator)=>{
      if(!errorIndicator.id) {
        console.error(errorIndicator)
        throw "Error positioning errorBubble"
      }
      return errorIndicator.id
    })

    return (
      <div className="fullErrorHolder" ref={(node)=>this.props.nodeRefs.errorBubble = node}>
        <div className="errormsgholder">
          <div className="errormsginnerholder">
            <div><img src={`${routes.images}/AddArticle/Asset_Icons_White_Caution.svg`}/></div>

            {this.filterErrors(errors).map((error) => this.errorMessage(error))}
          </div>
        </div>
      </div>
    )
  }


  componentDidUpdate (prevProps) {
    try {
      const errorNodes = this.props.position.getElementsByClassName('errorIndicator').length
      if(this.state.errors !== errorNodes) {
        this.forceUpdate()
      }
      this.state.errors = errorNodes
    } catch (e) {console.error(e)}
  }


  render() {
    if(this.props.position) {
      const errorIndicators = this.props.position.getElementsByClassName('errorIndicator')

      if(errorIndicators.length) {
        return ReactDom.createPortal(
          this.renderErrorBubble(errorIndicators),
          this.props.position
        )
      } else {
        const firstErrorHolder = document.getElementsByClassName('errorIndicator')[0].parentElement
        const errorIndicators = firstErrorHolder.getElementsByClassName('errorIndicator')

        return ReactDom.createPortal(
          this.renderErrorBubble(errorIndicators),
          firstErrorHolder
        )
      }
    } else {
      return null
    }


  }
}




// {this.state.errorBubbleOffscreen &&
// <div className={`stickyError ${this.state.errorBubbleOffscreen === 'below' ? 'errorBelow' : 'errorAbove'}`} ref="StickyError"
//      onClick={this.scrollToError}>
//   <p>More Errors</p>
//   <img className={this.state.errorBubbleOffscreen === 'below' && 'rotate'} src={`${routes.images}/AddArticle/Triangle.svg`}/>
// </div>
// }