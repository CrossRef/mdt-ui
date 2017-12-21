import React from 'react'
import is from 'prop-types'



export default class ErrorMessage extends React.Component {

  static propTypes = {
    errorMessage: is.string.isRequired,
    errorMessageHandler: is.func.isRequired
  }

  componentDidMount () {
    document.addEventListener('click', this.handleClick)
  }


  handleClick = (e) => {
    if(!this.node.contains(e.target)) {
      this.props.errorMessageHandler('')
    }
  }


  componentWillUnmount () {
    document.removeEventListener('click', this.handleClick)
  }


  render () {
    const errorArray = this.props.errorMessage.split('Error: ').map( (error, i) =>
      <div key={i} className="singleError">{error}</div>
    )
    errorArray.shift() //Removes first item created by the first 'Error: '
    const numberOfErrors = errorArray.length

    errorArray.push(<div key='whiteSpace' className="whiteSpace">&nbsp;</div>)

    return (
      <div className="errorContainer">
        <div className='errorMessage' ref={node => this.node = node}>
          <p>Deposit Errors ({numberOfErrors})</p>
          <div className="scrollBox">{errorArray}</div>
        </div>
      </div>
    )
  }
}
