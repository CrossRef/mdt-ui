import * as helpers from '../../utilities/helpers'
const {xmldoc, compareDois} = helpers


export default async (rawResult, publications, cart, asyncGetPublications) => {

  let resultArray = rawResult.message
  resultArray = resultArray.map((item) => {
    try {
      const getXML = xmldoc(item.result)
      if(getXML !== undefined) item.result = getXML
      if(item.contains && item.contains.length) {
        const recordArray = item.contains
        recordArray.map((record) => {
          const getXML = xmldoc(record.result)
          if(getXML !== undefined) record.result = getXML
          if(record.contains && record.contains.length) {
            const articleArray = record.contains
            articleArray.map((article) => {
              const getXML = xmldoc(article.result)
              if(getXML !== undefined) article.result = getXML
            })
          }
        })
      }
      return item
    } catch (error) {
      console.error('Error Parsing Deposit result: ' + error)
      return item
    }
  })

  const resultCount = {Success: 0, Failed: 0}
  const resultData = {}
  let depositId = new Set
  const used = {}


  //START ITERATING OVER RESULT ARRAY
  await Promise.all(resultArray.map(async (result) => {

    //START PROCESSING RESULT
    let pubDoi, pubTitle, resultTitle, resultStatus, resultType, resultInfo, parentIssue, resultInCart
    let resultError = {}
    let contains1 = {}
    const resultDoi = result['DOI:'] ? result['DOI:'].toLowerCase() : undefined
    resultType = result.type


    if(resultType === 'issue') {
      pubDoi = cart.find( cartItem => compareDois(cartItem.issueDoi, resultDoi) ).pubDoi

      const normalizedRecords = publications[pubDoi].normalizedRecords ?
        publications[pubDoi].normalizedRecords
        : (await asyncGetPublications(pubDoi))[pubDoi].normalizedRecords

      resultInfo = normalizedRecords.find( record => compareDois(record.doi, resultDoi))
    }


    if(resultType === 'article') {
      resultInCart = true
      resultInfo = cart.find( cartItem => compareDois(cartItem.doi, resultDoi) )

      pubDoi = resultInfo.pubDoi

      const normalizedRecords = publications[pubDoi].normalizedRecords ?
        publications[pubDoi].normalizedRecords
        : (await asyncGetPublications(pubDoi))[pubDoi].normalizedRecords


      //If result is an article not directly under a publication, it must be under an issue. Get parentIssue
      if(!normalizedRecords[resultDoi]) {
        normalizedRecords.find( record => {
          if(record.type === 'issue' && record.contains.find( article => compareDois(article.doi, resultDoi))) {
            parentIssue = record
            return true
          }
        })
      }
    }

    if(resultType === 'Publication') {
      pubDoi = resultDoi
      resultInfo = publications[pubDoi].message
    }


    //Assign data to variables
    pubTitle = (publications[pubDoi] || publications[pubDoi.toLowerCase()]).message.title.title
    resultTitle = helpers.recordTitle(resultType, resultInfo.title)

    if(typeof result.result === 'string') {
      resultStatus = 'Failure'
      resultError.errorMessage = result.result
    } else if (typeof result.result === 'object' && result.result.record_diagnostic) {
      const recordDiagnostic = result.result.record_diagnostic
      resultStatus = (recordDiagnostic[1] || recordDiagnostic)['-status']
      if(resultStatus === 'Failure') {
        resultError.errorMessage = (recordDiagnostic[1] || recordDiagnostic).msg
      }
    } else {
      resultStatus = 'Failure'
      resultError.errorMessage = 'Unknown Error'
    }

    if(resultStatus === 'Failure') {
      resultStatus = 'Failed'
    }

    if (resultInCart && !used[resultInfo.doi]) {
      resultCount[resultStatus]++
      used[resultInfo.doi] = true
    }

    let thisResult = {
      title: resultTitle,
      status:resultStatus,
      type:resultType,
      doi: resultDoi,
      pubDoi: pubDoi,
      submissionId: result.submissionid,
      contains: {},
      ...resultError
    }

    //START PROCESSING RECORD UNDER RESULT
    //Check contains for records and assign data
    if(result.contains && result.contains.length) {
      await Promise.all(result.contains.map( async (record) => {
        let recordTitle, recordStatus, recordType, recordInfo, recordInCart
        let recordError = {}
        let contains2 = {}
        let issueId = resultType === 'issue' ? resultDoi : undefined
        const recordDoi = record['DOI:']
        recordType = record.type

        if(recordType === 'article') {
          recordInfo = cart.find( cartItem => compareDois(cartItem.doi, recordDoi) )

          if(!issueId && recordInfo.issueTitle) {
            issueId = JSON.stringify(recordInfo.issueTitle)
            const normalizedRecords = publications[pubDoi].normalizedRecords ?
              publications[pubDoi].normalizedRecords
              : (await asyncGetPublications(pubDoi))[pubDoi].normalizedRecords

            parentIssue = normalizedRecords[issueId]
          }

          recordInCart = true
        }

        if(recordType === 'issue') {
          const normalizedRecords = publications[pubDoi].normalizedRecords ?
            publications[pubDoi].normalizedRecords
            : (await asyncGetPublications(pubDoi))[pubDoi].normalizedRecords

          recordInfo = normalizedRecords[recordDoi.toLowerCase()]
        }


        //Assign data to vars
        recordTitle = helpers.recordTitle(recordType, recordInfo.title)

        if(typeof record.result === 'string') {
          recordStatus = 'Failure'
          recordError.errorMessage = record.result
        } else if (typeof record.result === 'object' && record.result.record_diagnostic) {
          const recordDiagnostic = record.result.record_diagnostic
          recordStatus = (recordDiagnostic[1] || recordDiagnostic)['-status']
          if(recordStatus === 'Failure') {
            recordError.errorMessage = (recordDiagnostic[1] || recordDiagnostic).msg
          }
        } else {
          recordStatus = 'Failure'
          recordError.errorMessage = 'Unknown Error'
        }

        if(recordStatus === 'Failure') {
          recordStatus = 'Failed'
        }

        if (recordInCart && !used[recordInfo.doi]) {
          resultCount[recordStatus]++
          used[recordInfo.doi] = true
        }



        //START PROCESSING ARTICLEUNDERISSUE
        //Check record for contains, if found, must be articlesUnderIssue, assign data to vars
        if(record.contains && record.contains.length) {
          const issueDoi = recordDoi
          record.contains.forEach((article, index)=>{
            let articleTitle, articleStatus, articleInfo
            let articleError = {}
            const articleDoi = article['DOI:']
            articleInfo = cart.find( cartItem => compareDois(cartItem.doi, articleDoi) )

            articleTitle = articleInfo.title.title

            if(typeof article.result === 'string') {
              articleStatus = 'Failure'
              articleError.errorMessage = result.result
            } else if (typeof article.result === 'object' && article.result.record_diagnostic) {
              const recordDiagnostic = article.result.record_diagnostic
              articleStatus = (recordDiagnostic[1] || recordDiagnostic)['-status']
              if(articleStatus === 'Failure') {
                articleError.errorMessage = (recordDiagnostic[1] || recordDiagnostic).msg
              }
            } else {
              articleStatus = 'Failure'
              articleError.errorMessage = 'Unknown Error'
            }

            if(articleStatus === 'Failure') {
              articleStatus = 'Failed'
            }

            resultCount[articleStatus]++

            depositId.add(article.submissionid)

            const articleResult = {
              title: articleTitle,
              status:articleStatus,
              type: 'article',
              doi: articleDoi,
              issueDoi: issueDoi,
              pubDoi: pubDoi,
              submissionId: article.submissionid,
              ...articleError
            }

            contains2[articleDoi] = articleResult

          })
        }
        //FINISHED PROCESSING ARTICLEUNDERISSUE


        //Continue processing record
        depositId.add(record.submissionid)

        const recordResult = {
          title: recordTitle,
          status:recordStatus,
          type: recordType,
          doi: recordDoi,
          pubDoi: pubDoi,
          submissionId: record.submissionid,
          contains: contains2,
          ...recordError
        }

        if(issueId) {
          contains1[issueId] = resultType === 'issue' ?
            {...thisResult, contains: {[recordDoi]: recordResult}}
          :
            {
              title: helpers.recordTitle('issue', parentIssue.title),
              status: 'Undeposited',
              type: 'issue',
              pubDoi,
              contains: {[recordDoi]: recordResult}
            }
        } else {
          contains1[recordDoi] = recordResult
        }
      }))
    }
    //FINISHED PROCESSING RECORD UNDER RESULT



    //Continue processing result
    depositId.add(result.submissionid)



    //BUILD UNDEPOSITED PARENTS FOR ARTICLE
    //If result is an article, the parents didn't get deposited, so have to create a representation of the undeposited parents in resultData
    if (resultType === 'article') {
      const issueId = parentIssue ? (parentIssue.doi || JSON.stringify(parentIssue.title)) : undefined

      let newContains = parentIssue ? {
        [issueId]: {
          title: helpers.recordTitle('issue', parentIssue.title),
          status: 'Undeposited',
          type: 'issue',
          doi: parentIssue.doi,
          pubDoi: pubDoi,
          submissionId: result.submissionid,
          contains: {[resultDoi]: thisResult}
        }
      }
        : { [resultDoi]: thisResult }

      //Check if parent publication and parentIssue was already created by another deposit and merge the newContains with their contains
      if(!resultData[pubTitle]) {
        resultData[pubTitle] = {
          title: pubTitle,
          status: 'Undeposited',
          type: 'Publication',
          doi: pubDoi,
          pubDoi: pubDoi,
          contains: newContains,
        }
      } else {
        if(parentIssue) {
          if(resultData[pubTitle].contains[issueId]) {
            resultData[pubTitle].contains[issueId].contains = {
              ...resultData[pubTitle].contains[issueId].contains,
              [resultDoi]: thisResult
            }
          } else {
            resultData[pubTitle].contains[issueId] = newContains[issueId]
          }
        } else {
          resultData[pubTitle].contains[resultDoi] = thisResult
        }
      }
    //END BUILDING UNDEPOSITED PARENTS



    //Result is a publication or issue
    } else {

      if(resultData[pubTitle]) {
        const savedContains = resultData[pubTitle].contains

        for(let record in contains1) {
          if(savedContains[record]) {
            savedContains[record].contains = {...savedContains[record].contains, ...contains1[record].contains}

          } else {
            savedContains[record] = contains1[record]
          }
        }

      } else {
        resultData[pubTitle] = {
          title: pubTitle,
          status: resultType === 'Publication' ? resultStatus : 'Undeposited',
          type: 'Publication',
          doi: pubDoi,
          pubDoi: pubDoi,
          contains: contains1,
          ...(resultType === 'Publication' ? resultError : {})
        }
      }
    }
    //FINISHED PROCESSING RESULT


  }))
  //FINISHED ITERATING OVER RESULT ARRAY

  depositId = Array.from(depositId)
  depositId = depositId.length > 1 ? `${depositId[0]} - ${depositId.pop()}` : depositId[0]

  return {resultData, resultCount, depositId}
}

