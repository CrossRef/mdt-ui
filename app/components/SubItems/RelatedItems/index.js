import React, { Component } from 'react'
import { stateTrackerII } from 'my_decorators'
import update from 'immutability-helper'

const RelationTypes = require('../../../utilities/relationTypes.json')
const IdentifierTypes = require('../../../utilities/identifierTypes.json')


export default class RelatedItems extends Component {
  constructor (props) {
    super(props)
    const {index} = this.props
    this.state = {
      showSubItem: index === 0 ? true : false,
    }
  }

  toggle = () => {
      this.setState({
        showSubItem: !this.state.showSubItem
      })
  }

  displayRelationTypes () {
      var relationTypes = [
        <option key='-1'></option>,
        ...RelationTypes.map((relationType, i) => (<option key={i} value={relationType.name}>{relationType.value}</option>))
      ]

      return (
          <select
            className='height32'
            type='text'
            ref='relationType'
            onChange={this.handleRelatedItems}
            value={this.props.relateditem.relationType}
            >
            {relationTypes}
          </select>
      )
  }

  displayIdentifierTypes () {
      var identifierTypes = [
        <option key='-1'></option>,
        ...IdentifierTypes.map((identifierType, i) => (<option key={i} value={identifierType.name}>{identifierType.value}</option>))
      ]

      return (
          <select
            className='height32'
            type='text'
            ref='identifierType'
            onChange={this.handleRelatedItems}
            value={this.props.relateditem.identifierType}
            >
            {identifierTypes}
          </select>
      )
  }

    handleRelatedItems = () => {
        var relatedItems = {}
        for(var i in this.refs){
          if(this.refs[i]){
            relatedItems[i] = this.refs[i].value
          }
        }

        this.props.handler({ // this situation, state did NOT update immediately to see change, must pass in a call back
          relatedItems: update(this.props.data, {[this.props.index]: {$set: relatedItems }})
        })
    }

  render () {
    return (
        <div>
            <div className='row subItemRow' onClick={this.toggle}>
                <div className='subItemHeader subItemTitle'>
                    <span className={'arrowHolder' + (this.state.showSubItem ? ' openArrowHolder' : '')}>
                        <img src="'images/AddArticle/DarkTriangle.svg" />
                    </span>
                    <span>Relation {this.props.index + 1}</span>
                </div>
                {this.props.index > 0 &&
                    <div className='subItemHeader subItemButton'>
                        <a onClick={() => {this.props.remove(this.props.index)}}>Remove</a>
                    </div>
                }
            </div>
            {this.state.showSubItem &&
                <div>
                    <div className='row'>
                        <div className='fieldHolder'>
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>Related Item Identifier</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className='requiredholder norequire'>
                                        <div className='required height32'>
                                        </div>
                                    </div>
                                    <div className='field'>
                                        <input
                                            className='height32'
                                            type='text'
                                            ref='relatedItemIdentifier'
                                            onChange={this.handleRelatedItems}
                                            value={this.props.relateditem.relatedItemIdentifier}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>Identifier Type</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className='requiredholder norequire'>
                                        <div className='required height32'>
                                        </div>
                                    </div>
                                    <div className='field'>
                                        {this.displayIdentifierTypes()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='errorHolder'>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='fieldHolder'>
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>Description</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className='requiredholder norequire'>
                                        <div className='required height32'>
                                        </div>
                                    </div>
                                    <div className='field'>
                                        <input
                                            className='height32'
                                            type='text'
                                            ref='description'
                                            onChange={this.handleRelatedItems}
                                            value={this.props.relateditem.description}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='fieldinnerholder halflength'>
                                <div className='labelholder'>
                                    <div></div>
                                    <div className='labelinnerholder'>
                                        <div className='label'>Relation Type</div>
                                    </div>
                                </div>
                                <div className='requrefieldholder'>
                                    <div className='requiredholder norequire'>
                                        <div className='required height32'>
                                        </div>
                                    </div>
                                    <div className='field'>
                                        {this.displayRelationTypes()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='errorHolder'>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
  }
}
