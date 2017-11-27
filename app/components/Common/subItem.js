import React, { Component } from 'react'
import is from 'prop-types'

import {routes} from '../../routing'


export default class SubItem extends Component {

  static propTypes = {
    title: is.string.isRequired,
    boundSetState: is.func.isRequired,
    freetolicense: is.string,
    showSection: is.bool.isRequired,
    optionalIssueInfoHandlers: is.func,
    addHandler: is.func,
    CrossmarkAddButton: is.func,
    arrowType: is.string,
    deferredTooltipBubbleRefresh: is.object,
    openSubItems: is.bool
  }


  constructor (props) {
    super()
    this.state = {
      showSection: props.showSection || !!props.simCheckError || false
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.openSubItems) {
      this.setState({
        showSection: nextProps.showSection || false
      })
    }
  }


  toggle = () => {
    this.setState({
      showSection: !this.state.showSection
    })
    this.props.boundSetState({}) //This just forces a re-render of the whole page so that tooltips update position
  }


  addButton = () => {
    if(this.props.addHandler || this.props.optionalIssueInfoHandlers) {
      return (
        <div className='addholder'>
          <hr/>
          <a className="addNewButton" onClick={()=>{
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
    }
  }


  render () {
    const { title, addHandler, arrowType } = this.props
    let subItemErrorIndicator = null
    let children = Array.isArray(this.props.children) ? [...this.props.children] : this.props.children

    if(this.props.children[0] && this.props.children[0].type.name === 'ErrorIndicator') {
      const ErrorIndicator = this.props.children[0]
      subItemErrorIndicator = React.cloneElement(ErrorIndicator, {openSubItem: this.toggle, subItemIndex: "0"})
      children.shift()
      children = children.map((child)=>{
        if(Array.isArray(child)) {
          return child.map((anotherChild)=>{
            return React.cloneElement(anotherChild, {ErrorIndicator: ErrorIndicator})
          })
        } else {
          return child
        }
      })
    }

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
          </div>
          {!this.state.showSection && subItemErrorIndicator}
        </div>

        {this.state.showSection &&
          <div className='body'>
            {children}
            {this.addButton()}
          </div>
        }
      </div>
    )
  }
}