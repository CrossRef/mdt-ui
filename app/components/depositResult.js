import React, {Component} from 'react'
import is from 'prop-types'
import moment from 'moment'

import {routes} from '../routing'


export default class DepositResult extends Component{

  closeErrors = (callback) => { //just need to force an update for all errors to close, then callback will open clicked error
    this.setState({}, callback)
  }

  render() {
    const { resultCount, resultData, depositId } = this.props;
    const resultArray = []

    for (var pub in resultData) {
      const articleElements = resultData[pub].map((article, index)=> {
        return (
          <div className={`articleBar ${article.type === 'issue' ? 'issueBar' : ''} ${article.errorMessage ? 'errorBorder' : 'normalBorder'}`} key={index}>
            <p className="articleTitle">{article.title}</p>
            <div className="articleResult">
              <p className="articleResult">{article.status}</p>
              <div className={article.errorMessage ? 'errorBox' : 'emptyBox'}>
                {!article.errorMessage ? <a target='_blank' href={`http://dx.doi.org/${article.doi}`}>http://dx.doi.org/{article.doi}</a>
                : <ErrorBox errorMessage={article.errorMessage} closeErrors={this.closeErrors}/>}
              </div>
            </div>
          </div>
        )
      });

      const pubCard =
        <div key={pub} className="resultCard">
          <div className="publicationTitleBar"><h3>{pub}</h3></div>
          {articleElements}
        </div>
      resultArray.push(pubCard);
    }

    return (
      <div>
        <div className='resultDiv'>
          <div className="resultTopbar">
            <h3>Your deposit has been processed</h3>
            <h3>Deposit ID {depositId}</h3>
            <p>{moment().format(`MM/DD/YYYY hh:mm A`)}</p>
          </div>
          <div className="resultIndicatorBar">
            <div className="leftIndicator">
              <img className='leftImage' src={`${routes.images}/Deposit/Asset_Icons_Deposit_Deposit Accepted.svg`} />
              <div className="leftMessage">
                <h3>Accepted Deposits</h3>
                <h3>{resultCount.Success}</h3>
              </div>
            </div>
            <div className="rightIndicator">
              <img className='rightImage' src={`${routes.images}/Deposit/Asset_Icons_Deposit_Deposit Failed.svg`} />
              <div className="rightMessage">
                <h3>Failed Deposits</h3>
                <h3>{resultCount.Failure}</h3>
              </div>
            </div>
          </div>
          <div className="titleStatusBar">
            <div className="leftTitle">Title</div>
            <div className="rightStatus">Status</div>
          </div>

          {resultArray}

        </div>
      </div>
    )
  }
}


class ErrorBox extends Component {
  state = {errorBoxShow: false}

  componentWillReceiveProps () {
    this.setState({errorBoxShow: false})
  }

  toggleError = () => {
    if(this.state.errorBoxShow) {this.setState({errorBoxShow: false})}
    else this.props.closeErrors(() => this.setState({errorBoxShow: true}))
  }

  render () {
    return (
      <ul>
        <li onClick={this.toggleError}>
          <a className="tooltips">
            {this.state.errorBoxShow &&
            <div><img src={`${routes.images}/AddArticle/Asset_Icons_White_Caution.svg`}/><p>{this.props.errorMessage}</p></div>}
            <img src={`${routes.images}/AddArticle/Asset_Icons_White_Caution.svg`}/>
          </a>
        </li>
      </ul>
    )
  }
}