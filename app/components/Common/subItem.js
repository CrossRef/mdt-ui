import React, { Component } from 'react'
import is from 'prop-types'

import {routes} from '../../routing'
import {refreshErrorBubble, refreshStickyError} from '../../utilities/helpers'



export default class SubItem extends Component {

  static propTypes = {
    title: is.string.isRequired,
    showSection: is.bool.isRequired,
    freeToRead: is.bool,
    optionalIssueInfoHandlers: is.func,
    addHandler: is.func,
    CrossmarkAddButton: is.func,
    arrowType: is.string,
    deferredErrorBubbleRefresh: is.object.isRequired
  }


  constructor (props) {
    super()
    this.state = {
      showSection: props.showSection || !!props.simCheckError || props.freeToRead || false
    }
  }

  componentWillReceiveProps(nextProps) {
    const freeToReadSwitchedOn = !!(nextProps.freeToRead && !this.props.freeToRead)
    if (freeToReadSwitchedOn || nextProps.validating) {
      this.setState({
        showSection: freeToReadSwitchedOn || nextProps.showSection || this.props.freeToRead || false
      })
    }
  }

  toggle = () => {
    this.setState({
      showSection: !this.state.showSection
    })
  }

  componentDidUpdate () {
    this.props.deferredErrorBubbleRefresh.resolve()
  }

  addButton = () => {
    if(this.props.addHandler || this.props.optionalIssueInfoHandlers) {
      return (
        <div className='addholder'>
          <a onClick={()=>{
            if (!this.state.showSection) {
              this.setState({showSection: true})
            }
            if(this.props.optionalIssueInfoHandlers) {
              this.props.optionalIssueInfoHandlers().addOptionalIssueInfo()
            } else {
              this.props.addHandler()
            }
          }}>Add New</a>
        </div>
      )
    } else if (this.props.CrossmarkAddButton) {
      return (
        <this.props.CrossmarkAddButton toggleSubItem={this.toggle} showSection={this.state.showSection}/>
      )
    }
  }

  render () {
    const { title, addHandler, arrowType } = this.props

    return (
      <div>
        <div className='topbar'>
          <div className='titleholder'>
            <div className={'titleinnholder' + (addHandler ? ' subinnerholder' : ' notclickableholder')} onClick={this.toggle}>
              <span className={'arrowHolder' + (this.state.showSection ? ' openArrowHolder' : '')}>
                {(arrowType === 'dark') ? <img src={`${routes.images}/AddArticle/DarkTriangle.svg`} /> : <img src={`${routes.images}/AddArticle/Triangle.svg`} />}
              </span>
              <span>{title}</span>
            </div>
            {this.addButton()}
          </div>
        </div>

        {this.state.showSection &&
          <div className='body'>
            {this.props.children}
          </div>
        }
      </div>
    )
  }
}