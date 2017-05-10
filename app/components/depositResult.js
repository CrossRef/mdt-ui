import React, {Component} from 'react'
import is from 'prop-types'

export default function ({resultCount, resultData}) {
  return (
    <div>
      <div className='resultDiv'>
        <div className="resultTopbar">
          <h3>Your deposit has been processed</h3>
          <h3>Deposit ID ......</h3>
          <p>08/05/2016 12:45</p>
        </div>
        <div className="resultIndicatorBar">
          <div className="leftIndicator">
            <img className='leftImage' src='/images/Deposit/Asset_Icons_Deposit_Deposit Accepted.svg' />
            <div className="leftMessage">
              <h3>Accepted Deposits</h3>
              <h3>{resultCount.success}</h3>
            </div>
          </div>
          <div className="rightIndicator">
            <img className='rightImage' src='/images/Deposit/Asset_Icons_Deposit_Deposit Failed.svg' />
            <div className="rightMessage">
              <h3>Failed Deposits</h3>
              <h3>{resultCount.failed}</h3>
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
        <div className='articleBar' key={index}>
          <p className="articleTitle">{article.title}</p>
          <p className="articleResult">{article.status}</p>
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
