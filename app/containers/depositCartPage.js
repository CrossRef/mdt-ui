import React, { Component } from 'react'
import is from 'prop-types'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { stateTrackerII, updateReporterII } from 'my_decorators'
import _ from 'lodash'

import { controlModal, cartUpdate, removeFromCart, clearCart } from '../actions/application'
import DepositCart from '../components/depositCart'
import reviewDepositCart from '../components/reviewDepositCart'
import DepositResult from '../components/depositResult'
import {routes} from '../routing'
import processDepositResult from '../utilities/processDepositResult'
import {errorHandler} from '../utilities/helpers'
import * as api from '../actions/api'




const mapStateToProps = state => ({
  cart: state.cart,
  publications: state.publications
})

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxControlModal: controlModal,
  reduxCartUpdate: cartUpdate,
  reduxRemoveFromCart: removeFromCart,
  reduxClearCart: clearCart,
}, dispatch)

@connect(mapStateToProps, mapDispatchToProps)
export default class DepositCartPage extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    reduxRemoveFromCart: is.func.isRequired,
    reduxClearCart: is.func.isRequired,
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

        if(item.type !== 'Publication') {
          promises.push(api.getItem(doi).then((data)=>{return data}))
        } else {
          promises.push(Promise.resolve({
            message: item
          }))
        }

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
              if (mergedCart[i].doi === fullData[j].message.doi && fullData[j].message.contains.length) {
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
          promises.push(api.getItem(mergedCart[i].doi).then((data)=>{ // this gets publication content
            return data
          }))
        }
        Promise.all(promises).then((publicationData) => {
          const issuePromises = []
          for(let i in publicationData) {
            mergedCart[i].content = publicationData[i].message.content
            for(let item of mergedCart[i].contains) {
              if (item.type === 'issue') {
                issuePromises.push(api.getItem(item.doi).then((data)=>{ // this gets publication content
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

    api.deposit(toDeposit).then( result => {
      this.setState({status:'result', result: processDepositResult(result, this.props.publications, this.props.cart)})
      this.props.reduxClearCart()
    })
    .catch(reason => errorHandler(reason, ()=>this.setState({status: 'cart'})))
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
                  cart={this.props.cart}
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