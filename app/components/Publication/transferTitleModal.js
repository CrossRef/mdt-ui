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
    publicationSelection: '',
    publicationSearchFocus: false,
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
        !this.state.publicationSelection ||
        !this.state.publicationSearchFocus
    ) {
      return null
    }
    const results = this.state.publishers.filter( publisher => publisher.indexOf(this.state.publicationSelection) !== -1 )
    return results.length
      ? <div className="list publicationsList">
          {results.map( result =>
            <div
              key={result}
              className="listItem"
              onClick={()=>this.setState({publicationSelection: result, publicationSearchFocus: false})}
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


  transfer = () => {
    //need an api request to transfer publication

    this.props.reduxDeletePublication(this.props.pubDoi)
    this.props.close()
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
                    this.setState({publicationSearchFocus: false})
                  }
                }}
              >
                <div className="requiredStar">*</div>
                <input
                  className="toPublisherSearch"
                  onChange={(e) => {
                    this.setState({publicationSelection: e.target.value})
                  }}
                  onFocus={() => this.setState({publicationSearchFocus: true})}
                  value={this.state.publicationSelection}/>
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
              onClick={transferReady ? this.transfer : null}
            >
              Transfer
            </div>
            <div className="cancel" onClick={this.props.close}>Cancel</div>
          </div>

        </div>
    )
  }
}