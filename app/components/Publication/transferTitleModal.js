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
    prefixSelectionFocus: false
  }


  componentDidMount () {
    api.getPublishers().then( response => {
      this.setState({
        prefixes: response,
        prefixSelection: response[0].prefix,
        publishers: response[0].publishers
      })
    })
  }


  renderPublicationsList = () => {
    if(
        !this.state.prefixes.length ||
        !this.state.publisherSearchFocus
    ) {
      return null
    }
    const results = this.state.publisherSelection
        ? this.state.publishers.filter( publisher => publisher.indexOf(this.state.publisherSelection) !== -1 )
        : this.state.publishers
    return results.length
      ? <div className="list publicationsList">
          {results.map( result =>
            <div
              key={result}
              className="listItem"
              onClick={()=>this.setState({publisherSelection: result, publisherSearchFocus: false})}
            >
              {result}
            </div>
          )}
        </div>

      : null
  }


  renderPrefixList = () => {
    return this.state.prefixSelectionFocus
      ? <div className="list prefixesList">
          {this.state.prefixes.map( result =>
            <div
              key={result.prefix}
              className="listItem"
              onClick={()=>{
                this.setState({
                  prefixSelection: result.prefix,
                  prefixSelectionFocus: false,
                  publisherSelection: '',
                  publishers: this.state.prefixes.find( item => item.prefix === result.prefix).publishers
                })
              }}
            >
              {result.prefix}
            </div>
          )}
        </div>
      : null
  }


  transferConfirmModal = () => {
    const confirmTransfer = () => {
      //TODO: need an api request to transfer publication

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
    const transferReady = this.state.publishers.find(publisher => publisher === this.state.publicationSelection)

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
                  {this.state.prefixSelection}</div>
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
