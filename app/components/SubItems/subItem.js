import React, { Component } from 'react'
import is from 'prop-types'
import { stateTrackerII } from 'my_decorators'

import Contributor from './Contributor'
import Funding from './Funding'
import License from './License'
import RelatedItems from './RelatedItems'
import AdditionalInformation from './AdditionalInformation'
import OptionalIssueInformation from './OptionalIssueInformation'
import { CrossmarkCards, CrossmarkAddButton } from './Crossmark/crossmark'
import {routes} from '../../routing'
import {refreshErrorBubble} from '../../utilities/helpers'



export default class SubtItem extends Component {

  static propTypes = {
    showCards: is.object
  }


  constructor (props) {
    super(props)
    let loadedCrossmark = false;
    if(props.title === 'Crossmark') {
      loadedCrossmark = (props.title === 'Crossmark' && props.showCards.firstLoad)
      delete props.showCards.firstLoad;
    }
    this.state = {
      showSection: props.showSection || loadedCrossmark || !!this.props.simCheckError || this.props.freetoread,
      crossmarkButtons: false,
      crossmarkCards: loadedCrossmark ? props.showCards : {},
      freeToReadSwitchedOn: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const freeToReadSwitchedOn = !!(nextProps.freetoread && !this.props.freetoread)
    this.setState({
      showSection: freeToReadSwitchedOn || (nextProps.validating ? nextProps.showSection || !!this.props.freetoread : this.state.showSection),
      freeToReadSwitchedOn: freeToReadSwitchedOn
    })
  }

  toggle = () => {
    this.setState({
        showSection: !this.state.showSection
    })
  }

  toggleCrossmarkAddList = () => {
    this.setState({
      crossmarkButtons: !this.state.crossmarkButtons
    })
  }

  addCrossmarkCard = (selection) => {
    this.setState({ crossmarkCards: {...this.state.crossmarkCards, [selection]: true } })
  }

  removeCrossmarkCard = (selection) => {
    const newState = {...this.state.crossmarkCards};
    delete newState[selection];
    this.props.reduxDeleteCard([selection]);
    this.setState({ crossmarkCards: newState });
  }

  componentDidUpdate () {
    refreshErrorBubble()
  }

  render () {
    const { remove, handler, title, addHandler, addable, arrowType, makeDateDropDown, incomingData } = this.props
    // Map through the todos
    let Nodes;
    if (addable && title !== 'Crossmark') {
      Nodes = incomingData.map((data, i) => {
        var card = ''
        switch (title) {
          case 'Contributor':
            card = <Contributor
              validating={this.props.validating}
              key={i}
              contributor={data}
              remove={remove}
              handler={handler}
              data={incomingData}
              index={i}/>
            break
          case 'Funding':
            const {addGrant, removeGrant, grantHandler} = this.props
            card = <Funding
              key={i}
              funding={data}
              remove={remove}
              handler={handler}
              data={incomingData}
              index={i}
              grantNumbers={data.grantNumbers}
              addGrant={addGrant}
              removeGrant={removeGrant}
              grantHandler={grantHandler}/>
            break
          case 'License':
            const { freetoread } = this.props;
            const { freeToReadSwitchedOn } = this.state;
            card = <License
                    key={i}
                    license={data}
                    remove={remove}
                    handler={handler}
                    data={incomingData}
                    index={i}
                    {...(i===0 ? {freetoread} : {})}
                    {...(i===0 ? {freeToReadSwitchedOn} : {})}
                    makeDateDropDown={makeDateDropDown}/>

            break
          case 'Related Items':
            card = <RelatedItems
              key={i}
              relateditem={data}
              remove={remove}
              handler={handler}
              data={incomingData}
              index={i}/>
            break
          case 'Optional Issue Information (Contributorship)':
            card = <OptionalIssueInformation
              key={i}
              optionalIssueInfo={data}
              remove={remove}
              handler={handler}
              data={incomingData}
              errors={this.props.errors}
              index={i}/>
            break
        }
        return (card)
      })

    } else if (title==='Crossmark') {
      Nodes =
        <CrossmarkCards
          removeCrossmarkCard={this.removeCrossmarkCard} crossmarkCards={this.state.crossmarkCards}/>

    } else {
       Nodes = <AdditionalInformation
                      addInfo={incomingData}
                      data={incomingData}
                      simCheckError={this.props.simCheckError}
                      handler={handler} />
    }
    return (
      <div>
        <div className='topbar'>
          <div className='titleholder'>
            <div className={'titleinnholder' + (addable ? ' subinnerholder' : ' notclickableholder')} onClick={this.toggle.bind(this)}>
              <span className={'arrowHolder' + (this.state.showSection ? ' openArrowHolder' : '')}>
                {(arrowType === 'dark') ? <img src={`${routes.images}/AddArticle/DarkTriangle.svg`} /> : <img src={`${routes.images}/AddArticle/Triangle.svg`} />}
              </span>
              <span>{title}{addable}</span>
            </div>
            {addable && title !== 'Crossmark' &&
              <div className='addholder'>
                <a onClick={()=>{
                  if (!this.state.showSection) {
                    this.toggle()
                  }
                  addHandler()
                }}>Add New</a>
              </div>}
            {title === 'Crossmark' &&
              <CrossmarkAddButton
                toggle={this.toggle}
                toggleAdd={this.toggleCrossmarkAddList}
                showSection={this.state.showSection}
                addList={this.state.crossmarkButtons}
                addCrossmarkCard={this.addCrossmarkCard}
              />}
          </div>
        </div>
        {this.state.showSection &&
         <div className='body'>
           {Nodes}
           {this.state.freeToReadSwitchedOn = false}
         </div>}
      </div>
    )
  }
}
