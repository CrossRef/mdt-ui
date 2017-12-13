import React from 'react'
import ReactDOM from 'react-dom'
import is from 'prop-types'

import ErrorBubble from './errorBubble'
import {routes} from '../../routing'




export default class ErrorIndicator extends React.Component {
  static propTypes = {
    indicatorErrors: is.array.isRequired,
    errorMessages: is.array.isRequired,
    errorUtility: is.object.isRequired,
    allErrors: is.object.isRequired,
    tooltipUtility: is.object.isRequired,
    openSubItem: is.func,
    subItemIndex: is.string,
    issue: is.bool,
    style: is.string
  }

  static defaultProps = {
    errorMessages: []
  }


  constructor (props) {
    super()

    const {newActiveErrors, newRender} = this.checkErrors(props)

    this.state = {
      render: newRender,
      activeErrors: newActiveErrors,
      hide: false
    }
  }


  checkErrors = (props) => {
    let newRender
    const newActiveErrors = props.indicatorErrors.filter((error)=>{
      return props.allErrors[error]
    })

    if(newActiveErrors.length) {
      newRender = 'errorIndicator'
    } else {
      newRender = null
    }

    if(newRender) {
      for(let error of props.errorMessages) {
        if(props.indicatorErrors.indexOf(error) > -1) {
          newRender = 'errorBubble'
          break
        }
      }
    }

    if(props.subItemIndex && props.subItemIndex !== props.errorUtility.subItemIndex && newRender === 'errorBubble') {
      newRender = 'errorIndicator'
    }

    return {newActiveErrors, newRender}
  }


  componentWillReceiveProps (nextProps) {
    const {newActiveErrors, newRender} =  this.checkErrors(nextProps)

    if(
      this.state.render === 'errorBubble' &&
      newRender === 'errorBubble' &&
      !newActiveErrors.equals(this.state.activeErrors)
    ){
      this.props.errorUtility.setErrorMessages(newActiveErrors)
    }

    this.setState({
      render: newRender,
      activeErrors: newActiveErrors,
      hide: false
    })
  }


  onClick = () => {
    this.props.tooltipUtility.assignFocus('')
    if(this.props.subItemIndex) {
      this.props.errorUtility.subItemIndex = this.props.subItemIndex
    }
    if(this.props.openSubItem) {
      this.props.openSubItem()
      this.props.errorUtility.setErrorMessages(this.state.activeErrors)
    } else {
      this.props.errorUtility.setErrorMessages(this.state.activeErrors)
    }
  }


  saveRef = (node) => {
    this.node = node
    this.props.errorUtility.saveRef(this.state.activeErrors, this.props.indicatorErrors, node, this.props.subItem, this.props.subItemIndex, this.props.openSubItem)
  }


  componentDidUpdate () {
    try {
      //Check if errorBubble is above this indicator, if so check if it is obscured by it and needs to be hidden
      if(!this.state.hide) {
        const errorIndicators = this.props.errorUtility.errorIndicators
        const previousNode = errorIndicators[errorIndicators.length - 2].node
        if(previousNode.id === 'errorBubble') {
          const errorBubbleDimensions = ReactDOM.findDOMNode(previousNode).getBoundingClientRect()
          const myDimensions = ReactDOM.findDOMNode(this.node).getBoundingClientRect()
          if(errorBubbleDimensions.bottom > myDimensions.top) {
            this.setState({hide: true})
          }
        }
      }
    } catch (e) {}
  }


  render() {
    return (
      <div className={`errorHolder ${this.props.style ? this.props.style : ''}`}>
        {this.state.render && (this.state.render === 'errorIndicator' ?
          <div
            className={`errorIndicator ${this.state.hide ? 'hideIndicator' : ''}`}
            onClick={this.onClick}
            ref={(node)=>this.saveRef(node)}>
              <img src={`${routes.images}/Deposit/Asset_Icons_Red_Caution.png`}/>
          </div>
        :
          <ErrorBubble
            issue={this.props.issue}
            errorMessages={this.props.errorMessages}
            activeErrors={this.state.activeErrors}
            errorUtility={this.props.errorUtility}
            saveRef={this.saveRef}
            subItemIndex={this.props.subItemIndex}/>
        )}
      </div>
    )
  }
}