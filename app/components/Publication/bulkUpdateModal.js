import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import is from 'prop-types'
import * as app from '../../actions/application'
import * as api from '../../actions/api'
import {routes} from '../../routing'
import Dropzone from 'react-dropzone'
import ValidationItemsContainer from '../BulkUploadModal/validationItemsContainer'
import {handleReadFiles} from '../BulkUploadModal/resourcesXmlGenerator'
const KEYS_TO_FILTERS = [ 'name']
const mapStateToProps = () => ({})
const mapDispatchToProps = dispatch => bindActionCreators({
  reduxDeletePublication: app.deletePublication
}, dispatch)


 class BulkUpdateModal extends React.Component {

  static propTypes = {    
    ownerPrefix: is.string.isRequired
  }


  state = {
    prefixes: [],
    files: [] ,
    publisherName: '',
    showHelp: false,
    fields:0,
    valid:false,
    headers:[]
  }
  setFieldCount = (e) => {
    this.setState({fields:e})
    if (e){
      const top=Math.max(40,40+(180-(e*30)))+'px'
      this.props.setstyles({top:top})
    }
  }

  acceptFiles = (accepted)=>{
    this.setState({files: accepted })
  } 

  setHeaders = (headers)=>{
   this.setState({headers:headers})
  }

  componentDidMount () {
    
  }
  setValidation =(valid)=>{
    this.setState({valid:valid})
  }
  processFile=()=>{
    handleReadFiles(this.state.files,this.state.headers,api.depositResource)
  }
  render () {
    const minHeight=(this.state.fields?40:0) + 326;
    const height=minHeight+(61*this.state.fields)+'px'
    const filesList= this.state.files
    const style={ height: height }
    const headers=this.state.headers
    const fileArea=filesList&&filesList.length===1?(  <div className="file">
        <div className="fileName">{filesList[0].name}</div>
        <div className="removeFile" onClick={()=>this.setState({files:[]}) }>Remove</div>
      </div>
      ):null

    const dropzoneRef = React.createRef()
    return (
        <div className="bulkUpdateContainer" style={style}>
          <div className="content">
            <p className="sectionTitle">Metadata Manager accepts the following metadata for bulk updates; funding information, license information, and Similarity 
            Check full text URLs. Please upload your CSV file.</p>
            <div className="dropContainer">          
              <Dropzone  ref={dropzoneRef}
              acceptClassName="acceptFile"
              rejectClassName="rejectFile"
              //style="display: none;"
                className="dropZone"
                disableClick={true}
                onDrop={(accepted, rejected) => this.acceptFiles(accepted)}
                accept="text/csv, text/plain, text/*,">
                
                <div className="dropArea">
                {// chrome doesn't behave correct with img tag, needed to use object here. 
                }
                <object type="image/svg+xml" aria-label="drop file here" className="uploadIcon" data={`${routes.images}/BulkUpload/cloud-up-lightgrey.svg`}/>
                <div className="dropAreaText">
                  <p className="text">Drop CSV file here.</p>
                  <div><a className="openFile" onClick={()=>dropzoneRef.current.open()}>Browse from folder</a><p></p></div>
                </div>
                </div>
              {fileArea}
              </Dropzone>
            </div>
            <div className="helpArea" onMouseLeave={()=>this.setState({showHelp: false})}>
                <img alt="help"
                  onMouseEnter={()=>this.setState({showHelp: true})}
                  className="helpIcon"
                  src={`${routes.images}/AddArticle/Asset_Icons_Grey_Help.svg`}/>
                {this.state.showHelp &&
                  <div className="helpBubble">
                    <p>Bulk Update</p>
                    <a href="https://support.crossref.org/hc/en-us/articles/215871703-Depositing-funding-and-license-metadata-using-a-csv-file" target="_blank" >Visit Bulk Update support page for more help.</a>
                  </div>}
              </div>
            </div>
          <div className="validationFields">
            <ValidationItemsContainer
              files={filesList}
              fieldsHandler={this.setFieldCount}
              isValid={this.setValidation}
              headers={headers}
              setHeaders={this.setHeaders}>
            </ValidationItemsContainer>
          </div>
        <div className="height16"></div>
          <div className="buttons">
            <div className={'deposit '+ (this.state.valid?'':'depositNotReady')} onClick={this.state.valid?this.processFile:undefined}>Deposit</div>
            <div className="cancel" onClick={this.props.close}>Cancel</div>
          </div>

        </div>
    )
  }
}
export default  connect(mapStateToProps, mapDispatchToProps)(BulkUpdateModal)
