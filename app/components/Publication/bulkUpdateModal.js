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
    fields:0
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

  render () {
    const publisherName= this.state.publisherName
    const minHeight=(this.state.fields?20:0) + 320;
    const height=minHeight+(51*this.state.fields)+'px'
    const filesList= this.state.files
    const style={
            height: height,
          }
        
    const dropzoneRef = React.createRef()
    return (
        <div className="bulkUpdateContainer" style={style}>
          <div className="content">
            <p className="sectionTitle">Metadata Manager accepts the following metadata for bulk updates; funding information, license information, and similarity 
            check full text URLs. Please upload your CSV file.</p>
            <div className="dropContainer">          
              <Dropzone  ref={dropzoneRef}
              acceptClassName="acceptFile"
              rejectClassName="rejectFile"
                className="dropZone"
                disableClick={true}
                onDrop={(accepted, rejected) => this.acceptFiles(accepted)}
                accept="text/csv, text/plain, text/*,">
                
                <img className="uploadIcon" src={`${routes.images}/App/Asset_Icons_Grey_Check 2.svg`}/>
                <div className="dropAreaText">
                  <p className="text">Drop CSV file here.</p>
                  <div><a className="openFile" onClick={()=>dropzoneRef.current.open()}>Browse from folder</a></div>
                </div>
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
            <ValidationItemsContainer files={filesList}
                            fieldsHandler={this.setFieldCount}>
            </ValidationItemsContainer>
          </div>

          <div className="buttons">
            <div className={`deposit depositNotReady`} onClick={this.processFile}>Deposit</div>
            <div className="cancel" onClick={this.props.close}>Cancel</div>
          </div>

        </div>
    )
  }
}
