import React, { Component } from 'react'
import is from 'prop-types'
import update from 'immutability-helper'
import _ from 'lodash'
import { browserHistory } from 'react-router'
import { stateTrackerII } from 'my_decorators'

import Listing from './listing'
import Filter from './filter'
import ActionBar from './actionBar'
import TitleBar from './titleBar'
import AddIssueCardRefactor from '../addIssueCardRefactor'
import objectSearch from '../../utilities/objectSearch'


export default class Publication extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    asyncDeleteRecord: is.func.isRequired,
    publication: is.shape({
      status: is.string.isRequired,
      'message-type': is.string.isRequired,
      'message-version': is.string.isRequired,
      message: is.object.isRequired
    }).isRequired,
    handle: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    fetchIssue: is.func.isRequired,
    postIssue: is.func.isRequired,
    cart: is.array.isRequired, //is cart required here?
    ownerPrefix: is.string.isRequired,
    asyncSearchRecords: is.func.isRequired,
    search: is.object.isRequired,
    asyncGetItem: is.func.isRequired,
  }

  constructor (props) {
    super(props)
    this.state = {
      filterBy: 'all',
      selections: []
    }
  }

  handleAddToList (item) {
    const selections = this.state.selections;
    const newSelections = [...selections]
    for (let i in selections) {
      if (item.article.doi.toLowerCase() === selections[i].article.doi.toLowerCase()) return;
    }
    item.article.pubDoi = this.props.publication.message.doi;
    newSelections.push(item);
    this.setState({selections: newSelections})
  }

  handleRemoveFromList(item) {
    var selections = this.state.selections
    const filteredSelections = selections.filter((selection)=>{
      return item.article.doi.toLowerCase() !== selection.article.doi.toLowerCase();
    })
    this.setState({
      selections: filteredSelections
    })
  }

  handleAddCart = () => {
    if(this.noneSelected()) return;
    const selections = this.state.selections;
    for(let i in selections){
      if(selections[i].article.type === 'article') this.props.reduxCartUpdate([this.state.selections[i].article])
    }
  }

  noneSelected = () => {
    if(!this.state.selections.length) {
      this.props.reduxControlModal({
        showModal:true,
        style:'defaultModal',
        title: 'Please make a selection',
        Component: ({close}) =>
          <div className="actionModal">
            <div className="messageHolder">
              <p>No records are selected.</p>
            </div>
            <div className="buttonHolder">
              <button onClick={close}>Ok</button>
            </div>
          </div>,
      }); return true;
    }
    else return false
  }

  deleteSelections = () => {
    if(this.noneSelected()) return;
    this.props.reduxControlModal({
      showModal: true,
      title: 'Remove Record',
      style: 'defaultModal',
      Component: DeleteConfirmModal,
      props: {
        confirm: () => {
          for(let i in this.state.selections){
            this.props.asyncDeleteRecord(this.state.selections[i].article.doi, this.props.publication.message.doi)
          }
          this.props.reduxControlModal({showModal:false}) //Can also put this as a callback for asyncDeleteRecord, will affect whether the modal closes first then record dissapears or vice versa
          this.setState({selections:[]})
        },
        selections: this.state.selections
      }
    });
  }

  duplicateSelection = () => {
    if(this.noneSelected()) return;

    if(this.state.selections.length > 1) return this.props.reduxControlModal({
      showModal: true,
      style: 'defaultModal',
      title: 'Please select one record to duplicate',
      Component: ({close}) =>
        <div className="actionModal">
          <div className="messageHolder">
            <p>You can only duplicate one record at a time. Please select only one record.</p>
          </div>
          <div className="buttonHolder">
            <button onClick={close}>Ok</button>
          </div>
        </div>
    })

    if(this.state.selections[0].article.type === 'article') browserHistory.push({
      pathname: `/publications/${encodeURIComponent(this.props.publication.message.doi)}/addarticle`,
      state: {
        duplicateFrom: this.state.selections[0].article.doi
      }
    })

    if(this.state.selections[0].article.type === 'issue') {
      this.props.reduxControlModal({
        showModal: true,
        title: 'Duplicate Issue/Volume',
        style: 'addIssueModal',
        Component: AddIssueCardRefactor,
        props: {
          mode: 'edit',
          issue: this.state.selections[0].article,
          publication: this.props.publication,
          handle: this.props.handle,
          fetchIssue: this.props.fetchIssue,
          postIssue: this.props.postIssue,
          ownerPrefix: this.props.ownerPrefix,
          duplicate: true
        }
      })
      this.setState({selections:[]})
    }
  }

  handleFilter = (type) => {
    this.setState({
      filterBy: type
    })
  }

  render () {
    const { publication, handle, reduxControlModal, ownerPrefix } = this.props
    const publicationMessage = publication.message || emptyObject
    const contains = publicationMessage.contains || emptyArray
    const doi = publicationMessage.doi
    return (
      <div className='publication'>
        <Filter
          handleFilter={this.handleFilter.bind(this)}
        />
        <TitleBar
          publicationMessage={publicationMessage}
          asyncSearchRecords={this.props.asyncSearchRecords}
          search={this.props.search} asyncGetItem={this.props.asyncGetItem}
          reduxControlModal={this.props.reduxControlModal}
          publication={publication}
          postIssue={this.props.postIssue}
          asyncGetPublications={this.props.handle}/>

        <ActionBar
          ownerPrefix={ownerPrefix}
          selections={this.state.selections}
          doi={doi}
          publication={publication}
          handle={handle}
          reduxControlModal={reduxControlModal}
          handleAddCart={this.handleAddCart}
          reduxCartUpdate={this.props.reduxCartUpdate}
          deleteSelections={this.deleteSelections}
          duplicateSelection={this.duplicateSelection}
          postIssue={this.props.postIssue} />
        <div className='publication-children'>
          {contains.length ?
            <Listing
              filterBy={this.state.filterBy}
              ownerPrefix={ownerPrefix}
              reduxControlModal={this.props.reduxControlModal}
              handle={this.props.handle}
              publication={publication}
              publicationDoi={doi}
              publicationMessage={publicationMessage}
              reduxCartUpdate={this.props.reduxCartUpdate}
              handleRemoveFromList={this.handleRemoveFromList.bind(this)}
              handleAddToList={this.handleAddToList.bind(this)}
              fetchIssue={this.props.fetchIssue}
              postIssue={this.props.postIssue}
              triggerModal={this.props.triggerModal}
              selections={this.state.selections}
            /> : <div className='empty-message'>No articles, please create one!</div>}
        </div>
      </div>
    )
  }
}


function DeleteConfirmModal ({confirm, selections, close}) {

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


const emptyObject = {};
const emptyArray = [];
