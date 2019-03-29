import React, { Component } from 'react'
import is from 'prop-types'
import bulkUploadColumns from './bulkUploadColumns'
import CascadingMenu from './cascadingMenu'
import XRegExp  from 'xregexp'
import menuShape from './bulkUploadMenus'

export default class ValidationItem extends Component {
  container=React.createRef()
    static propTypes = {
        index:is.number.isRequired,
        headers:is.array,
        isValid:is.func.isRequired
      }

    constructor (props) {
      super(props); 
      this.state={errorMessages : [],
                  focusedInput : '',
                  isValid : true ,
                 menuOpen:false,
                 selected:{value:this.props.headers[props.index]}}
    }
  
  
  errorUtility = {
    errorIndicators: [],

    activeIndicator: -1,

    openingSubItem: false,
    subItemIndex: "0",

    stickyErrorMounted: false,

    saveRef: (activeErrors, indicatorErrors, node, subItem, subItemIndex, openSubItem) => {
      if(node){
        this.errorUtility.errorIndicators.push({
          activeErrors,
          indicatorErrors,
          node,
          subItem,
          subItemIndex,
          openSubItem
        })

        if(node.id === 'errorBubble') {
          this.errorUtility.activeIndicator = this.errorUtility.errorIndicators.length - 1
        }
      }
    },

    setErrorMessages: (setErrors, allErrors = this.state.errors) => {
      const filteredErrorMessage = setErrors.filter((error)=>{
        return allErrors[error]
      })

      this.setState({errorMessages: filteredErrorMessage})
    },

    onValidate: (newValidationErrors, contributors, funding, license, relatedItems, newReduxForm) => {
      if(!this.state.errorMessages.length) {
        return []
      }

      const {errorIndicators, activeIndicator} = this.errorUtility
      const activeIndicatorObj = errorIndicators[activeIndicator]
      const trackedIndicatorErrors = activeIndicatorObj ? activeIndicatorObj.indicatorErrors : []

      let newErrorMessages
      const {subItem, subItemIndex} = activeIndicatorObj || {}

      if(subItem) {
        const subItemErrors = {
          contributor: contributors,
          funding: funding,
          license: license,
          relatedItems: relatedItems,
        }

        let allErrors
        if(cardNamesArray.indexOf(subItem) > -1) {
          //Is crossmark subItem
          allErrors = newReduxForm.getIn([subItem, subItemIndex, 'errors'])

        } else {
          allErrors = subItemErrors[subItem][subItemIndex].errors
        }

        newErrorMessages = this.state.errorMessages.filter((error) => {
          return allErrors[error]
        })

        if(!newErrorMessages.length) {
          newErrorMessages = trackedIndicatorErrors.filter((error) => {
            return allErrors[error]
          })
        }


      } else {
        newErrorMessages = this.state.errorMessages.filter((error) => {
          return newValidationErrors[error]
        })

        if(!newErrorMessages.length) {
          newErrorMessages = trackedIndicatorErrors.filter((error)=>{
            return newValidationErrors[error]
          })
        }

        this.errorUtility.subItemIndex = "0"
      }

      if(!newErrorMessages.length) {
        const indicatorBelow = errorIndicators[activeIndicator + 1]
        const indicatorAbove = errorIndicators[activeIndicator - 1]

        if(indicatorBelow) {
          newErrorMessages = indicatorBelow.activeErrors
          this.errorUtility.subItemIndex = indicatorBelow.subItemIndex || "0"
        } else if(indicatorAbove) {
          newErrorMessages = indicatorAbove.activeErrors
          this.errorUtility.subItemIndex = indicatorAbove.subItemIndex || "0"
        }
      }

      return newErrorMessages
    },

    assignStickyErrorRefresh: (func) => {
      this.errorUtility.stickyErrorMounted = true
      this.errorUtility.refreshTask = func
    },

    refreshStickyError: () => {
      if(this.errorUtility.stickyErrorMounted && typeof this.errorUtility.refreshTask === 'function') {
        return finishUpdate().then(()=>this.errorUtility.refreshTask())
      }
    }
  }


      tooltipUtility = {

        getFocusedInput: () => this.state.focusedInput,
    
        tooltipMounted: false,
    
        assignRefreshTask: (func) => {
          this.tooltipUtility.tooltipMounted = true
          this.tooltipUtility.refreshTask = func
        },
    
        refresh: (param) => {
          if(
            this.tooltipUtility.tooltipMounted &&
            typeof this.tooltipUtility.refreshTask === 'function'
          ) {
            return finishUpdate().then(()=>this.tooltipUtility.refreshTask(param))
          }
        },
    
        assignFocus: (inputId, tooltip) => {
          this.setState({focusedInput: inputId})
          return this.tooltipUtility.refresh(tooltip)
        }
      }

      handleContributor = (e) => {
        var contributor = {
          ...this.props.contributor,
          [e.target.name]: e.target.value
        }
    
        this.props.handler({
          contributors: update(this.props.data, {[this.props.index]: {$set: contributor }})
        })
      }

componentDidUpdate (nextProps) {
  if(nextProps.headers !=this.props.headers) {
    this.setState({isValid:this.checkHeader(option.value)},() => {this.props.isValid(this.state.isValid)})
    // this.checkHeader()
    // this.props.isValid(this.state.isValid)
  }
}
componentDidMount(){
  this.setState({isValid:this.checkHeader()},() => {this.props.isValid(this.state.isValid)})
  
}
checkHeader (fileColumnVal=this.state.selected.value) {  
  const index = this.props.index
  if (!fileColumnVal){    
    return true
  }
  if (index===0){
    return bulkUploadColumns[fileColumnVal.toLowerCase()] 
  }
  const col = XRegExp('^\\s*<\\s*([^\\s]+)\\s*(([^\\s]+)="(.+?)")?\\s*(([^\\s]+)="(.+?)")?\\s*>\\s*$','ism');

  let m;

  if ((m = col.exec(fileColumnVal)) !== null) {
    console.log (m)
    // The result can be accessed through the `m`-variable.
    var count=0
    //console.log(`column header has ${m.length} with: ${m}`)
    m.forEach((match, groupIndex) => {
      if (match)
      {
        count++        
      } })
    if (count>0){
      //console.log(`Found ${count} matches, element: ${m[1]}`)
      var mainElement=m[1]
      // <resource content_version="vpr" mime_type="application/html">
      var validationStruct = bulkUploadColumns[mainElement]      
      if ( validationStruct ){
        if (count>2 ){
          var attributeName=m[3]
          var attributeValue=m[4]

          var validationItem2=validationStruct[attributeName]

          if (validationItem2){
            if (validationItem2.indexOf(attributeValue)<0){
              
              return false
            }
            if (count>5){
              attributeName=m[6]
              attributeValue=m[7]
              var validationItem3=validationStruct[attributeName]
              
              if (!validationItem3 || validationItem3.indexOf(attributeValue)<0){
                
                return false
              }
            }
          }  else{
            return false
          }
        }
        return true
      } else{
        return false
      }
    }
  }else{
    return false
  }
  
}
setSelected =(option) =>{
  if (option){
    this.setState({selected:{value:option.value}, isValid:this.checkHeader(option.value)},() => {this.props.isValid(this.state.isValid)})
     // state doesn't actually change until all state operations are done
                                  // so have to pass the value to the checker.
  }
}
toggleMenu = () => {
  this.setState({menuOpen: !this.state.menuOpen})
}
closeMenu=()=>{
    this.setState({menuOpen:false})   
}

  render () {
    const index = this.props.index
    var isError=!this.state.isValid
    const headerErrorMsg = "Header error. Select correct header from dropdown list"
    const hideIt = {visibility:isError?'visible':'hidden'}
    
    return (
      <div className="headerColumn " >
              <div className='labelholder'>
          <div className='labelinnerholder'>
            <div className='label'>{"Header Column "+String.fromCharCode(65+index)}</div>
          </div>
        </div>
        <div className='field' onClick={this.toggleMenu} ref={this.container} >
            <input
              className={`height32  ${isError ? 'fieldError' : ''} `}
              type='text'
              
              value={this.state.selected.value}
              readOnly
            />                
          {this.state.menuOpen &&
            <CascadingMenu
              options={menuShape}
              closeMenu={this.closeMenu}
              selectedItem={this.setSelected}
              container = {this.container}
          />}
        </div>
        <span className="tooltiptext" style={hideIt}>{headerErrorMsg}</span>
      </div>                    
      )
  }

}