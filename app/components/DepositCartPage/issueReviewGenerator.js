import React from 'react'

import parseXMLIssue from '../../utilities/parseXMLIssue'



const issueReviewGenerator = function (publication, issue) {
    const reviewData = parseXMLIssue(issue)

    const getdate = (pubDate) => {
        var parseDate = []
        for (var i = 0; i < pubDate.length; i++) {
            if (pubDate[i].length > 0) {
                parseDate.push(pubDate[i])
            }
        }

        return parseDate.join(' - ')
    }

    return (
        <div className='ReviewArticleCard'>
            <div>
                <div className='reviewArticle'>
                    <div className='firstBorder'>
                        <div className='innerBorder'></div>
                    </div>
                    <div className='secondBorder'>
                        <div className='innerBorder'></div>
                    </div>
                        <div className='reviewContent'>
                        {reviewData.issue.issue ? <p>Issue: {(reviewData.issue.issue ? reviewData.issue.issue : '')}</p> : ''}
                        {reviewData.issue.volume ? <p>Volume: {(reviewData.issue.volume ? reviewData.issue.volume : '')}</p> : ''}
                        {reviewData.issue.issueDoi ? <p>Issue DOI: {(reviewData.issue.issueDoi ? reviewData.issue.issueDoi : '')}</p> : ''}
                        {
                            getdate([reviewData.issue.printDateYear, reviewData.issue.printDateMonth, reviewData.issue.printDateDay]).length > 0 ?
                            <p>Publication print date: {getdate([reviewData.issue.printDateYear, reviewData.issue.printDateMonth, reviewData.issue.printDateDay])}</p> :
                            ''
                        }
                        {
                            getdate([reviewData.issue.onlineDateYear, reviewData.issue.onlineDateMonth, reviewData.issue.onlineDateDay]).length > 0 ?
                            <p>Publication online date: {getdate([reviewData.issue.onlineDateYear, reviewData.issue.onlineDateMonth, reviewData.issue.onlineDateDay])}</p> :
                            ''
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default issueReviewGenerator