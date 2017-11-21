import React from 'react'
import is from 'prop-types'
import ReactDOM from 'react-dom'

import {getTooltipPosition} from '../../utilities/helpers'
import {routes} from '../../routing'




export default class TooltipBubble extends React.Component{

  static propTypes = {
    deferredTooltipBubbleRefresh: is.object.isRequired,
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

    if(this.state.bubblePosition !== newBubblePosition || (tooltip && tooltip !== this.state.tooltip)) {
      console.log('when does tooltip REFRESH!?')
      this.setState({
        bubblePosition: newBubblePosition,
        tooltip: tooltip || this.state.tooltip,
        displaced: false
      })
    }
  }


  componentDidUpdate () {
    console.log('when does tooltip update?', this.props.errorUtility.errorIndicators.length)
    try {
      if(!this.state.displaced) {
        const myDimensions = ReactDOM.findDOMNode(this.node).getBoundingClientRect()
        const errorBubble = this.props.errorUtility.errorIndicators[this.props.errorUtility.activeIndicator].node
        if(errorBubble.id !== 'errorBubble') {
          return
        }
        const errorBubbleDimensions = ReactDOM.findDOMNode(errorBubble).getBoundingClientRect()
        if(errorBubbleDimensions.bottom > myDimensions.top) {
          const displacement = errorBubbleDimensions.bottom - myDimensions.top + 2
          this.setState({
            displaced: true,
            bubblePosition: this.state.bubblePosition + displacement
          })
        }
      }
    } catch (e) {}
  }


  tooltipMessage = () => {
    return <div>{this.state.tooltip}</div>
  }


  componentWillUnmount () {
    this.props.deferredTooltipBubbleRefresh.reject()
  }


  render() {
    return this.state.bubblePosition ?
      <div className="toolmsgholder" ref={(node)=>this.node=node} style={{top: this.state.bubblePosition}}>
        <div className="errormsgholder">
          <div className="errormsginnerholder">
            <div><img src={`${routes.images}/AddArticle/Asset_Icons_Grey_Help.svg`} /></div>
            {this.tooltipMessage()}
          </div>
        </div>
      </div>
    : null
  }
}