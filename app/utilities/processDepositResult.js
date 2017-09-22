

export default (depositResult, publications, cart) => {
  const resultCount = {Success: 0, Failed: 0}
  const resultData = {}
  let depositId = []

  depositResult.forEach((result, index)=>{
    let pubDoi, pubTitle, resultTitle, resultStatus, resultType, resultInfo, parentIssue
    let error = {}
    let contains1 = {}
    const resultDoi = result['DOI:']

    //If result isn't necessarily a publication, search cart for info, and if not found, search stored publications
    if(!result.contains) {
      resultInfo = cart.find((cartItem)=>{
        return cartItem.doi.toLowerCase() === resultDoi.toLowerCase()
      })
      if( publications[resultInfo.pubDoi] && !publications[resultInfo.pubDoi].normalizedRecords[resultDoi] ) {
        for (let record in publications[resultInfo.pubDoi].normalizedRecords) {
          const thisRecord = publications[resultInfo.pubDoi].normalizedRecords[record]
          if(thisRecord.type === 'issue') {
            for(let article of thisRecord.contains) {
              if(article.doi = resultDoi) {
                parentIssue = thisRecord
                break
              }
            }
          }
        }
      }
    }

    //Identify resultType and assign data to variables accordingly
    resultType = resultInfo ? resultInfo.type : 'publication'
    pubDoi = resultType === 'publication' ? resultDoi : resultInfo.pubDoi
    pubTitle = publications[pubDoi.toLowerCase()].message.title.title
    resultTitle = do {
      if(resultType === 'publication') {
        pubTitle
      } else if (resultType === 'issue') {
        `${resultInfo.title.volume && `Volume ${resultInfo.title.volume}, `}Issue ${resultInfo.title.issue}`
      } else if (resultType === 'article') {
        resultInfo.title.title
      }
    }

    if(typeof result.result === 'string') {
      resultStatus = 'Failure'
      error.errorMessage = result.result
    } else if (typeof result.result === 'object' && result.result.record_diagnostic) {
      const recordDiagnostic = result.result.record_diagnostic
      resultStatus = (recordDiagnostic[1] || recordDiagnostic)['-status']
      if(resultStatus === 'Failure') {
        error.errorMessage = (recordDiagnostic[1] || recordDiagnostic).msg
      }
    } else {
      resultStatus = 'Failure'
      error.errorMessage = 'Unknown Error'
    }

    if(resultStatus === 'Failure') resultStatus = 'Failed'

    if(resultType === 'article') resultCount[resultStatus]++


    //Check contains for records and assign data
    if(result.contains && result.contains.length) {
      result.contains.forEach((record, index)=>{
        let recordTitle, recordStatus, recordType, recordInfo
        let error = {}
        let contains2 = {}
        const recordDoi = record['DOI:']

        //Check cart for record, if not found, must be an issue, get data from stored publications
        recordInfo = cart.find((cartItem)=>{
          return cartItem.doi.toLowerCase() === recordDoi.toLowerCase()
        })
        if(!recordInfo) {
          recordInfo = publications[pubDoi.toLowerCase()].normalizedRecords[recordDoi.toLowerCase()]
        }

        //Assign data to vars
        recordType = recordInfo.type
        recordTitle = recordType === 'issue' ?
          `${recordInfo.title.volume && `Volume ${recordInfo.title.volume}, `}Issue ${recordInfo.title.issue}`
          : recordInfo.title.title

        if(typeof record.result === 'string') {
          recordStatus = 'Failure'
          error.errorMessage = record.result
        } else if (typeof record.result === 'object' && record.result.record_diagnostic) {
          const recordDiagnostic = record.result.record_diagnostic
          recordStatus = (recordDiagnostic[1] || recordDiagnostic)['-status']
          if(recordStatus === 'Failure') {
            error.errorMessage = (recordDiagnostic[1] || recordDiagnostic).msg
          }
        } else {
          recordStatus = 'Failure'
          error.errorMessage = 'Unknown Error'
        }

        if(recordStatus === 'Failure') recordStatus = 'Failed'

        if(recordType === 'article') resultCount[recordStatus]++


        //Check record for contains, if found, must be articlesUnderIssue, assign data to vars
        if(record.contains && record.contains.length) {
          const issueDoi = recordDoi
          record.contains.forEach((article, index)=>{
            let articleTitle, articleStatus, articleInfo
            let error = {}
            const articleDoi = article['DOI:']
            articleInfo = cart.find((cartItem)=>{
              return cartItem.doi.toLowerCase() === articleDoi.toLowerCase()
            })

            articleTitle = articleInfo.title.title

            if(typeof article.result === 'string') {
              articleStatus = 'Failure'
              error.errorMessage = result.result
            } else if (typeof article.result === 'object' && article.result.record_diagnostic) {
              const recordDiagnostic = article.result.record_diagnostic
              articleStatus = (recordDiagnostic[1] || recordDiagnostic)['-status']
              if(articleStatus === 'Failure') {
                error.errorMessage = (recordDiagnostic[1] || recordDiagnostic).msg
              }
            } else {
              articleStatus = 'Failure'
              error.errorMessage = 'Unknown Error'
            }

            if(articleStatus === 'Failure') articleStatus = 'Failed'

            resultCount[articleStatus]++

            if (depositId.indexOf(article.submissionid) === -1) {
              depositId.push(article.submissionid)
            }

            const articleResult = {
              title: articleTitle,
              status:articleStatus,
              type: 'article',
              doi: articleDoi,
              issueDoi: issueDoi,
              pubDoi: pubDoi,
              submissionId: article.submissionid,
              ...error
            }

            //Check if article's parentIssue already exists in resultData, if so, merge contains2 with parentIssue contains
            if(resultData[pubTitle] && resultData[pubTitle].contains[issueDoi]) {
              contains2 = {
                ...resultData[pubTitle].contains[issueDoi].contains,
                [articleDoi]: articleResult
              }
            } else {
              contains2[articleDoi] = articleResult
            }
          })
        } //Finished processing articleUnderIssue


        //Continue processing record
        if (depositId.indexOf(record.submissionid) === -1) {
          depositId.push(record.submissionid)
        }

        const recordResult = {
          title: recordTitle,
          status:recordStatus,
          type: recordType,
          doi: recordDoi,
          pubDoi: pubDoi,
          submissionId: record.submissionid,
          contains: contains2,
          ...error
        }

        //Check if parent Publication exists in resultData, if so merge contains1 with parent publication contains
        if(resultData[pubTitle]) {
          contains1 = {
            ...resultData[pubTitle].contains,
            [recordDoi]: recordResult
          }
        } else {
          contains1[recordDoi] = recordResult
        }
      })
    } //Finished processing records


    //Continue processing result
    if (depositId.indexOf(result.submissionid) === -1) {
      depositId.push(result.submissionid)
    }

    let thisResult = {
      title: resultTitle,
      status:resultStatus,
      type:resultType,
      doi: resultDoi,
      pubDoi: pubDoi,
      submissionId: result.submissionid,
      contains:[],
      ...error
    }


    //If result is a record, the parents didn't get deposited, so have to create a representation of the undeposited parents in resultData
    if (resultType !== 'publication') {
      let newContains = parentIssue ? {
        [parentIssue.doi]: {
          title: `${parentIssue.title.volume && `Volume ${parentIssue.title.volume}, `}Issue ${parentIssue.title.issue}`,
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
          type: 'publication',
          doi: pubDoi,
          pubDoi: pubDoi,
          contains: newContains,
        }
      } else {
        if(parentIssue) {
          if(resultData[pubTitle].contains[parentIssue.doi]) {
            resultData[pubTitle].contains[parentIssue.doi].contains = {
              ...resultData[pubTitle].contains[parentIssue.doi].contains,
              [resultDoi]: thisResult
            }
          } else {
            resultData[pubTitle].contains[parentIssue.doi] = newContains[parentIssue.doi]
          }
        } else {
          resultData[pubTitle].contains[resultDoi] = thisResult
        }

      }

    //Result is a publication so write it to resultData. Publication may have already been created by previous deposit
    // but we dont need to merge because only contains would be different in new deposit and contains already merged above
    } else {
      resultData[pubTitle] = {
        title: pubTitle,
        status: resultStatus,
        type: 'publication',
        doi: pubDoi,
        pubDoi: pubDoi,
        contains: contains1,
        ...error
      }
    }
  })

  depositId = depositId.length > 1 ? `${depositId[0]} - ${depositId.pop()}` : depositId[0]

  return {resultData, resultCount, depositId}
}

