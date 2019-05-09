import React, { Component } from 'react'
import is from 'prop-types'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import {recordTitle} from '../utilities/helpers'
import { controlModal, cartUpdate, removeFromCart, clearCart, getPublications } from '../actions/application'
import DepositCart from '../components/DepositCartPage/depositCart'
import {TopOfPage, EmptyCart, WaitMessage} from '../components/DepositCartPage/depositCartComponents'
import reviewDepositCart from '../components/DepositCartPage/reviewDepositCartModal'
import DepositResult from '../components/DepositCartPage/depositResult'
import {routes} from '../routing'
import processDepositResult from '../components/DepositCartPage/processDepositResult'
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
  asyncGetPublications: getPublications
}, dispatch)

@connect(mapStateToProps, mapDispatchToProps)
export default class DepositCartPage extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    reduxRemoveFromCart: is.func.isRequired,
    reduxClearCart: is.func.isRequired,
    asyncGetPublications: is.func.isRequired,
    cart: is.array.isRequired,
    publications: is.object.isRequired
  }


  constructor (props) {
    super(props)
    this.state = {
      showDeposit: false,
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
        promises.push(api.getItem(item.doi).then( data => data,(reason)=>{
          const title = recordTitle(item.type, item.title)
          this.props.reduxRemoveFromCart(item.doi, title, item.type)
          console.log("Error getting item for cart:" +reason)}))
      })

      Promise.all(promises).then((fullData) => {
        let mergedCart = []
        for(let i in fullData){
          if (!fullData[i]){
            continue
          }
          //update mdt-version
          if(fullData[i].message.contains[0].type === 'article') {
            cart[i]['mdt-version'] = fullData[i].message.contains[0]['mdt-version']
          } else {
            cart[i]['mdt-version'] = fullData[i].message.contains[0].contains[0]['mdt-version']
          }

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
            .groupBy(function(item) {
              return item.doi || JSON.stringify(item.title)
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
                issuePromises.push(api.getItem({doi: item.doi, title: item.title, pubDoi: mergedCart[i].doi})
                  .then((data)=>{
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
              Review all
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

    api.deposit(toDeposit).then( async result => {
      this.setState({status:'result', result: await processDepositResult(result, this.props.publications, this.props.cart, this.props.asyncGetPublications)})
      this.props.reduxClearCart()
    })
      .catch(reason => errorHandler(reason).then(()=>this.setState({status: 'cart'})))
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
                  publications={this.props.publications}
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



