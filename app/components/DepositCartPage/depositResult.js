import React, {Component} from 'react'
import is from 'prop-types'
import moment from 'moment'
import $ from 'jquery'

import {routes} from '../../routing'
import ErrorBox from './errorBox'


export default class DepositResult extends Component{

  static propTypes = {
    resultCount: is.object.isRequired,
    resultData: is.object.isRequired,
    depositId: is.oneOfType([
      is.string,
      is.array
    ]).isRequired,
  }

  componentWillMount () {
    document.addEventListener('click', this.handleClick, false)
  }

  componentWillUnmount(){
    document.removeEventListener('click', this.handleClick, false)
  }

  handleClick = (e) => {
    const target = $(e.target)
    if(!target.parents('.errorBox').length) {
      if($('.popup').length) {
        this.setState({})
      }
    }
  }

  closeErrors = () => {
    return new Promise(resolve=>{
      this.setState({}, resolve)
    })
  }

  render() {
    const { resultCount, resultData, depositId } = this.props
    const resultArray = []

    for (let pub in resultData) {
      const publication = resultData[pub]
      const publicationUrl = `https://doi.org/${publication.doi}`
      const records = []

      for (let thisRecord in publication.contains) {
        const record = publication.contains[thisRecord]
        const recordUrl = `https://doi.org/${record.doi}`
        const articles = []

        for (let thisArticle in record.contains) {
          const article = record.contains[thisArticle]
          const articleUrl = `https://doi.org/${article.doi}`

          const articleCard =
            <div className={`articleBar white ${article.errorMessage ? 'errorBorder' : 'normalBorder'}`} key={article.doi}>
              <tr className="depositResultRow">
                <td className="articleUnderIssueTitle">{article.title}</td>
                <td className={article.errorMessage ? 'errorResult' : 'articleResult'}>{article.status}</td>
                <td className={article.errorMessage ? 'errorBox' : 'urlBox'}>
                  {!article.errorMessage ? <a target='_blank' href={articleUrl}>{articleUrl}</a>
                    : <ErrorBox errorMessage={article.errorMessage} closeErrors={this.closeErrors}/>}
                </td>
              </tr>
            </div>
          articles.push(articleCard)
        }

        const recordCard =
          <div className={`articleBar ${record.type === 'issue' ? 'issueBar' : ''} ${record.errorMessage ? 'errorBorder' : 'normalBorder'}`} key={record.doi}>
            <tr className="depositResultRow">
              <td className="articleTitle">{record.title}</td>
                {record.type === 'article' && <td className={record.errorMessage ? 'errorResult' : 'articleResult'}>{record.status}</td>}
                {record.type === 'article' &&
                  <td className={record.errorMessage ? 'errorBox' : 'urlBox'}>
                    {!record.errorMessage ? <a target='_blank' href={recordUrl}>{recordUrl}</a>
                      : <ErrorBox type='result' errorMessage={record.errorMessage} closeErrors={this.closeErrors}/>}
                  </td>}
            </tr>
            {articles}
          </div>
        records.push(recordCard)
      }

      const pubCard =
        <div key={publication.doi} className="resultCard">
          <tr className="publicationTitleBar">
            <td className="publicationTitle">{publication.title}</td>
            <td className={'articleResult'}></td>
            <td className={publication.errorMessage ? 'errorBox' : 'urlBox publicationTitleBar'}></td>
          </tr>
          {records}
        </div>
      resultArray.push(pubCard)
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
                <h3>{resultCount.Failed}</h3>
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

