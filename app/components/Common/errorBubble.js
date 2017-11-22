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

    //Clicking a subItem indicator sets errorMessages to all errors active in that subItem, so this
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