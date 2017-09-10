import React, { Component } from 'react'
import is from 'prop-types'

import DepositCartRecord from './depositCartRecord'



export default class DepositCartItem extends Component {
  static propTypes = {
    reduxRemoveFromCart: is.func.isRequired,
    cartItem: is.object.isRequired,
    showDeposit: is.bool.isRequired,
    toggleDeposit: is.func.isRequired,
    recordCount: is.number.isRequired,
    closeErrors: is.func.isRequired,
  };

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

      let reportErrors
      const asyncErrorReport = new Promise((resolve)=>{
        reportErrors = resolve
      })
      errorReports.push(asyncErrorReport)

      records.push(
        <DepositCartRecord
          key={record.doi}
          pubDoi={props.cartItem.doi}
          reduxRemoveFromCart={props.reduxRemoveFromCart}
          cartItem={record}
          closeErrors={this.props.closeErrors}
          reportErrors={reportErrors}
        />
      )

      if (record.contains) {
        for(let j = 0; j < record.contains.length; j++){
          const parentIssue = props.cartItem.contains[i]
          const recordUnderIssue = props.cartItem.contains[i].contains[j]
          if(j === 0) {
            records.push(<tr key={parentIssue.doi + '_space1'} className='articleUnderIssueSpace'><td/><td/><td/><td className="borderRight"/></tr>)
          }

          let reportErrors
          const asyncErrorReport = new Promise((resolve)=>{
            reportErrors = resolve
          })
          errorReports.push(asyncErrorReport)

          records.push(
            <DepositCartRecord
              key={recordUnderIssue.doi}
              underIssue={true}
              issueDoi={parentIssue.doi}
              pubDoi={props.cartItem.doi}
              reduxRemoveFromCart={props.reduxRemoveFromCart}
              cartItem={recordUnderIssue}
              closeErrors={this.props.closeErrors}
              reportErrors={reportErrors}
            />
          )
          if(j === props.cartItem.contains[i].contains.length - 1) {
            records.push(<tr key={parentIssue.doi + '_space2'} className='articleUnderIssueSpace borderBottom'><td/><td/><td/><td className="borderRight"/></tr>)
          }
        }
      }
    }

    Promise.all(errorReports).then((results)=>{  // if none of the error reports resolved true, no errors, turn on deposit
      if(!this.props.showDeposit && results.indexOf(true) === -1) this.props.toggleDeposit(true)
    })
    return records
  }

  render () {

    return (
      <div>
        <div className='depositpage'>
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
      </div>
    )
  }
}
