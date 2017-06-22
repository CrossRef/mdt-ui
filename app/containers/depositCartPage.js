import React, { Component } from 'react'
import is from 'prop-types'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

import { controlModal, cartUpdate, getItem, removeFromCart, deposit } from '../actions/application'
import Header from '../components/header'
import Footer from '../components/footer'
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
  asyncGetItem: getItem,
  asyncDeposit: deposit
}, dispatch)

@connect(mapStateToProps, mapDispatchToProps)
export default class DepositCartPage extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    reduxRemoveFromCart: is.func.isRequired,
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
      falseCnt: 0,
      status: 'cart'
    }
  }

  toggleDeposit = (showDeposit) => {
    if (!showDeposit) {
      var falseCnt = this.state.falseCnt
      this.setState({
        falseCnt: falseCnt + 1,
        showDeposit: false
      })
    }
  }

  getFullCart (cart = this.props.cart) {

    var promises = [];
    var _this = this;
    if(cart.length > 0) {
      _.each(cart, (item) => {

        var doi = item.doi
        if (!doi) {
          doi = item.article.doi
        }
        promises.push(this.props.asyncGetItem(doi).then((data)=>{return data}))
      })

      Promise.all(promises).then((fullData) => {
        var mergedCart = []
        for(var i = 0; i < fullData.length; i++){
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
          return cartItem.doi;
        });


        function mergeByDoi(arr) {
          return _(arr)
            .groupBy(function(item) { // group the items using the lower case
              return item.doi;
            })
            .map(function(group) { // map each group
              return _.mergeWith.apply(_, [{}].concat(group, function(obj, src) { // merge all items, and if a property is an array concat the content
                if (Array.isArray(obj)) {
                  return obj.concat(src);
                }
              }))
            })
            .values() // get the values from the groupBy object
            .value();
        }

        for(var i = 0; i < mergedCart.length; i++) {
          for(var j = 0; j < fullData.length; j++) {
            if(fullData[j]) {
              if (mergedCart[i].doi === fullData[j].message.doi) {
                mergedCart[i].contains.push(fullData[j].message.contains[0])
              }
            }
          }
        }

        for(var k = 0; k < mergedCart.length; k++){
          var result = mergeByDoi(mergedCart[k].contains)
          mergedCart[k].contains = result
        }

        //need to get publication meta data as well
        var promises = []

        for(var i = 0; i < mergedCart.length; i++) {
          promises.push(this.props.asyncGetItem(mergedCart[i].doi).then((data)=>{ // this gets publication content
            return data
          }))
        }
        Promise.all(promises).then((publicationData) => {
          var issuePromises = []
          for(var i = 0; i < publicationData.length; i++) {
            mergedCart[i].content = publicationData[i].message.content
            for(let item of mergedCart[i].contains) {
              if (item.type === 'issue') {
                issuePromises.push(this.props.asyncGetItem(item.doi).then((data)=>{ // this gets publication content
                  item.content = data.message.contains[0].content
                  return;
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

    if ((this.state.falseCnt !== nextState.falseCnt) && (nextState.falseCnt > 0)) {
      this.setState({
        showDeposit: false
      })
    }
  }

  componentDidMount() {
    this.getFullCart()
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
    if(!this.state.showDeposit || this.state.status === 'processing') return;

    const toDeposit = this.props.cart.map((item) => {
      return { 'doi': item.doi, 'version': item['mdt-version'] }
    });

    this.setState({status:`processing`})

    const errorHandler = (error) => {
      this.setState({status: 'cart'});
      this.props.reduxControlModal({
        showModal: true,
        title: 'Server Response - ' + error,
        style: 'errorModal',
        Component: ()=>null
      })
    }

    this.props.asyncDeposit(toDeposit, (resultArray) => {
      this.setState({status:'result', depositResult:resultArray})
    }, errorHandler);


  }

  processDepositResult = () => {
    const resultCount = {Success: 0, Failure: 0};
    const resultData = {};
    let depositId = [];

    this.state.depositResult.forEach((result, index)=>{
      let pubDoi, pubTitle, resultTitle, resultStatus, resultType;
      let error = {};
      const articleInfo = this.props.cart.find((cartItem)=>{
        return cartItem.doi === result['DOI:']
      });
      pubDoi = articleInfo.pubDoi;
      resultType = articleInfo.type;
      pubTitle = this.props.publications[pubDoi].message.title.title;
      resultTitle = articleInfo.title.title;

      if(typeof result.result === 'string') {
        resultStatus = 'Failure';
        error.errorMessage = result.result;
      } else if (typeof result.result === 'object') {
        depositId.push(result.result.doi_batch_diagnostic.submission_id);
        const recordDiagnostic = result.result.doi_batch_diagnostic.record_diagnostic;
        resultStatus = (recordDiagnostic[1] || recordDiagnostic)['-status'];
        if(resultStatus === 'Failure') {
          error.errorMessage = (recordDiagnostic[1] || recordDiagnostic).msg;
        }
      } else {
        resultStatus = 'Failure';
        error.errorMessage = 'Unknown Error';
      }

      resultCount[resultStatus]++;

      resultData[pubTitle] = [...(resultData[pubTitle] || []), {
        title: resultTitle,
        status:resultStatus,
        type:resultType,
        doi: result['DOI:'],
        pubDoi: pubDoi,
        ...error
      }];

    });

    depositId = depositId.length > 1 ? `${depositId[0]} - ${depositId.pop()}` : depositId[0];

    return {resultData, resultCount, depositId}
  }

  render () {
    const {resultData, resultCount, depositId} = (this.state.status === 'result' && this.state.depositResult) ? this.processDepositResult() : {};

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
            {(this.props.cart.length > 0) ?
                <DepositCart
                  reduxCartUpdate={this.props.reduxCartUpdate}
                  reduxControlModal={this.props.reduxControlModal}
                  reduxCart={this.props.cart}
                  reduxRemoveFromCart={this.props.reduxRemoveFromCart}
                  fullCart={this.state.fullCart}
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