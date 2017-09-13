import React, { Component } from 'react'
import is from 'prop-types'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { stateTrackerII, updateReporterII } from 'my_decorators'
import _ from 'lodash'

import { controlModal, cartUpdate, getItem, removeFromCart, clearCart, deposit } from '../actions/application'
import DepositCart from '../components/depositCart'
import reviewDepositCart from '../components/reviewDepositCart'
import DepositResult from '../components/depositResult'
import {routes} from '../routing'



const mapStateToProps = state => ({
  cart: state.cart,
  publications: state.publications
})

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxControlModal: controlModal,
  reduxCartUpdate: cartUpdate,
  reduxRemoveFromCart: removeFromCart,
  reduxClearCart: clearCart,
  asyncGetItem: getItem,
  asyncDeposit: deposit
}, dispatch)

@connect(mapStateToProps, mapDispatchToProps)
export default class DepositCartPage extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    reduxRemoveFromCart: is.func.isRequired,
    reduxClearCart: is.func.isRequired,
    asyncGetItem: is.func.isRequired,
    asyncDeposit: is.func.isRequired,
    cart: is.array.isRequired,
    publications: is.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      showDeposit: true,
      fullCart: [],
      status: 'cart',
      result: {
        resultData: '',
        resultCount: '',
        depositId: ''
      }
    }
  }

  componentDidMount() {
    this.getFullCart()
  }

  getFullCart (cart = this.props.cart) {

    const promises = []
    const _this = this
    if(cart.length > 0) {
      _.each(cart, (item) => {

        let doi = item.doi
        if (!doi) {
          doi = item.article.doi
        }
        promises.push(this.props.asyncGetItem(doi).then((data)=>{return data}))
      })

      Promise.all(promises).then((fullData) => {
        let mergedCart = []
        for(let i in fullData){
          mergedCart.push({
            date: fullData[i].message.date,
            doi: fullData[i].message.doi,
            status: fullData[i].message.status,
            type: fullData[i].message.type,
            title: fullData[i].message.title.title,
            contains: []
          })
        }


        mergedCart = _.uniqBy(mergedCart, function (cartItem) { // merging publications
          return cartItem.doi
        })


        function mergeByDoi(arr) {
          return _(arr)
            .groupBy(function(item) { // group the items using the lower case
              return item.doi
            })
            .map(function(group) { // map each group
              return _.mergeWith.apply(_, [{}].concat(group, function(obj, src) { // merge all items, and if a property is an array concat the content
                if (Array.isArray(obj)) {
                  return obj.concat(src)
                }
              }))
            })
            .values() // get the values from the groupBy object
            .value()
        }

        for(let i in mergedCart) {
          for(let j in fullData) {
            if(fullData[j]) {
              if (mergedCart[i].doi === fullData[j].message.doi) {
                mergedCart[i].contains.push(fullData[j].message.contains[0])
              }
            }
          }
        }

        for(let k in mergedCart){
          mergedCart[k].contains = mergeByDoi(mergedCart[k].contains)
        }

        //need to get publication meta data as well
        const promises = []

        for(let i in mergedCart) {
          promises.push(this.props.asyncGetItem(mergedCart[i].doi).then((data)=>{ // this gets publication content
            return data
          }))
        }
        Promise.all(promises).then((publicationData) => {
          const issuePromises = []
          for(let i in publicationData) {
            mergedCart[i].content = publicationData[i].message.content
            for(let item of mergedCart[i].contains) {
              if (item.type === 'issue') {
                issuePromises.push(this.props.asyncGetItem(item.doi).then((data)=>{ // this gets publication content
                  item.content = data.message.contains[0].content
                }))
              }
            }
          }

          //this gets the issues
          Promise.all(issuePromises).then(() => {
            _this.setState({
              fullCart: update(this.state.fullCart, {$set: mergedCart })
            })
          })
        })
      })
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if(nextProps.location !== this.props.location) this.setState({status:'cart'});
    if (this.props.cart !== nextProps.cart) {
      this.getFullCart(nextProps.cart)
    }
  }

  review = () => {
      this.props.reduxControlModal({
        showModal: true,
        title:
          <div className='innerTitleHolder'>
            <div className='innterTitleHolderIcon'>
              <img src={`${routes.images}/ReviewArticle/Asset_Icons_White_Review.svg`} />
            </div>
            <div className='innerTitleHolderText'>
              Review All
            </div>
          </div>,
        style: 'defaultModal reviewModal',
        Component: reviewDepositCart,
        props: {
            fullCart: this.state.fullCart,
            reduxControlModal: this.props.reduxControlModal
        }
      })
  }

  deposit = () => {
    if(!this.state.showDeposit || this.state.status === 'processing') return

    const toDeposit = this.props.cart.map((item) => {
      return { 'doi': item.doi, 'version': item['mdt-version'] }
    })

    this.setState({status:`processing`})

    const errorHandler = (error) => {
      console.error(error)
      this.setState({status: 'cart'})
      this.props.reduxControlModal({
        showModal: true,
        title: error,
        style: 'errorModal',
        Component: ()=>null
      })
    }

    this.props.asyncDeposit(toDeposit, (depositResult) => {
      this.setState({status:'result', result: this.processDepositResult(depositResult)})
      this.props.reduxClearCart()
    }, errorHandler)
  }

  processDepositResult = (depositResult) => {
    console.log(depositResult)
    debugger;
    const resultCount = {Success: 0, Failed: 0}
    const resultData = {}
    let depositId = []

    depositResult.forEach((result, index)=>{
      let pubDoi, pubTitle, resultTitle, resultStatus, resultType, resultInfo
      let error = {}
      let children1 = {}
      const resultDoi = result['DOI:']
      if(!result.contains) {
        resultInfo = this.props.cart.find((cartItem)=>{
          return cartItem.doi === resultDoi.toLowerCase()
        })
      }
      console.log(resultInfo)
      resultType = resultInfo ? resultInfo.type : 'publication'
      pubDoi = resultType === 'publication' ? resultDoi : resultInfo.pubDoi
      pubTitle = this.props.publications[pubDoi.toLowerCase()].message.title.title
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
        depositId.push(recordDiagnostic.submission_id)
        resultStatus = (recordDiagnostic[1] || recordDiagnostic)['-status']
        if(resultStatus === 'Failure') {
          error.errorMessage = (recordDiagnostic[1] || recordDiagnostic).msg
        }
      } else {
        resultStatus = 'Failure'
        error.errorMessage = 'Unknown Error'
      }

      if(resultStatus === 'Failure') resultStatus = 'Failed'

      resultCount[resultStatus]++

      if(result.contains && result.contains.length) {
        result.contains.forEach((record, index)=>{
          let recordTitle, recordStatus, recordType, recordInfo
          let error = {}
          let children2 = {}
          const recordDoi = record['DOI:']
          recordInfo = this.props.cart.find((cartItem)=>{
            return cartItem.doi === recordDoi.toLowerCase()
          })

          recordType = recordInfo.type
          recordTitle = recordType === 'issue' ?
            `${recordInfo.title.volume && `Volume ${recordInfo.title.volume}, `}Issue ${recordInfo.title.issue}`
            : recordInfo.title.title

          if(typeof record.result === 'string') {
            recordStatus = 'Failure'
            error.errorMessage = record.result
          } else if (typeof record.result === 'object' && record.result.record_diagnostic) {
            const recordDiagnostic = record.result.record_diagnostic
            depositId.push(recordDiagnostic.submission_id)
            recordStatus = (recordDiagnostic[1] || recordDiagnostic)['-status']
            if(recordStatus === 'Failure') {
              error.errorMessage = (recordDiagnostic[1] || recordDiagnostic).msg
            }
          } else {
            recordStatus = 'Failure'
            error.errorMessage = 'Unknown Error'
          }

          if(recordStatus === 'Failure') recordStatus = 'Failed'

          resultCount[resultStatus]++

          if(record.contains && record.contains.length) {
            const issueDoi = recordInfo.doi
            record.contains.forEach((article, index)=>{
              let articleTitle, articleStatus, articleInfo
              let error = {}
              const articleDoi = article['DOI:']
              articleInfo = this.props.cart.find((cartItem)=>{
                return cartItem.doi === articleDoi.toLowerCase()
              })

              articleTitle = articleInfo.title.title

              if(typeof article.result === 'string') {
                articleStatus = 'Failure'
                error.errorMessage = result.result
              } else if (typeof article.result === 'object' && article.result.record_diagnostic) {
                const recordDiagnostic = article.result.record_diagnostic
                depositId.push(recordDiagnostic.submission_id)
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

              const articleResult = {
                title: articleTitle,
                status:articleStatus,
                type: 'article',
                doi: articleDoi,
                issueDoi: issueDoi,
                pubDoi: pubDoi,
                ...error
              }

              if(resultData[pubTitle] && resultData[pubTitle].contains[issueDoi]) {
                children2 = {
                  ...resultData[pubTitle].contains[issueDoi].contains,
                  [articleDoi]: articleResult
                }
              } else {
                children2[articleDoi] = articleResult
              }
            })
          }

          const recordResult = {
            title: recordTitle,
            status:recordStatus,
            type: recordType,
            doi: recordDoi,
            pubDoi: pubDoi,
            contains: children2,
            ...error
          }

          if(resultData[pubTitle]) {
            children1 = {
              ...resultData[pubTitle].contains,
              [recordDoi]: recordResult
            }
          } else {
            children1[recordDoi] = recordResult
          }
        })
      }

      let childRecord = {
        title: resultTitle,
        status:resultStatus,
        type:resultType,
        doi: resultDoi,
        pubDoi: pubDoi,
        contains:[],
        ...error
      }
      if (resultType !== 'publication') {
        if(!resultData[pubTitle]) {
          resultData[pubTitle] = {
            title: pubTitle,
            status: 'undeposited',
            type: 'publication',
            doi: pubDoi,
            pubDoi: pubDoi,
            contains: {[resultDoi]: childRecord},
          }
        } else {
          resultData[pubTitle].contains[resultDoi] = childRecord
        }
      } else {
        resultData[pubTitle] = {
          title: pubTitle,
          status: resultStatus,
          type: 'publication',
          doi: pubDoi,
          pubDoi: pubDoi,
          contains: children1,
          ...error
        }
      }
    })

    depositId = depositId.length > 1 ? `${depositId[0]} - ${depositId.pop()}` : depositId[0]

    console.log({resultData, resultCount, depositId})

    return {resultData, resultCount, depositId}
  }

  toggleDeposit = (showDeposit) => {
    this.setState({showDeposit})
  }

  render () {
    const {resultData, resultCount, depositId} = this.state.result

    return (
      <div className='depositPage'>

        <TopOfPage
          status={this.state.status}
          cart={this.props.cart}
          showDeposit={this.state.showDeposit}
          deposit={this.deposit}
          review={this.review}
        />

        {this.state.status !== 'result' &&
          <div className={this.state.status === 'processing' ? "opacity" : ''} >
            {(this.props.cart.length) ?
                <DepositCart
                  reduxRemoveFromCart={this.props.reduxRemoveFromCart}
                  fullCart={this.state.fullCart}
                  showDeposit={this.state.showDeposit}
                  toggleDeposit={this.toggleDeposit}
                />
              : <EmptyCart/>
            }
          </div>
        }

        { this.state.status === 'processing' && <WaitMessage/> }

        { this.state.status === 'result' && <DepositResult resultCount={resultCount} resultData={resultData} depositId={depositId}/> }
      </div>
    )
  }
}








const TopOfPage = ({status, cart, showDeposit, deposit, review}) => {
  return (
    <div>
      {status !== 'result' &&
        <div className='pageTitle'>
          Deposit Cart
        </div>
      }

      <div className='buttonHolder'>
        <div className='buttonInnerHolder'>
          <div className='ReviewButtonHolder'>
            {status !== 'result' ? (cart.length > 0 ? <a onClick={review}>Review All</a> : '') : <div className='pageTitle'>Deposit Result</div>}
          </div>
          <div className={`DepositButtonHolder ${status === 'result' ? 'result' : ''}`}>
            <a
              onClick={deposit}
              className={((!showDeposit || status === 'processing') ? 'disabledDeposit' : '') + (cart.length <= 0 ? ' emptycartbutton': '')}>
              {(cart.length > 0 && status !== 'processing') ? 'Deposit' : 'Processing...'}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

const EmptyCart = () => {
  return (
    <div className='EmptyHolder'>
      <div className='emptyTitle'>
        Deposit Cart is Empty
      </div>
      <div className='emptyBoxHolder'>
        <img src={`${routes.images}/Deposit/Asset_Empty_Box_Empty Box Yellow.svg`} />
      </div>
    </div>
  )
}

const WaitMessage = () => {
  return (
    <div className="waitMessage">
      <div>Just a moment...</div>
      <div>Please wait while we process your deposit</div>
      <img src={`${routes.images}/Deposit/Asset_Load_Throbber_Load Throbber Grey.svg`} />
    </div>
  )
}