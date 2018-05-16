import React, { Component } from 'react'
import is from 'prop-types'
import $ from 'jquery'

import {routes} from '../../routing'


export default class ActionBar extends Component {

  static propTypes = {
    back: is.func.isRequired,
    addToCart: is.func.isRequired,
    save: is.func.isRequired,
    openReviewArticleModal: is.func.isRequired,
    saving: is.bool.isRequired,
    inCart: is.bool,
    criticalErrors: is.object.isRequired
  }

  state = {
    menuOpen: false,
    confirmationPayload: {
      status: '',
      message: ''
    },
    timeOut: ''
  }

  toggleMenu = () => {
    this.setState({menuOpen: !this.state.menuOpen})
  }

  handleClick = e => {
    const element = $(e.target)
    if(!(element.parents('.actionBarDropDown').length || element.is('.actionBarDropDown, .actionTooltip'))) {
      this.setState({ menuOpen: false })
    }
  }

  componentWillUpdate (nextProps, nextState) {
    if(nextState.menuOpen) {
      document.addEventListener('click', this.handleClick, false)
    } else if (!nextState.menuOpen) {
      document.removeEventListener('click', this.handleClick, false)
    }
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleClick, false)
    clearTimeout(this.state.timeOut)
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.saving) this.confirmSave(nextProps.criticalErrors, nextProps.inCart)
  }

  confirmSave = (criticalErrors, inCart) => {
    clearTimeout(this.state.timeOut)
    const confirmationPayload = {
      status: 'saveSuccess',
      message: 'Saved'
    }

    const criticalErrorMsg = {
      title: 'Title Required.',
      doi: 'Valid DOI Required.',
      invaliddoi: 'Valid DOI Required.',
      invalidDoiPrefix: 'Valid DOI Required.',
      freetolicense: 'License URL Required.',
      dupedoi: 'Valid DOI Required.'
    }
    const errorMessageArray = ['Save Failed:']

    for (let error in criticalErrors) {
      if(criticalErrors[error] === true) {
        confirmationPayload.status = 'saveFailed'
        errorMessageArray.push(criticalErrorMsg[error])
      }
    }

    if(confirmationPayload.status === 'saveFailed') {
      confirmationPayload.message = errorMessageArray.join(' ')
    } else if (inCart) {
      return
    }

    const timeOut = setTimeout(()=>{
      this.setState({confirmationPayload: {status: '', message: ''}})
    }, 7000)

    this.setState({confirmationPayload, timeOut})
  }


  render() {
    return (
      <div>
        <div className="reviewArticleButtonDiv">

          <button
            type='button'
            onClick={this.props.back}
            className="addPublication pull-left backbutton">
              <img className='backbuttonarrow' src={`${routes.images}/AddArticle/DarkTriangle.svg`} />
              <span>Back</span>
          </button>

          <div onClick={this.toggleMenu} className={'addPublication saveButton articleTooltip'}>
            Continue
            {this.state.menuOpen && <div className='actionBarDropDown'>
              <p onClick={this.props.addToCart}>Add to deposit</p>
              <p onClick={()=>this.props.save()}>Save</p>
              <p onClick={this.props.openReviewArticleModal}>Review</p>
            </div>}
          </div>
        </div>

        <div className={`saveConfirmation ${this.state.confirmationPayload.status}`}>{this.state.confirmationPayload.message}</div>
      </div>
    )
  }
}
