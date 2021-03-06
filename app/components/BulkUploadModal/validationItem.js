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
        value:is.string.isRequired,
        isValid:is.func.isRequired,
        onchange:is.func.isRequired,
        validateAll:is.func.isRequired
      }

    constructor (props) {
      super(props); 
      this.state={errorMessages : [],
                  focusedInput : '',
                  isValid : true ,
                 menuOpen:false
                 }
    }

componentDidUpdate (lastProps) {
  if(lastProps.value !=this.props.value) {
    const amIValid=this.checkHeader(this.props.value) &&  this.props.validateAll( this.props.index)
    // call the passed in isValid once the state is set
    this.setState({isValid:amIValid},() => {this.props.isValid(amIValid)})
    // this.checkHeader()
    // this.props.isValid(this.state.isValid)
  }
}
componentDidMount(){
  this.setState({isValid:this.checkHeader()},() => {this.props.isValid(this.state.isValid)})
  
}
checkHeader (fileColumnVal=this.props.value) {  
  const index = this.props.index
  if (!fileColumnVal){    
    return true
  }
  //bulkUploadColumns contains the valid structure of column values
  // in csv upload first column is supposed to be DOI. 
  // Here we only check that it's a root level item.
  if (index===0){
    return bulkUploadColumns[fileColumnVal.toLowerCase()] 
  }
  const col = XRegExp('^\\s*<\\s*([^\\s]+)\\s*(([^\\s]+)="(.+?)")?\\s*(([^\\s]+)="(.+?)")?\\s*>\\s*$','ism');

  let m;

  if ((m = col.exec(fileColumnVal)) !== null) {
    // The result can be accessed through the `m`-variable.
    var count=0
    m.forEach((match, groupIndex) => {
      if (match)
      {
        count++        
      } })
    if (count>0){      
      var mainElement=m[1]
      // <resource content_version="vor" mime_type="application/html">
      var validationStruct = bulkUploadColumns[mainElement]      
      if ( validationStruct ){
        if (count>2 ){
          var attributeName=m[3]
          var attributeValue=m[4]

          var validationItem2=validationStruct[attributeName]
          // attribute name and value are valid
          if (validationItem2 && validationItem2.indexOf(attributeValue)>=0){
            // more at
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
      }
    }
  }
  return false
}
setSelected =(option) =>{
  if (option){
    // call parent to set value
    this.props.onchange(this.props.index, option.value)
    //this.setState({selected:{value:option.value}, isValid:this.checkHeader(option.value)},() => {this.props.isValid(this.state.isValid)})
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
              
              value={this.props.value}
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