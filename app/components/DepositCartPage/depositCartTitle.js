import React, { Component } from 'react'
import is from 'prop-types'
import { Link } from 'react-router'

import DepositCartRecord from './depositCartRecord'
import {DeferredTask} from '../../utilities/helpers'
import {routes} from '../../routing'



export default class DepositCartItem extends Component {
  static propTypes = {
    reduxRemoveFromCart: is.func.isRequired,
    cartItem: is.object.isRequired,
    cart: is.array.isRequired,
    reportErrors: is.func.isRequired,
    recordCount: is.number.isRequired,
    closeErrors: is.func.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      records: []
    }
  }

  renderRecords = (props = this.props) => {
    const records = []
    const errorReports = []

    for(let i = 0; i < props.cartItem.contains.length; i++){
      const record = props.cartItem.contains[i]

      const asyncErrorReport = new DeferredTask()
      errorReports.push(asyncErrorReport.promise)

      records.push(
        <DepositCartRecord
          key={record.doi || JSON.stringify(record.title)}
          pubDoi={props.cartItem.doi}
          reduxRemoveFromCart={props.reduxRemoveFromCart}
          cartItem={record}
          closeErrors={this.props.closeErrors}
          reportErrors={asyncErrorReport.resolve}
        />
      )

      if (record.contains) {
        for(let j = 0; j < record.contains.length; j++){
          const parentIssue = props.cartItem.contains[i]
          const articleUnderIssue = props.cartItem.contains[i].contains[j]
          const key = parentIssue.doi ? parentIssue.doi : JSON.stringify(parentIssue.title)
          if(j === 0) {
            records.push(<tr key={key + '_space1'} className='articleUnderIssueSpace'><td/><td/><td/><td className="borderRight"/></tr>)
          }

          const asyncErrorReport = new DeferredTask()
          errorReports.push(asyncErrorReport.promise)

          records.push(
            <DepositCartRecord
              key={articleUnderIssue.doi}
              issueDoi={parentIssue.doi}
              issueTitle={parentIssue.title}
              pubDoi={props.cartItem.doi}
              reduxRemoveFromCart={props.reduxRemoveFromCart}
              cartItem={articleUnderIssue}
              closeErrors={this.props.closeErrors}
              reportErrors={asyncErrorReport.resolve}
            />
          )
          if(j === props.cartItem.contains[i].contains.length - 1) {
            records.push(<tr key={key + '_space2'} className='articleUnderIssueSpace borderBottom'><td/><td/><td/><td className="borderRight"/></tr>)
          }
        }
      }
    }

    Promise.all(errorReports).then((results)=>{  // if none of the error reports resolved true, report no errors to depositCart
      this.props.reportErrors( results.indexOf(true) !== -1 )
    })
    return records
  }

  remove = () => {
    const cartItem = this.props.cartItem
    const cartType = this.props.cartItem.type
    this.props.reduxRemoveFromCart(cartItem.doi, cartItem.title, cartType)
  }

  render () {

    return (
      <div className='depositCartItem'>
        <table>
          <tbody>
            <tr>
              <td className='titleHolderTD'>
                <table className='itemholder'>
                  <tbody>
                    <tr className="borderBottom">
                      <td className='stateIcon deposittitle'>&nbsp;</td>
                      <td className='depositpubtitle'>
                        <Link to={`${routes.publications}/${encodeURIComponent(this.props.cartItem.doi)}`}>
                          {this.props.cartItem.title}
                        </Link>
                      </td>
                      <td className="status">{/*{pascaleCase(this.props.cartItem.status)}*/}</td>
                      <td className="action">{this.props.inCart && <a onClick={this.remove}>Remove</a>}</td>
                      <td className='titlerror errorholder'>&nbsp;</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <table className='itemholder'>
          <tbody>
            {this.renderRecords()}
          </tbody>
        </table>
      </div>
    )
  }
}
