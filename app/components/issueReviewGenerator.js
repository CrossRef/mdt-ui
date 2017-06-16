import React, { Component } from 'react'
import _ from 'lodash'

const Languages = require('../utilities/language.json')
import { ArchiveLocations } from '../utilities/archiveLocations'
const PublicationTypes = require('../utilities/publicationTypes.json')
const AppliesTo = require('../utilities/appliesTo.json')
const IdentifierTypes = require('../utilities/identifierTypes.json')
import objectSearch from '../utilities/objectSearch'
import parseXMLIssue from '../utilities/parseXMLIssue'
import xmldoc from '../utilities/xmldoc'

const issueReviewGenerator = function (publication, issue) {
    const publicationMetaData = xmldoc(publication.content)
    const reviewData = parseXMLIssue(issue)

    const getSubmitSubItems = (items) => {
        return _.filter(items, (item) => {
        for(var key in item) { // checking all the properties of errors to see if there is a true
            if(item[key]){
            try {
                if (item[key].trim().length > 0) {
                return item
                }
            } catch (e) {
                if (item[key].length > 0) {
                return item
                }
            }

            }
        }
        })
    }

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
                        <p>Issue: {(reviewData.issue.issue ? reviewData.issue.issue : '')}</p>
                        {reviewData.issue.volume ? <p>Volume: {(reviewData.issue.volume ? reviewData.issue.volume : '')}</p> : ''}
                        {reviewData.issue.issueDoi ? <p>Issue DOI: {(reviewData.issue.issueDoi ? reviewData.issue.issueDoi : '')}</p> : ''}
                        {
                            getdate([reviewData.issue.printDateYear, reviewData.issue.printDateMonth, reviewData.issue.printDateDay]).length > 0 ?
                            <p>Publication Print Date: {getdate([reviewData.issue.printDateYear, reviewData.issue.printDateMonth, reviewData.issue.printDateDay])}</p> :
                            ''
                        }
                        {
                            getdate([reviewData.issue.onlineDateYear, reviewData.issue.onlineDateMonth, reviewData.issue.onlineDateDay]).length > 0 ?
                            <p>Publication Online Date: {getdate([reviewData.issue.onlineDateYear, reviewData.issue.onlineDateMonth, reviewData.issue.onlineDateDay])}</p> :
                            ''
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default issueReviewGenerator