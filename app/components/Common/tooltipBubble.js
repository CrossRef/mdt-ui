import React from 'react'
import is from 'prop-types'
import ReactDOM from 'react-dom'

import {getTooltipPosition} from '../../utilities/helpers'
import {routes} from '../../routing'




export default class TooltipBubble extends React.Component{

  static propTypes = {
    tooltipUtility: is.object.isRequired,
    errorUtility: is.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      bubblePosition: undefined,
      tooltip: '',
      displaced: false
    }
  }


  componentDidMount() {
    this.refreshBubble()
    this.props.tooltipUtility.assignRefreshTask(this.refreshBubble)
  }


  refreshBubble = (tooltip) => {
    let newBubblePosition = getTooltipPosition()

    this.setState({
      bubblePosition: newBubblePosition,
      tooltip: tooltip || this.state.tooltip,
      displaced: false
    })
  }


  componentDidUpdate () {
    try {
      if(!this.state.displaced) {
        const myDimensions = ReactDOM.findDOMNode(this.node).getBoundingClientRect()
        const errorBubble = this.props.errorUtility.errorIndicators[this.props.errorUtility.activeIndicator].node
        if(errorBubble.id !== 'errorBubble') {
          return
        }
        const errorBubbleDimensions = ReactDOM.findDOMNode(errorBubble).getBoundingClientRect()
        if(errorBubbleDimensions.bottom > myDimensions.top && errorBubbleDimensions.top < myDimensions.bottom) {
          const displacement = errorBubbleDimensions.bottom - myDimensions.top + 2
          this.setState({
            displaced: true,
            bubblePosition: this.state.bubblePosition + displacement
          })
        }
      }
    } catch (e) {}
  }


  componentWillUnmount () {
    this.props.tooltipUtility.tooltipMounted = false
  }


  render() {
    const positionAdjust = this.props.issue ? 3 : 0
    return this.state.bubblePosition ?
      <div className="toolmsgholder" ref={(node)=>this.node=node} style={{top: this.state.bubblePosition + positionAdjust}}>
        <div className="errormsgholder">
          <div className="errormsginnerholder">
            <div><img src={`${routes.images}/AddArticle/Asset_Icons_Grey_Help.svg`} /></div>
            <div>{this.state.tooltip}</div>
          </div>
        </div>
      </div>
    : null
  }
}