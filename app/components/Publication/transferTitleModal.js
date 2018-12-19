import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import is from 'prop-types'
import * as api from '../../actions/api'
import * as app from '../../actions/application'
import {routes} from '../../routing'
import {errorHandler} from '../../utilities/helpers'


const KEYS_TO_FILTERS = [ 'name']
const mapStateToProps = () => ({})
const mapDispatchToProps = dispatch => bindActionCreators({
  reduxDeletePublication: app.deletePublication
}, dispatch)

const sortPublishers = (pubs) =>{
  var sortedPubs=[];
  for (var i=0;i<pubs.length;i++){
    pubs[i].lowerName = pubs[i].name.toLowerCase();
  }
  pubs.sort(function(a,b){
    if (a.lowerName<b.lowerName){return -1;}
    if (a.lowerName>b.lowerName){return 1;}
    return 0;
  })
  return pubs;
}
@connect(mapStateToProps, mapDispatchToProps)
export default class TransferTitleModal extends React.Component {

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
    api.getPublisherName(this.props.ownerPrefix).then (response =>{
      this.setState({
        publisherName: response.message.name
      })
    })
    api.getPublishers().then( response => {
      this.setState({
        publishers: sortPublishers(response.message)
      })
    })
  }


  renderPublicationsList = () => {
    const results = this.state.publisherSelection.length>0
      ? this.state.publishers.filter( item => item.lowerName.includes(this.state.publisherSelection.toLowerCase()))
      : this.state.publishers

    return this.state.publisherSearchFocus && results.length
      ? <div className="list publicationsList">
          {results.map( result =>
              <div
                  key={result.memberid}
                  className="listItem"
                  onClick={()=>{
                    this.setState({
                      publisherSelection: result,
                      publisherSearchFocus: false,
                      prefixSelection: '',
                      prefixes: result.prefixes
                    })
                  }}
              >
                {result.name}
              </div>
          )}
        </div>
      : null
  }


  renderPrefixList = () => {
    return this.state.prefixSelectionFocus && this.state.prefixes.length
      ? <div className="list prefixesList">
          {this.state.prefixes.map( prefix =>
            <div
              key={prefix}
              className="listItem"
              onClick={()=>{
                this.setState({
                  prefixSelection: prefix,
                  prefixSelectionFocus: false
                })
              }}
            >
              {prefix}
            </div>
          )}
        </div>
      : null
  }


  transferConfirmModal = () => {
    const confirmTransfer = () => {
     var result= api.transferTitle({
        toPublisher: this.state.prefixSelection,
        email: this.state.publisherSelection.email,
        ownerPrefix: this.props.ownerPrefix,
        doi: this.props.pubDoi}).then(()=>{
          this.props.reduxDeletePublication(this.props.pubDoi)}
          ).catch(e=>{
            this.props.close()
          return errorHandler(`Error transfering title  ${e.toString()}`, e)
      })
    }

    this.props.reduxControlModal({
      title: "Confirm title transfer",
      style: "warningModal",
      Component: ({publicationTitle, publisherSelection, close, confirm}) =>
          <div className="transferWarningContainer">
            <div className="warningContent">
              <p>Are you sure you want to transfer ownership for the journal {publicationTitle}?</p>
              <p>This action will permanently release the title and DOI ownership from you to the acquiring publisher and cannot be undone.</p>
              <p>It may take up to 24 hours for this title transfer to be reflected in Metadata Manager.</p>
              <p className="toPublisherHeader">Selected title for transfer</p>
              <div className="toPublisher">{publicationTitle}</div>
            </div>
            <div className="buttons">
              <div
                  className="transferWarning"
                  onClick={confirm}
              >
                Transfer
              </div>
              <div className="cancelWarning" onClick={close}>Cancel</div>
            </div>
          </div>,
      props: {
        publicationTitle: this.props.publicationTitle,
        publisherSelection: this.state.publisherSelection.name,
        confirm: confirmTransfer
      }
    })
  }


  render () {
    const transferReady = !!this.state.prefixSelection
    const publisherName= this.state.publisherName
    return (
        <div className="transferTitleContainer">
        <div className="transferTitleInstruction">
        <p>Upon completing this transfer, the title and all existing title DOIs will be transferred from the "from publisher" to the "destination publisher." 
          If you do not wish to transfer all existing title DOIs, please contact <a href = "mailto:support@crossref.org?subject = Title transfer help">support@crossref.org</a>.</p>
          <p>A courtesy email will be sent to the "destination publisher's" technical contact when the ownership transfer of the existing title DOIs is complete.</p>
        </div>
          <div className="content">
            <div className="fromContainer">

              <div className="titleBar">
                {this.props.publicationTitle}
              </div>

              <p className="sectionTitle">From</p>
              <p>From publisher</p>
              <div className="fromBar">{publisherName}</div>
              <br/>
              <p>From DOI prefix</p>
              <div className="fromBar">{this.props.ownerPrefix}</div>
            </div>

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

              <div className="emptyTitle"/>

              <p className="sectionTitle">Destination</p>
              <p>Publisher (destination)</p>

              <div className="toInput publisherSearch" tabIndex="0"
                onBlur={ e => {
                  if(!e.relatedTarget || !e.relatedTarget.classList.contains('publisherSearch')) {
                    this.setState({publisherSearchFocus: false})
                  }
                }}
              >
                <div className="requiredStar">*</div>
                <input
                  className="toPublisherSearch"
                  onChange={(e) => {
                    this.setState({publisherSelection: e.target.value})
                  }}
                  onFocus={() => this.setState({publisherSearchFocus: true})}
                  value={this.state.publisherSelection.name}/>
                {this.renderPublicationsList()}
              </div>

              <br/>
              <p>DOI prefix (destination)</p>

              <div className="toInput prefixSelect" tabIndex="0"
                onBlur={ e => {
                  if(!e.relatedTarget || !e.relatedTarget.classList.contains('prefixSelect')) {
                    this.setState({prefixSelectionFocus: false})
                  }
                }}
              >
                <div className="requiredStar">*</div>
                <div
                  className="toPrefixSelect"
                  tabIndex="0"
                  onFocus={() => this.setState({prefixSelectionFocus: true})}
                >
                  {this.state.prefixSelection}
                  <img className="selectCarrot" src={`${routes.images}/Publications/select_carrot.svg`} />
                </div>
                {this.renderPrefixList()}
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
