import React from 'react'
import ReactDOM from 'react-dom'
import is from 'prop-types'
import $ from 'jquery'

import {routes} from '../../routing'






export default class StickyError extends React.Component {


  static propTypes = {
    errorUtility: is.object.isRequired,
  }


  state = {
    errorsAbove: false,
    errorsBelow: false,
    hideTop: false,
    hideBottom: false
  }


  componentDidMount() {
    this.refreshStickyError()
    this.props.errorUtility.assignStickyErrorRefresh(this.refreshStickyError)
    document.addEventListener('scroll', this.refreshStickyError, false)
  }


  refreshStickyError = () => {
    let topDimensions
    if(this.refs.top) {
      topDimensions = ReactDOM.findDOMNode(this.refs.top).getBoundingClientRect()
    }
    let bottomDimensions
    if(this.refs.bottom) {
      bottomDimensions = ReactDOM.findDOMNode(this.refs.bottom).getBoundingClientRect()
    }

    let errorsAbove = false
    let errorsBelow = false
    let hideTop = false
    let hideBottom = false

    for(let indicator of this.props.errorUtility.errorIndicators) {
      const indicatorDimensions = ReactDOM.findDOMNode(indicator.node).getBoundingClientRect()
      const indicatorOffscreen = this.checkPosition(indicatorDimensions)
      if(indicatorOffscreen === 'errorsAbove') {
        errorsAbove = true
      } else if (indicatorOffscreen === 'errorsBelow') {
        errorsBelow = true
      }

      if(!indicatorOffscreen && (this.refs.top || this.refs.bottom)) {
        //Check if an indicator is in the same spot as stickyError and hide stickyError
        if(this.refs.top && topDimensions.bottom > indicatorDimensions.top) {
          hideTop = true
        }
        if(this.refs.bottom && bottomDimensions.top < indicatorDimensions.bottom) {
          hideBottom = true
        }
      }
    }

    if(
      this.state.errorsAbove !== errorsAbove ||
      this.state.errorsBelow !== errorsBelow ||
      this.state.hideBottom !== hideBottom ||
      this.state.hideTop !== hideTop
    ) {
      this.setState({
        errorsAbove,
        errorsBelow,
        hideTop,
        hideBottom
      })
    }
  }


  checkPosition = (dimensions) => {
    const indicatorOnScreen = dimensions.top < window.innerHeight && dimensions.bottom > 0
    const indicatorIsAbove = dimensions.top < 0
    let indicatorOffscreen
    if (indicatorOnScreen) {
      indicatorOffscreen = false
    } else {
      indicatorOffscreen =  indicatorIsAbove ? 'errorsAbove' : 'errorsBelow'
    }
    return indicatorOffscreen
  }


  scrollToErrorAbove = async () => {
    const errorUtility = this.props.errorUtility
    let errorAbove
    let errorAboveDimensions

    for(let indicator of errorUtility.errorIndicators) {
      const indicatorDimensions = ReactDOM.findDOMNode(indicator.node).getBoundingClientRect()
      if(indicatorDimensions.top < 0) {
        errorAbove = indicator
        errorAboveDimensions = indicatorDimensions
      }
    }

    if(errorAbove.subItemIndex) {
      errorUtility.subItemIndex = errorAbove.subItemIndex
    }

    if(errorAbove.openSubItem) {
      errorAbove.openSubItem()
      await errorUtility.setErrorMessages(errorAbove.activeErrors)
      const errorBubble = errorUtility.errorIndicators[errorUtility.activeIndicator]
      const errorBubbleDimensions = ReactDOM.findDOMNode(errorBubble.node).getBoundingClientRect()

      $('html, body').animate({
        scrollTop: `-=${(errorBubbleDimensions.top - 200) * -1}`
      }, 1000);

    } else {
      errorUtility.setErrorMessages(errorAbove.activeErrors)

      $('html, body').animate({
        scrollTop: `-=${(errorAboveDimensions.top - 200) * -1}`
      }, 1000);
    }
  }


  scrollToErrorBelow = async () => {
    const errorUtility = this.props.errorUtility
    let errorBelow
    let errorBelowDimensions

    for(let indicator of errorUtility.errorIndicators) {
      const indicatorDimensions = ReactDOM.findDOMNode(indicator.node).getBoundingClientRect()
      if(indicatorDimensions.top > window.innerHeight) {
        errorBelow = indicator
        errorBelowDimensions = indicatorDimensions
        break
      }
    }

    if(errorBelow.subItemIndex) {
      errorUtility.subItemIndex = errorBelow.subItemIndex
    }

    if(errorBelow.openSubItem) {
      errorBelow.openSubItem()
      await errorUtility.setErrorMessages(errorBelow.activeErrors)
      const errorBubble = errorUtility.errorIndicators[errorUtility.activeIndicator]
      const errorBubbleDimensions = ReactDOM.findDOMNode(errorBubble.node).getBoundingClientRect()

      $('html, body').animate({
        scrollTop: `+=${errorBubbleDimensions.top - window.innerHeight + 400}`
      }, 1000);

    } else {
      errorUtility.setErrorMessages(errorBelow.activeErrors)

      $('html, body').animate({
        scrollTop: `+=${errorBelowDimensions.top - window.innerHeight + 400}`
      }, 1000);
    }
  }


  componentWillUnmount () {
    document.removeEventListener('scroll', this.refreshStickyError, false)
    this.props.errorUtility.stickyErrorMounted = false
  }


  render () {
    return (
      <div className="errorHolder">
        {this.state.errorsAbove &&
          <div className={`stickyError errorAbove ${this.state.hideTop ? 'hideSticky' : ''}`} ref="top"
               onClick={this.scrollToErrorAbove}>
            <p>More Errors</p>
            <img src={`${routes.images}/AddArticle/Triangle.svg`}/>
          </div>
        }
        {this.state.errorsBelow &&
          <div className={`stickyError errorBelow ${this.state.hideBottom ? 'hideSticky' : ''}`} ref="bottom"
               onClick={this.scrollToErrorBelow}>
            <p>More Errors</p>
            <img className='rotate' src={`${routes.images}/AddArticle/Triangle.svg`}/>
          </div>
        }
      </div>
    )
  }






}