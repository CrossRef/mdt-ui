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



export default class SubtItem extends Component {

  static propTypes = {
    showCards: is.object
  }


  constructor (props) {
    super(props)
    this.state = {
      showSection: false,
      crossmarkButtons: false,
      crossmarkCards: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    const apiReturnedFirstTime = nextProps.apiReturned !== this.props.apiReturned;

    this.setState({
        showSection: apiReturnedFirstTime ? nextProps.showSection : this.state.showSection,
        crossmarkCards: Object.keys(this.state.crossmarkCards).length ? this.state.crossmarkCards : (nextProps.showCards || emptyObject)
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
    this.setState({ crossmarkCards: newState })
  }

  componentDidUpdate () {
    this.props.positionErrorBubble();
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
              key={i}
              contributor={data}
              remove={remove}
              handler={handler}
              data={incomingData}
              errorContributorLastName={this.props.errorContributorLastName}
              positionErrorBubble={this.props.positionErrorBubble}
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
              positionErrorBubble={this.props.positionErrorBubble}
              grantHandler={grantHandler}/>
            break
            case 'License':
            const { freetoread, errorLicenseStartDate, errorLicenseUrlInvalid } = this.props
            card = <License
                    key={i}
                    license={data}
                    remove={remove}
                    handler={handler}
                    data={incomingData}
                    index={i}
                    freetoread={freetoread}
                    errorLicenseStartDate={errorLicenseStartDate}
                    errorLicenseUrlInvalid={errorLicenseUrlInvalid}
                    makeDateDropDown={makeDateDropDown}
                    positionErrorBubble={this.props.positionErrorBubble}/>

            break
          case 'Related Items':
            card = <RelatedItems
              key={i}
              relateditem={data}
              remove={remove}
              handler={handler}
              data={incomingData}
              positionErrorBubble={this.props.positionErrorBubble}
              index={i}/>
            break
          case 'Optional Issue Information (Contributorship)':
            card = <OptionalIssueInformation
              key={i}
              optionalIssueInfo={data}
              remove={remove}
              handler={handler}
              data={incomingData}
              index={i}/>
            break
        }
        return (card)
      })

    } else if (title==='Crossmark') {
      Nodes =
        <CrossmarkCards
          removeCrossmarkCard={this.removeCrossmarkCard} crossmarkCards={this.state.crossmarkCards} errors={this.props.crossmarkErrors}/>

    } else {
       Nodes = <AdditionalInformation
                      addInfo={incomingData}
                      data={incomingData}
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
         </div>}
      </div>
    )
  }
}

const emptyObject = {};
