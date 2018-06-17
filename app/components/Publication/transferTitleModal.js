import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import is from 'prop-types'
import * as api from '../../actions/api'
import * as app from '../../actions/application'
import {getPrefix} from '../../utilities/helpers'
import {routes} from '../../routing'




const mapStateToProps = () => ({})
const mapDispatchToProps = dispatch => bindActionCreators({
  reduxDeletePublication: app.deletePublication
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class TransferTitleModal extends React.Component {

  static propTypes = {
    publicationTitle: is.string.isRequired,
    pubDoi: is.string.isRequired,
    reduxDeletePublication: is.func.isRequired
  }


  state = {
    prefixes: [],
    prefixSelection: '',
    publishers: [],
    publisherSelection: '',
    publisherSearchFocus: false,
    prefixSelectionFocus: false,
    showHelp: false
  }


  componentDidMount () {
    api.getPublishers().then( response => {
      this.setState({
        publishers: response.message
      })
    })
  }


  renderPublicationsList = () => {
    const results = this.state.publisherSelection
      ? this.state.publishers.filter( item => item.publisher.indexOf(this.state.publisherSelection) !== -1)
      : this.state.publishers

    return this.state.publisherSearchFocus && results.length
      ? <div className="list publicationsList">
          {results.map( result =>
              <div
                  key={result.publisher}
                  className="listItem"
                  onClick={()=>{
                    this.setState({
                      publisherSelection: result.publisher,
                      publisherSearchFocus: false,
                      prefixSelection: '',
                      prefixes: result.prefixes
                    })
                  }}
              >
                {result.publisher}
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
      //need an api request to transfer publication

      this.props.reduxDeletePublication(this.props.pubDoi)
    }

    this.props.reduxControlModal({
      title: "Confirm title transfer",
      style: "warningModal",
      Component: ({publicationTitle, publisherSelection, close, confirm}) =>
          <div className="transferWarningContainer">
            <div className="warningContent">
              <p>Are you sure you want to transfer ownership for the journal {publicationTitle}</p>
              <p>This action will permanently release the title and DOI ownership from you to the acquiring publisher and cannot be undone.</p>
              <p className="toPublisherHeader">Selected title for transfer</p>
              <div className="toPublisher">{publisherSelection}</div>
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
        publisherSelection: this.state.publisherSelection,
        confirm: confirmTransfer
      }
    })
  }


  render () {
    const transferReady = !!this.state.prefixSelection

    return (
        <div className="transferTitleContainer">
          <div className="content">
            <div className="fromContainer">

              <div className="titleBar">
                {this.props.publicationTitle}
              </div>

              <p className="sectionTitle">From</p>
              <p>From publisher</p>
              <div className="fromBar">{this.props.publicationTitle}</div>
              <br/>
              <p>From DOI prefix</p>
              <div className="fromBar">{getPrefix(this.props.pubDoi)}</div>
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
                    <a href="http://www.google.com" target="_blank" >View transfer support page for more help</a>
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
                  value={this.state.publisherSelection}/>
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