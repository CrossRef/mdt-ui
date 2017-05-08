import React, { Component } from 'react'
import Contributor from './Contributor'
import Funding from './Funding'
import License from './License'
import RelatedItems from './RelatedItems'
import AdditionalInformation from './AdditionalInformation'
import OptionalIssueInformation from './OptionalIssueInformation'
import { stateTrackerII } from 'my_decorators'


export default class SubtItem extends Component {
  constructor (props) {
    super(props)
    const { incomingData } = this.props
    this.state = {
      showSection: false,
      incomingData: incomingData
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
        incomingData: nextProps.incomingData
    })
  }

  toggle () {
    this.setState({
        showSection: !this.state.showSection
    })
  }

  render () {
    const { remove, handler, title, addHandler, addable, arrowType } = this.props
    var incomingData = this.state.incomingData
    // Map through the todos
    if (addable) {
        var Nodes = incomingData.map((data, i) => {
        var card = ''
        switch (title) {
            case 'Contributor':
            card = <Contributor
                    key={i}
                    contributor={data}
                    remove={remove}
                    handler={handler}
                    index={i} />
            break
            case 'Funding':
            const { addGrant, removeGrant, grantHandler } = this.props
            card = <Funding
                    key={i}
                    funding={data}
                    remove={remove}
                    handler={handler}
                    index={i}
                    grantNumbers={data.grantNumbers}
                    addGrant={addGrant}
                    removeGrant={removeGrant}
                    grantHandler={grantHandler} />
            break
            case 'License':
            const { makeDateDropDown } = this.props
            card = <License
                    key={i}
                    license={data}
                    remove={remove}
                    handler={handler}
                    index={i}
                    makeDateDropDown={makeDateDropDown} />
            break
            case 'Related Items':
            card = <RelatedItems
                    key={i}
                    relateditem={data}
                    remove={remove}
                    handler={handler}
                    index={i} />
            break
            case 'Optional Issue Information (Contributorship)':
            card = <OptionalIssueInformation
                    key={i}
                    optionalIssueInfo={data}
                    remove={remove}
                    handler={handler}
                    index={i} />
            break

        }
        return (card)
      })
    } else {
       var Nodes = <AdditionalInformation
                      addInfo={incomingData}
                      handler={handler} />
    }
    return (
      <div>
        <div className='topbar'>
          <div className='titleholder'>
            <div className={'titleinnholder' + (addable ? ' subinnerholder' : ' notclickableholder')} onClick={this.toggle.bind(this)}>
              <span className={'arrowHolder' + (this.state.showSection ? ' openArrowHolder' : '')}>
                {(arrowType === 'dark') ? <img src="/images/AddArticle/DarkTriangle.svg" /> : <img src="/images/AddArticle/Triangle.svg" />}
              </span>
              <span>{title}{addable}</span>
            </div>
            {addable &&
             <div className='addholder'>
               <a onClick={()=>{
                 if (!this.state.showSection) {
                   this.toggle()
                 }
                 addHandler()
                 }}>Add New</a>
             </div>}
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
