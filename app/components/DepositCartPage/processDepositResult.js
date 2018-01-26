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

  await Promise.all(resultArray.map(async (result) => {
    let pubDoi, pubTitle, resultTitle, resultStatus, resultType, resultInfo, parentIssue, resultInCart
    let error = {}
    let contains1 = {}
    const resultDoi = result['DOI:']
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

    if(resultStatus === 'Failure') {
      resultStatus = 'Failed'
    }

    if (resultInCart && !used[resultInfo.doi]) {
      resultCount[resultStatus]++
      used[resultInfo.doi] = true
    }


    //Check contains for records and assign data
    if(result.contains && result.contains.length) {
      result.contains.forEach( async(record, index)=>{
        let recordTitle, recordStatus, recordType, recordInfo, recordInCart
        let error = {}
        let contains2 = {}
        const recordDoi = record['DOI:']
        recordType = record.type

        if(recordType === 'article') {
          recordInfo = cart.find( cartItem => compareDois(cartItem.doi, recordDoi) )
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

        if(recordStatus === 'Failure') {
          recordStatus = 'Failed'
        }

        if (recordInCart && !used[recordInfo.doi]) {
          resultCount[recordStatus]++
          used[recordInfo.doi] = true
        }


        //Check record for contains, if found, must be articlesUnderIssue, assign data to vars
        if(record.contains && record.contains.length) {
          const issueDoi = recordDoi
          record.contains.forEach((article, index)=>{
            let articleTitle, articleStatus, articleInfo
            let error = {}
            const articleDoi = article['DOI:']
            articleInfo = cart.find( cartItem => compareDois(cartItem.doi, articleDoi) )

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
        depositId.add(record.submissionid)

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
    depositId.add(result.submissionid)




    //If result is a record, the parents didn't get deposited, so have to create a representation of the undeposited parents in resultData
    if (resultType !== 'Publication') {
      let thisResult = {
        title: resultTitle,
        status:resultStatus,
        type:resultType,
        doi: resultDoi,
        pubDoi: pubDoi,
        submissionId: result.submissionid,
        contains: resultType === 'issue' ? contains1 : [],
        ...error
      }

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
          type: 'Publication',
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
        type: 'Publication',
        doi: pubDoi,
        pubDoi: pubDoi,
        contains: contains1,
        ...error
      }
    }
  }))


  depositId = Array.from(depositId)
  depositId = depositId.length > 1 ? `${depositId[0]} - ${depositId.pop()}` : depositId[0]

  return {resultData, resultCount, depositId}
}

