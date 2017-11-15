import React from 'react'
import ReactDOM from 'react-dom'
import is from 'prop-types'

import ErrorBubble from './errorBubble'





export class ErrorBar extends React.Component {
  static propTypes = {
    errors: is.object.isRequired
  }


  state={
    errorBubblePosition: null
  }


  nodeRefs = {}


  setErrorBubble = (errorHolder) => {
    this.setState((state)=> {
      if(state.errorBubblePosition !== errorHolder) {
        return {errorBubblePosition: errorHolder}
      } else {
        return null
      }
    })
  }


  componentDidMount () {
    const firstActiveErrorHolder = document.getElementsByClassName('errorIndicator')[0].parentElement
    this.setErrorBubble(firstActiveErrorHolder)
  }


  onIndicatorClick = (errorHolder) => {
    this.setErrorBubble(errorHolder)
  }


  render () {
    const errorIndicators = []
    for (let error in this.props.errors) {
      if(this.props.errors[error]) {
        errorIndicators.push(<ErrorIndicator error={error} key={error} onIndicatorClick={this.onIndicatorClick} nodeRefs={this.nodeRefs}/>)
      }
    }

    return (
      <div>
        {errorIndicators}
        <ErrorBubble position={this.state.errorBubblePosition} nodeRefs={this.nodeRefs}/>
      </div>

    )
  }
}


class ErrorIndicator extends React.PureComponent {

  errorHolder = document.querySelector(`.errorHolder.${this.props.error}`)

  onClick = () => {
    this.props.onIndicatorClick(this.errorHolder)
  }

  render() {

    try {
      return ReactDOM.createPortal(
        <div
          className="errorIndicator"
          id={this.props.error}
          ref={(node)=>this.props.nodeRefs[this.props.error] = node}
          onClick={this.onClick}>
        </div>,
        this.errorHolder
      )
    } catch (e) {
      console.error(e)
      return null
    }
  }
}



export class ErrorHolder extends React.PureComponent {
  static propTypes = {
    errors: is.array.isRequired,
    date: is.bool
  }

  render() {
    return (
      <div className={`errorHolder ${this.props.date ? 'dateErrorHolder' : ''} ${this.props.errors.join(' ')}`}/>
    )
  }
}