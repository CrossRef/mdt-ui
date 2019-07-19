import React, { Component } from 'react'
import is from 'prop-types'
import csv from 'csvtojson'
import ValidationItem from './validationItem'

export default class ValidationItemsContainer extends Component {

  static propTypes = {
    files: is.arrayOf(is.object),
    fieldHandler: is.func,
    isValid:is.func.isRequired,
    headers: is.arrayOf(is.string),
  //  generateXml:is.func.isRequired,
    setHeaders:is.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state={headerValid : []}
    this.setSelected = this.handleFieldChange.bind(this)
    
  }


  componentDidUpdate (prevProps,prevState) {
    if(prevProps.files !==this.props.files) {
      this.handleReadFiles()
    }
    if(prevProps.headers!==this.props.headers ||prevState.headerValid!==this.state.headerValid ){
      var validinter=this.validateInterHeader()      
      var validevery= this.state.headerValid.every((item)=>item)
      this.props.isValid(validinter && validevery)
    }
  }
  handleReadFiles = ()=> {
    //oFiles = document.getElementById("uploadInput").files,
    //nFiles = oFiles.length;
    const {fieldsHandler,files}=this.props

    if (files){
      var msg="Received " + files.length ;
      if (files.length>0){
        msg+=" first file size:" + files[0].size + " name: "+files[0].name

        var reader = new FileReader()
        reader.onload = () => {
          console.log("reader onload converting to csv")
          csv({flatKeys:true}).on('header',(header)=>{
            var headerValid = Array.apply(null, Array(header.length))
            
            this.setState({headerValid:headerValid})
            this.props.setHeaders(header)
            if (fieldsHandler){
              fieldsHandler(header.length)
            }                        
            console.log(header)
            console.log(headerValid)
          }) // might want to have the reader limit the length, grab first line to get header
          // then read entire file when the process is confirmed. 
            .fromString(reader.result)
        }
        reader.readAsText(files[0])
        //csv.fs.createReadStream(files[0])
        console.log(msg)
      }
      else {
        if (fieldsHandler) {
          fieldsHandler(0)
          this.props.setHeaders([])
        }
      }
    }
  }
  handleFieldChange(index, value) {
    if (this.props.headers){
      const newHeaders = [...this.props.headers]
      newHeaders[index]=value      
      this.props.setHeaders(newHeaders)

    }    
  }
  
  validateInterHeader = (index)=>{
    // make sure headers include required items, no duplicates,
    // no orphan items (award with no funder, start date with no license of that type )
    // if index is provided, return is validation on indexed item
    var curValid=true

    if (this.props.headers && this.props.headers.length){
      console.log(this.props.headers.indexOf('DOI'))
      var fieldCounts=new Map()
      this.props.headers.reduce( (accumulator, currentValue) =>{
        if (!accumulator.get(currentValue)){
          accumulator.set(currentValue,1)
        }else{
          accumulator.set(currentValue,accumulator.get(currentValue)+1)
        }
        return accumulator
      },fieldCounts)

      const hasDupes=!Array.from(fieldCounts.values()).every((val)=>{        
        return val===1})      
      if (hasDupes && index)
      {
        curValid=fieldCounts.get(this.props.headers[index])===1
      }
      console.log("hasDupes:"+hasDupes)
      const hasFunders=this.props.headers.indexOf('<funder_name>')>=0 || this.props.headers.indexOf('<funder_identifier>')>=0 
      const hasVor=this.props.headers.indexOf('<license_ref applies_to="vor">')
      const hasAM=this.props.headers.indexOf('<license_ref applies_to="am">')
      const hasAward=this.props.headers.indexOf('<award_number>')
      const hasVorStart=this.props.headers.indexOf('<vor_lic_start_date>')
      const hasAMStart=this.props.headers.indexOf('<am_lic_start_date>')

      const awardValid=hasAward?hasFunders:true
      console.log("awardValid:" + awardValid)
      const vorValid = hasVorStart ? hasVor : true
      console.log("vorValid:" + vorValid)
      const amValid = hasAMStart ? hasAM : true
      console.log("amValid:" + amValid)

      curValid = (index === hasAward) ? curValid && awardValid : curValid
      curValid = (index === hasVorStart) ? curValid && vorValid : curValid
      curValid = (index === hasAMStart) ? curValid && amValid : curValid

      return index ? curValid : !hasDupes && awardValid && vorValid && amValid
    }
    return true
  }

  isValid = (index) => {
    return (valid) => {
      this.setState((state) => {  //setState takes a function with (state,props) 
        // we're updating one of the items in the array of the state's
        // headerValid item
        if (state.headerValid && state.headerValid.length >= index) {
          var newstate = [...state.headerValid]
          newstate[index] = valid
          return ({
            headerValid : newstate
          })  
        }
      })
    }
  }
  
  render () {
    var items = this.props.headers?  this.props.headers.map((data, i)=>
      <ValidationItem
        index={i}    
        value={this.props.headers[i]}
        key={i}
        onchange={this.setSelected}
        isValid={this.isValid(i)}
        validateAll={this.validateInterHeader} />
    ):null
    if (items && items.length>0){
      items.unshift(<div className="headerMessage" key="headmsg">Fix header errors to complete CSV upload.</div>)
      items.push(<div className="vertspacer" key="spacer"/>)
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