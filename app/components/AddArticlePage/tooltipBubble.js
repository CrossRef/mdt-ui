import React from 'react'
import is from 'prop-types'
import $ from 'jquery'

import {ClassWrapper, getErrorPosition, getTooltipPosition} from '../../utilities/helpers'
import {routes} from '../../routing'




export default class TooltipBubble extends React.Component{

  static propTypes = {

  }

  constructor() {
    super()
    this.state = {
      bubblePosition: undefined,
      tooltip: ''
    }
  }


  componentDidMount() {
    this.refreshBubble()
    this.deferredTooltipBubbleRefresh()
  }


  deferredTooltipBubbleRefresh = () => {
    this.props.deferredTooltipBubbleRefresh.reset()
    this.props.deferredTooltipBubbleRefresh.promise
      .then((tooltip)=>{
        if(this._calledComponentWillUnmount) {
          return
        }
        this.deferredTooltipBubbleRefresh()
        this.refreshBubble(tooltip)
      })
  }


  refreshBubble = (tooltip) => {
    let newBubblePosition = getTooltipPosition()
    const error = $('.fullErrorHolder')
    if(error.length) {
      const errorTop = getErrorPosition()
      const errorHeight = error.outerHeight()
      const errorBottom = errorTop + errorHeight

      if(newBubblePosition - 1 <= errorBottom && newBubblePosition + 37 >= errorTop) {
        newBubblePosition += (errorBottom - newBubblePosition + 2)
      }
    }

    if(this.state.bubblePosition !== newBubblePosition || (tooltip && tooltip !== this.state.tooltip)) {
      this.setState({
        bubblePosition: newBubblePosition,
        tooltip: tooltip || this.state.tooltip
      })
    }
  }


  tooltipMessage = () => {
    return <div>{this.state.tooltip}</div>
  }


  componentWillUnmount () {
    this.props.deferredTooltipBubbleRefresh.reject()
  }


  render() {
    return (
      <div>
        {this.state.bubblePosition &&
        <ClassWrapper
          classNames={['errorHolder talltooltip helpers', 'toolTipHolder', ['a', "tooltips"]]}>

          <div className="toolmsgholder" ref="tooltipBubble" style={{top: this.state.bubblePosition}}>
            <div className="errormsgholder">
              <div className="errormsginnerholder">
                <div><img src={`${routes.images}/AddArticle/Asset_Icons_Black_Help.svg`} /></div>
                {this.tooltipMessage()}
              </div>
            </div>
          </div>

        </ClassWrapper>
        }
      </div>
    )
  }
}