import React, { Component } from 'react'
import is from 'prop-types'
import csv from 'csvtojson'
import ValidationItem from './validationItem'
import FormSelect from '../Common/formSelect'
import {routes} from '../../routing'
import fs, { read } from 'fs'
import { isObject } from 'util';
/*
class ValidationField extends Component {
  static propTypes = {
    columns: is.array
  }

  render() {
    const columns = this.props.columns
    const rows = []
    if (columns){     
        columns.forEach((column) => {
          rows.push()

        }    
    }
  );
    return (
      <select>
        {rows}
      </select> 
    )
  }
}*/
export default class ValidationItemsContainer extends Component {

    static propTypes = {
        files: is.arrayOf(is.object),
        fieldHandler: is.func
      }

    constructor (props) {
        super()
        this.state = {
          valItems:[]
        }
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
      if(nextProps.files !=this.props.files) {
        this.handleReadFiles()
      }
    }
    createSelects = (jsonObj)=>{

    }

    handleReadFiles = ()=> {
      //oFiles = document.getElementById("uploadInput").files,
      //nFiles = oFiles.length;
      const {fieldsHandler,files}=this.props

      if (files){
        var msg="Recieved " + files.length ;
        if (files.length>0){
          msg+=" first file size:" + files[0].size + " name: "+files[0].name

          var reader = new FileReader()
          reader.onload = () =>{
            console.log("reader onload converting to csv")
            csv().fromString(reader.result).then((jsonObj)=>
            {
              
              var headers=[]
              for (var key in jsonObj[0]) {
                headers.push(key)
                
              }
              this.setState({headers:headers})
              console.log(headers)
              //console.log(jsonObj)
              if (fieldsHandler){
                fieldsHandler(headers.length)
              }
            })
          }
          reader.readAsText(files[0])

          
          //reader.readAsText(file[0])
          //csv.fs.createReadStream(files[0])

          console.log(msg)
        
        }
      }

    }
  render () {
    const options=[{"value":"vor", "name":"Version of record"}];
    var items = this.state.headers?  this.state.headers.map((data, i)=>
      <ValidationItem
        index={i}    
        headers={this.state.headers}
        errorMessages={this.props.errorMessages}
        errorUtility={this.errorUtility}
        allErrors={this.errors}
        key={i}
        tooltip={this.showHelper}
        tooltipUtility={this.tooltipUtility} />
    ):null
    if (items){
      items.unshift(<div className="headerMessage">Fix header errors to complete CSV upload.</div>)
      items.push(<div className="vertspacer"/>)
    }
    return (
        <div className='validationFieldsInner'>          
          <div className='topbar'>
             <div className='titleholder'>             
             </div>            
          </div>
        {items}

        </div>
    //     {this.state.showSection &&
    //        <div className='body'>                     
      //      </div>
        //  }

      )
  }

}