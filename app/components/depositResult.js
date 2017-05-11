import React, {Component} from 'react'
import is from 'prop-types'
import moment from 'moment'

export default function ({resultCount, resultData}) {
  return (
    <div>
      <div className='resultDiv'>
        <div className="resultTopbar">
          <h3>Your deposit has been processed</h3>
          <h3>Deposit ID ......</h3>
          <p>{moment().format(`MM/DD/YYYY hh:mm A`)}</p>
        </div>
        <div className="resultIndicatorBar">
          <div className="leftIndicator">
            <img className='leftImage' src='/images/Deposit/Asset_Icons_Deposit_Deposit Accepted.svg' />
            <div className="leftMessage">
              <h3>Accepted Deposits</h3>
              <h3>{resultCount.Success}</h3>
            </div>
          </div>
          <div className="rightIndicator">
            <img className='rightImage' src='/images/Deposit/Asset_Icons_Deposit_Deposit Failed.svg' />
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

        {renderResults(resultData)}

      </div>
    </div>
  )
}


const renderResults = (resultData) => {
  const resultArray = [];
  for (var pub in resultData) {
    const articleElements = resultData[pub].map((article, index)=> {
      return (
        <div className={article.errorMessage ? 'articleBar errorBorder' : 'articleBar'} key={index}>
          <p className="articleTitle">{article.title}</p>
          <div className="articleResult">
            <p className="articleResult">{article.status}</p>
            <div className={article.errorMessage ? 'errorBox' : 'emptyBox'}>
              <ErrorBox errorMessage={article.errorMessage}/>
            </div>
          </div>

          <div></div>
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
  return resultArray;
}


class ErrorBox extends Component {
  state = {errorBoxShow: false}

  render() {
    return (
      <ul><li onClick={()=>{this.setState({ errorBoxShow:!this.state.errorBoxShow })}}><a className="tooltips">
        {this.state.errorBoxShow && <div><img src="/images/AddArticle/Asset_Icons_White_Caution.svg"/><p>{this.props.errorMessage}</p></div>}
        <img src="/images/AddArticle/Asset_Icons_White_Caution.svg"/>
      </a></li></ul>
    )
  }
}