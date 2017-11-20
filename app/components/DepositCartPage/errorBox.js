import React, { Component } from 'react'
import $ from 'jquery'

import {routes} from '../../routing'



export default class ErrorBox extends Component {
  state = {errorBoxShow: false}

  componentWillReceiveProps () {
    this.setState({errorBoxShow: false})
  }

  toggleError = async (e) => {
    const target = $(e.target)
    if((target.parents('.popup').length || target.hasClass('popup')) && !target.hasClass('closeButton')) {
      return
    }

    if(!this.state.errorBoxShow) {
      await this.props.closeErrors()
      this.setState({errorBoxShow: true})
    } else {
      this.setState({errorBoxShow: false})
    }
  }

  render () {
    return ( this.props.type === 'cart' ?
      <ul className="errorButton">
        <li onClick={this.toggleError}>
          <a className="tooltips">
            {this.state.errorBoxShow && <div className="popup">
              <div className="scrollContainer">{this.props.errorMessage}</div>
              <img className='closeButton' src={`${routes.images}/Deposit/x.png`}/>
            </div>}

            <img src={`${routes.images}/AddArticle/Asset_Icons_White_Caution.svg`}/>
          </a>
        </li>
      </ul>
    :
      <ul>
        <li onClick={this.toggleError}>
          <a className="tooltips">
            {this.state.errorBoxShow &&
            <div className="popup">
              <img src={`${routes.images}/AddArticle/Asset_Icons_White_Caution.svg`}/>
              <p>{this.props.errorMessage}</p>
              <img className='closeButton' src={`${routes.images}/Deposit/x.png`}/>
            </div>}
            <img src={`${routes.images}/AddArticle/Asset_Icons_White_Caution.svg`}/>
          </a>
        </li>
      </ul>
    )
  }
}
