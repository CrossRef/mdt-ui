import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import is from 'prop-types'
import * as api from '../../actions/api'
import * as app from '../../actions/application'
import {routes} from '../../routing'
import Dropzone from 'react-dropzone'
import ValidationItemsContainer from '../BulkUploadModal/validationItemsContainer';

const KEYS_TO_FILTERS = [ 'name']
const mapStateToProps = () => ({})
const mapDispatchToProps = dispatch => bindActionCreators({
  reduxDeletePublication: app.deletePublication
}, dispatch)

@connect(mapStateToProps, mapDispatchToProps)
export default class BulkUpdateModal extends React.Component {

  static propTypes = {    
    ownerPrefix: is.string.isRequired
  }


  state = {
    prefixes: [],
    files: [] ,
    publisherName: '',
    showHelp: false,
    fields:0,
    valid:false
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

  componentDidMount () {
    
  }
  setValidation =(valid)=>{
    this.setState({valid:valid})
  }
  render () {
    const publisherName= this.state.publisherName
    const minHeight=(this.state.fields?40:0) + 326;
    const height=minHeight+(61*this.state.fields)+'px'
    const filesList= this.state.files
    const style={ height: height }
    const isValid=this.state.valid
    console.log("list is:" + filesList)

    const fileArea=filesList&&filesList.length==1?(  <div className="file">
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
                <object type="image/svg+xml" className="uploadIcon" data={`${routes.images}/BulkUpload/cloud-up-lightgrey.svg`}/>
                <div className="dropAreaText">
                  <p className="text">Drop CSV file here.</p>
                  <div><a className="openFile" onClick={()=>dropzoneRef.current.open()}>Browse from folder</a><p></p></div>
                </div>
                </div>
              {fileArea}
              </Dropzone>
            </div>
            <div className="helpArea" onMouseLeave={()=>this.setState({showHelp: false})}>
                <img
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
              isValid={this.setValidation}>
            </ValidationItemsContainer>
          </div>
        <div className="height16"></div>
          <div className="buttons">
            <div className={'deposit '+ (isValid?'':'depositNotReady')} onClick={this.processFile}>Deposit</div>
            <div className="cancel" onClick={this.props.close}>Cancel</div>
          </div>

        </div>
    )
  }
}
