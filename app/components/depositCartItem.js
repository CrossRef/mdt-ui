import React, { Component } from 'react'
import is from 'prop-types'

import DepositCartRecord from './depositCartRecord'
import {Deferred} from '../utilities/helpers'



export default class DepositCartItem extends Component {
  static propTypes = {
    reduxRemoveFromCart: is.func.isRequired,
    cartItem: is.object.isRequired,
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

      const asyncErrorReport = new Deferred()
      errorReports.push(asyncErrorReport.promise)

      records.push(
        <DepositCartRecord
          key={record.doi}
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
          const recordUnderIssue = props.cartItem.contains[i].contains[j]
          if(j === 0) {
            records.push(<tr key={parentIssue.doi + '_space1'} className='articleUnderIssueSpace'><td/><td/><td/><td className="borderRight"/></tr>)
          }

          const asyncErrorReport = new Deferred()
          errorReports.push(asyncErrorReport.promise)

          records.push(
            <DepositCartRecord
              key={recordUnderIssue.doi}
              underIssue={true}
              issueDoi={parentIssue.doi}
              pubDoi={props.cartItem.doi}
              reduxRemoveFromCart={props.reduxRemoveFromCart}
              cartItem={recordUnderIssue}
              closeErrors={this.props.closeErrors}
              reportErrors={asyncErrorReport.resolve}
            />
          )
          if(j === props.cartItem.contains[i].contains.length - 1) {
            records.push(<tr key={parentIssue.doi + '_space2'} className='articleUnderIssueSpace borderBottom'><td/><td/><td/><td className="borderRight"/></tr>)
          }
        }
      }
    }

    Promise.all(errorReports).then((results)=>{  // if none of the error reports resolved true, report no errors to depositCart
      if(results.indexOf(true) === -1) {
        this.props.reportErrors(false)
      } else {
        this.props.reportErrors(true)
      }
    })
    return records
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
                    <tr>
                      <td className='stateIcon deposittitle'>&nbsp;</td>
                      <td className='depositpubtitle' colSpan={3}><a href="">{this.props.cartItem.title}</a></td>
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
