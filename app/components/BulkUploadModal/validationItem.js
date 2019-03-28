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
        headers:is.array
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
    this.checkHeader()
  }
}
componentDidMount(){
  this.checkHeader()
}
checkHeader =() =>{  
  const index = this.props.index
  const fileColumnVal=this.props.headers[index]

  if (!fileColumnVal){
    this.setState({isValid : true})
    return
  }
  if (index===0){
    this.setState({isValid:bulkUploadColumns[fileColumnVal.toLowerCase()] })
    return 
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
              this.setState({isValid:false})
              return
            }
            if (count>5){
              attributeName=m[5]
              attributeValue=m[6]
              var validationItem3=validationStruct[attributeName]
              
              if (!validationItem3 || validationItem3.indexOf(attributeValue)<0){
                this.setState({isValid:false})
                return
              }
            }
          }  else{
            this.setState({isValid:false})
          }
        }
        this.setState({isValid:true})
      } else{
        this.setState({isValid:false})
      }
    }
  }else{
    this.setState({isValid:false})
  }
  
}
setSelected =(option) =>{
  if (option){
    this.setState({selected:{value:option.value}})
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

    const click =  {onClick:this.toggleMenu}
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