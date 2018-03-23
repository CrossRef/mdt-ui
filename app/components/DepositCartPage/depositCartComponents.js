import React from 'react'

import {routes} from '../../routing'



export function TopOfPage ({status, cart, showDeposit, deposit, review}) {
  return (
    <div>
      {status !== 'result' &&
      <div className='pageTitle'>
        To deposit
      </div>
      }

      <div className='buttonHolder'>
        <div className='buttonInnerHolder'>
          <div className='ReviewButtonHolder'>
            {status !== 'result' ? (cart.length > 0 ? <a onClick={review}>Review all</a> : '') : <div className='pageTitle'>Deposit result</div>}
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

export function EmptyCart () {
  return (
    <div className='EmptyHolder'>
      <div className='emptyTitle'>
        No items awaiting deposit
      </div>
      <div className='emptyBoxHolder'>
        <img src={`${routes.images}/Deposit/Asset_Empty_Box_Empty Box Yellow.svg`} />
      </div>
    </div>
  )
}

export function WaitMessage () {
  return (
    <div className="waitMessage">
      <div>Just a moment...</div>
      <div>Please wait while we process your deposit</div>
      <img src={`${routes.images}/Deposit/Asset_Load_Throbber_Load Throbber Grey.svg`} />
    </div>
  )
}