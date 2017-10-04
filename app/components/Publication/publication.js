import React, { Component } from 'react'
import is from 'prop-types'
import { browserHistory } from 'react-router'
import {stateTrackerII} from 'my_decorators'

import Listing from './listing'
import Filter from './filter'
import ActionBar from './actionBar'
import TitleBar from './titleBar'
import AddIssueCard from '../addIssueCard'
import {routes} from  '../../routing'
import {compareDois} from '../../utilities/helpers'


export default class Publication extends Component {

  static propTypes = {
    cart: is.array.isRequired, //is cart required here?
    ownerPrefix: is.string.isRequired,
    search: is.object.isRequired,

    publication: is.shape({
      status: is.string.isRequired,
      'message-type': is.string.isRequired,
      'message-version': is.string.isRequired,
      message: is.object.isRequired
    }).isRequired,

    reduxControlModal: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,

    asyncDeleteRecord: is.func.isRequired,
    asyncGetPublications: is.func.isRequired,
    asyncSearchRecords: is.func.isRequired,
  }

  constructor (props) {
    super(props)
    this.state = {
      filterBy: 'all',
      selections: []
    }
  }

  handleAddToList = (item) => {
    const selections = this.state.selections;
    const newSelections = [...selections]
    for (let i in selections) {
      if (compareDois(item.article.doi, selections[i].article.doi)) return
    }
    item.article.pubDoi = this.props.publication.message.doi;
    newSelections.push(item);
    this.setState({selections: newSelections})
  }

  handleRemoveFromList = (item) => {
    var selections = this.state.selections
    const filteredSelections = selections.filter((selection)=>{
      return !compareDois(item.article.doi, selection.article.doi)
    })
    this.setState({
      selections: filteredSelections
    })
  }

  handleAddCart = () => {
    const selections = this.state.selections
    //Using an async loop because if there are multiple additions to cart, React batches them and doesn't show the toast for each one.
    const asyncLoop = (i) => {
      if (selections.length > i) {
        const cycle = new Promise ( resolve => {
          const inCart = this.props.cart.find( cartItem => compareDois(cartItem.doi, selections[i].article.doi))
          const isArticle = selections[i].article.type === 'article'
          if(isArticle && !inCart) {
            this.props.reduxCartUpdate(selections[i].article)
          }
          resolve(i+1)
        })
        cycle.then((nextIndex)=>{
          asyncLoop(nextIndex)
        })
      } else {
        this.setState({selections:[]});
      }
    }
    asyncLoop(0)
  }

  deleteSelections = () => {
    this.props.reduxControlModal({
      showModal: true,
      title: 'Remove Record',
      style: 'defaultModal',
      Component: this.DeleteConfirmModal,
      props: {
        confirm: () => {
          for(let i in this.state.selections){
            this.props.asyncDeleteRecord(this.state.selections[i].article)
          }
          this.props.reduxControlModal({showModal:false}) //Can also put this as a callback for asyncDeleteRecord, will affect whether the modal closes first then record dissapears or vice versa
          this.setState({selections:[]})
        },
        selections: this.state.selections
      }
    });
  }

  DeleteConfirmModal = ({confirm, selections, close}) => {

    const selectionNames = selections.reduce((accumulator, currentValue, index) => {
      const title = (currentValue && currentValue.article && currentValue.article.status === 'draft') ? currentValue.article.title.title : '';
      if(!accumulator && title) return title;
      if(accumulator && title) return accumulator + ', ' + title;
      else return accumulator
    }, '');

    return (
      <div className="actionModal">
        <div className="messageHolder">
          <h4>Do you want to remove the selected records? Record data in draft state will be deleted.</h4>
          <br/><br/>
          <p>{`- ${selectionNames ? selectionNames : 'No records in draft state'}`}</p>
        </div>
        <div className="buttonTable">
          <div className="tableRow">
            <div className="leftCell"></div>
            <div className="rightCell">
              <button className="leftButton" onClick={close}>Cancel</button>
              <button className="rightButton" onClick={confirm}>Remove</button>
            </div>
          </div>

        </div>
      </div>
    )
  }

  duplicateSelection = () => {
    if(this.state.selections[0].article.type === 'article') {
      const parentIssue = this.state.selections[0].article.issueDoi ? { parentIssue: this.state.selections[0].article.issueDoi } : {}
      browserHistory.push({
        pathname: `${routes.publications}/${encodeURIComponent(this.props.publication.message.doi)}/addarticle`,
        state: {
          duplicateFrom: this.state.selections[0].article.doi,
          ...parentIssue
        }
      })
    }
  }

  handleFilter = (type) => {
    this.setState({
      filterBy: type
    })
  }


  render () {
    console.log(this.state.selections)
    const { publication, asyncGetPublications, reduxControlModal, ownerPrefix } = this.props
    const contains = publication.message.contains || emptyArray
    const doi = publication.message.doi

    return (
      <div className='publication'>
        <Filter
          handleFilter={this.handleFilter.bind(this)}
        />

        <TitleBar
          publication={publication}
          search={this.props.search}
          ownerPrefix={ownerPrefix}
          cart={this.props.cart}

          reduxControlModal={this.props.reduxControlModal}
          reduxCartUpdate={this.props.reduxCartUpdate}

          asyncSearchRecords={this.props.asyncSearchRecords}
          asyncGetPublications={this.props.asyncGetPublications}/>

        <ActionBar
          ownerPrefix={ownerPrefix}
          doi={doi}
          selections={this.state.selections}
          publication={publication}

          handleAddCart={this.handleAddCart}
          deleteSelections={this.deleteSelections}
          duplicateSelection={this.duplicateSelection}

          reduxControlModal={reduxControlModal}
          reduxCartUpdate={this.props.reduxCartUpdate}

          asyncGetPublications={asyncGetPublications}/>

        <div className='publication-children'>
          {contains.length ?
            <Listing
              filterBy={this.state.filterBy}
              ownerPrefix={ownerPrefix}
              publication={publication}
              triggerModal={this.props.triggerModal}
              selections={this.state.selections}
              cart={this.props.cart}

              handleRemoveFromList={this.handleRemoveFromList}
              handleAddToList={this.handleAddToList}

              reduxControlModal={this.props.reduxControlModal}
              reduxCartUpdate={this.props.reduxCartUpdate}

              asyncGetPublications={asyncGetPublications}
            /> : <div className='empty-message'>No articles, please create one!</div>}
        </div>
      </div>
    )
  }
}



const emptyArray = [];
