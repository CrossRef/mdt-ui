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
    this.setSelected = this.handleFieldChange.bind(this)
  }


  componentDidUpdate (nextProps) {
    if(nextProps.files !=this.props.files) {
      this.handleReadFiles()
    }
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
        reader.onload = () => {
          console.log("reader onload converting to csv")
          csv({flatKeys:true}).on('header',(header)=>{
            var headerValid = Array.apply(false, Array(header.length))
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

  createModifiedObject(){
    var modified=this.props.headers.map(row=>{
    })
  }
  handleFieldChange(index, value) {
    if (this.props.headers){
      const newHeaders = [...this.props.headers]
      newHeaders[index]=value      
      this.props.setHeaders(newHeaders)
    }
  }

  isValid =(index)=>{
    return(valid)=>{
      this.state.headerValid[index]=valid
      this.props.isValid(this.state.headerValid.every((item)=>item))
    }
  }
  
  render () {
    const options=[{"value":"vor", "name":"Version of record"}];
    var items = this.props.headers?  this.props.headers.map((data, i)=>
      <ValidationItem
        index={i}    
        value={this.props.headers[i]}
        key={i}
        onchange={this.setSelected}
        isValid={this.isValid(i) }/>
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