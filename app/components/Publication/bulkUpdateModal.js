import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import is from 'prop-types'
import * as api from '../../actions/api'
import * as app from '../../actions/application'
import {routes} from '../../routing'
import Dropzone from 'react-dropzone'

const KEYS_TO_FILTERS = [ 'name']
const mapStateToProps = () => ({})
const mapDispatchToProps = dispatch => bindActionCreators({
  reduxDeletePublication: app.deletePublication
}, dispatch)

@connect(mapStateToProps, mapDispatchToProps)
export default class BulkUpdateModal extends React.Component {

  static propTypes = {
    publicationTitle: is.string.isRequired,
    pubDoi: is.string.isRequired,
    ownerPrefix: is.string.isRequired,
    reduxDeletePublication: is.func.isRequired
  }


  state = {
    prefixes: [],
    prefixSelection: '',
    publishers: [],
    publisherSelection: '',
    publisherSearchFocus: false,
    prefixSelectionFocus: false,
    publisherName: '',
    showHelp: false
  }


  componentDidMount () {
    
  }



  render () {
    const transferReady = !!this.state.prefixSelection
    const publisherName= this.state.publisherName

    const dropzoneRef = React.createRef()
    return (
        <div className="bulkUpdateContainer">
          <div className="content">
          Metadata Manager accepts the following metadata for bulk updates; funding information, license information, and similarity 
          check full text URLs. Please upload your CSV file.
          <div className="dropContainer">          
  <Dropzone  ref={dropzoneRef}
     onDrop={(accepted, rejected) => { this.setState({ accepted, rejected }) }}
     accept="text/csv, text/plain, text/*,">
      <p>Drop CSV file here.</p>
      <a onClick={()=>dropzoneRef.open()}>open file</a>
  </Dropzone>
  </div>
  <div className="helpArea"
                onMouseLeave={()=>this.setState({showHelp: false})}
              >
                <img
                  onMouseEnter={()=>this.setState({showHelp: true})}
                  className="helpIcon"
                  src={`${routes.images}/AddArticle/Asset_Icons_Grey_Help.svg`}/>
                {this.state.showHelp &&
                  <div className="helpBubble">
                    <p>Transfering title to a new owner</p>
                    View the <a href="https://support.crossref.org/hc/en-us/articles/213022466-Transferring-titles-and-identifiers-to-a-new-owner" target="_blank" >Support page</a> for more information
                  </div>}
              </div>
              <p className="sectionTitle">From</p>
              <p>From publisher</p>
              <div className="fromBar">{publisherName}</div>
              <br/>
              <p>From DOI prefix</p>
              <div className="fromBar">{this.props.ownerPrefix}</div>


            <div className="center">
              <img src={`${routes.images}/Publications/right_carrot_teal.svg`}/>
            </div>

            <div className="toContainer">
              <div className="helpArea"
                onMouseLeave={()=>this.setState({showHelp: false})}
              >
                <img
                  onMouseEnter={()=>this.setState({showHelp: true})}
                  className="helpIcon"
                  src={`${routes.images}/AddArticle/Asset_Icons_Grey_Help.svg`}/>
                {this.state.showHelp &&
                  <div className="helpBubble">
                    <p>Transfering title to a new owner</p>
                    View the <a href="https://support.crossref.org/hc/en-us/articles/213022466-Transferring-titles-and-identifiers-to-a-new-owner" target="_blank" >Support page</a> for more information
                  </div>}
              </div>

             
            </div>
          </div>

          <div className="buttons">
            <div
              className={`transfer ${!transferReady ? 'transferNotReady' : ''}`}
              onClick={transferReady ? this.transferConfirmModal : null}
            >
              Transfer
            </div>
            <div className="cancel" onClick={this.props.close}>Cancel</div>
          </div>

        </div>
    )
  }
}
