import React, { Component } from 'react'
import is from 'prop-types'
import csv from 'csvtojson'
import ValidationItem from './validationItem'

export default class ValidationItemsContainer extends Component {

  static propTypes = {
    files: is.arrayOf(is.object),
    fieldHandler: is.func,
    isValid:is.func.isRequired
  }
  state = {
    headers:[]
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
        reader.onload = () => {
          console.log("reader onload converting to csv")
          csv().fromString(reader.result).then((jsonObj)=>
          {
            var headers=[]
            var headerValid=[]
            for (var key in jsonObj[0]) {
              headers.push(key)
              headerValid.push(false)
            }
            this.setState({headers:headers,
                            headerValid:headerValid
                          })
            console.log(headers)
            //console.log(jsonObj)
            if (fieldsHandler){
              fieldsHandler(headers.length)
            }
          })
        }
        reader.readAsText(files[0])
        //csv.fs.createReadStream(files[0])
        console.log(msg)
      }
      else {
        if (fieldsHandler) {
          fieldsHandler(0)
          this.setState({headers:[]})
        }
      }
    }
  }

  createModifiedObject(){
    var modified=this.state.headers.map(row=>{
    })
  }
  handleFieldChange(index, value) {
    if (this.state){
      const newHeaders = [...this.state.headers];
      newHeaders[index]=value
      this.setState({headers:newHeaders
      })
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
    var items = this.state.headers?  this.state.headers.map((data, i)=>
      <ValidationItem
        index={i}    
        value={this.state.headers[i]}
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