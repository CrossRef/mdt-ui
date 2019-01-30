import React, { Component } from 'react'
import is from 'prop-types'
import csv from 'csvtojson'
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
export default class ValidationItem extends Component {

    static propTypes = {
        index:is.number.isRequired,
        headers:is.array
      }

    constructor (props) {
      super(props); 
      this.state={errorMessages : [],
                  focusedInput : '' }
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


  render () {
    const index = this.props.index
    const fileColumnVal=this.props.headers[index]
    const options=[{"value":"vor", "name":"Version of record"}, {"value":fileColumnVal,"name": fileColumnVal}]

    return (
      <div className="headerColumn">
        <FormSelect
            label={"Header Column "+String.fromCharCode(65+index)}
            required={true}
            error={false}
            name={fileColumnVal}
            value={fileColumnVal}
            changeHandler={this.handleContributor}
            options= {options}
            //disabled={this.state.personDisabled}
            errorUtility={this.errorUtility}
            //indicatorErrors={['contributorRole']}
            //allErrors={errors}
            subItemIndex={index.toString(10)}
            tooltip={this.props.tooltip && tooltips.role}
            tooltipUtility={this.tooltipUtility}
            onSelect={this.props.validate}/>
            
           
      </div>                    
    //     {this.state.showSection &&
    //        <div className='body'>                     
      //      </div>
        //  }

      )
  }

}