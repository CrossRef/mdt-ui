import React, { Component } from 'react'
import is from 'prop-types'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getPublications, controlModal, cartUpdate, clearCart, deleteRecord, searchRecords, firstLogin, moveArticles } from '../actions/application'
import Listing from '../components/Publication/listing'
import Filter from '../components/Publication/filter'
import ActionBar from '../components/Publication/actionBar'
import TitleBar from '../components/Publication/titleBar'
import TourModal from '../components/Publication/tourModal'
import DeleteConfirmModal from '../components/Publication/deleteConfirmModal'
import MoveSelectionModal from '../components/Publication/moveSelectionModal'
import TransferTitleModal from '../components/Publication/transferTitleModal'
import BulkUpdateModal from '../components/Publication/bulkUpdateModal'
import {routes} from  '../routing'
import {compareDois, errorHandler} from '../utilities/helpers'
import AddIssueModal from './addIssueModal';
import BulkUpdateResultModal from '../components/Publication/bulkUpdateResultModal';





const mapStateToProps = (state, props) => ({
  publication: state.publications[props.routeParams.pubDoi] || state.publications[props.routeParams.pubDoi.toLowerCase()],
  cart: state.cart,
  search: state.search,
  firstLogin: state.login.firstLogin
})

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxControlModal: controlModal,
  reduxCartUpdate: cartUpdate,
  reduxClearCart: clearCart,
  reduxFirstLogin: firstLogin,

  asyncGetPublications: getPublications,
  asyncDeleteRecord: deleteRecord,
  asyncSearchRecords: searchRecords,
  asyncMoveArticles: moveArticles
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class PublicationPage extends Component {

  static propTypes = {
    search: is.object.isRequired,
    publication: is.object,
    routeParams: is.shape({
      pubDoi: is.string.isRequired,
      issueId: is.string
    }).isRequired,
    location: is.shape({
      query: is.shape({
        modal: is.string
      })
    }),
    firstLogin: is.bool,

    reduxControlModal: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    reduxClearCart: is.func.isRequired,
    reduxFirstLogin: is.func.isRequired,

    asyncGetPublications: is.func.isRequired,
    asyncSearchRecords: is.func.isRequired,
    asyncDeleteRecord: is.func.isRequired,
  }

  constructor (props) {
    super ()
    this.state = {
      doi: props.routeParams.pubDoi.toLowerCase(),
      serverError: null,
      filterBy: 'all',
      selections: [],
      allNotInCart:false,
      ownerPrefix:''
    }
  }


  componentDidMount () {
    this.props.asyncGetPublications(this.props.routeParams.pubDoi)
      .catch( e => {
        errorHandler(`Error retrieving or reading publication (${this.props.routeParams.pubDoi}): ${e.toString()}`, e)
        this.setState({serverError: e.toString()})
      }).then(() =>  {
        this.setState({
          ownerPrefix: this.props.publication.message['owner-prefix']
        })
      })

    if(this.props.firstLogin) {
      this.showTour()
    }
  }


  componentWillReceiveProps (nextProps) {
    if(nextProps.firstLogin && !this.props.firstLogin) {
      this.showTour()
    }
  }


  showTour = () => {
    this.props.reduxControlModal({
      showModal: true,
      title: '',
      style: 'tourModal',
      Component: TourModal
    })
    this.props.reduxFirstLogin(false)
  }


  handleAddToList = (item) => {
    const selections = this.state.selections;
    const newSelections = [...selections]
    for (let i in selections) {
      if (compareDois(item.doi, selections[i].doi) && JSON.stringify(item.title) === JSON.stringify(selections[i].title)) {
        return
      }
    }
    var itemInCart = this.props.cart.find( cartItem => compareDois(cartItem.doi, item.doi)) 
    item.pubDoi = this.state.doi
    newSelections.push(item);
    // adding an item should not turn off deposit option, but only turns on if it's not already in the cart
    this.setState({selections: newSelections,
    allNotInCart: !itemInCart||this.state.allNotInCart})
  }


  handleRemoveFromList = (item) => {
    var selections = this.state.selections
    const filteredSelections = selections.filter((selection)=>{
      return !compareDois(item.doi, selection.doi) || JSON.stringify(item.title) !== JSON.stringify(selection.title)
    })
    var itemInCart
    // check the selection list if it has at least 1 item not in the cart
    for(let i in filteredSelections){
      itemInCart = this.props.cart.find( cartItem => compareDois(cartItem.doi, filteredSelections[i].doi))
      if(!itemInCart){break}
     }
    
    this.setState({
      selections: filteredSelections,      
      allNotInCart: !itemInCart})
    
  }


  handleAddCart = () => {
    const selections = this.state.selections

    //Using an async loop because if there are multiple additions to cart, React batches them and doesn't show the toast for each one.
    const asyncLoop = (i) => {
      if (selections.length > i) {
        const cycle = new Promise ( resolve => {

          const isArticle = selections[i].type === 'article'
          if(isArticle) {
            const inCart = this.props.cart.find( cartItem => compareDois(cartItem.doi, selections[i].doi))

            if(!inCart) {
              this.props.reduxCartUpdate(selections[i])
            }
          }

          resolve(i+1)
        })

        cycle.then((nextIndex)=>{
          asyncLoop(nextIndex)
        })
      } else {
        this.setState({selections:[],
          allNotInCart:false})
      }
    }
    asyncLoop(0)
  }


  deleteSelections = () => {
    this.props.reduxControlModal({
      showModal: true,
      title: 'Remove record',
      style: 'warningModal',
      Component: DeleteConfirmModal,
      props: {
        confirm: () => {
          for(let i in this.state.selections){
            this.props.asyncDeleteRecord(this.state.selections[i])
          }
          this.props.reduxControlModal({showModal:false})
          this.setState({selections:[],
            allNotInCart:false})
        },
        selections: this.state.selections
      }
    })
  }


  duplicateSelection = () => {
    const selection = this.state.selections[0]
    if(selection.type === 'article') {

      const parentIssue = selection.issueDoi || selection.issueTitle ? {
        dupIssueDoi: selection.issueDoi,
        dupIssueTitle: JSON.stringify(selection.issueTitle)
      } : {}

      browserHistory.push({
        pathname: `${routes.publications}/${encodeURIComponent(this.state.doi)}/addarticle`,
        state: {
          duplicateFrom: this.state.selections[0].doi,
          ...parentIssue
        }
      })
    }
  }


  moveSelection = () => {
    this.props.reduxControlModal({
      showModal: true,
      title: 'Move to issue',
      style: 'defaultModal',
      Component: MoveSelectionModal,
      props: {
        confirm: async (issueTargetId) => {
          const issue = this.props.publication.normalizedRecords[issueTargetId]

          await this.props.asyncMoveArticles(this.state.selections, issue, this.props.routeParams.pubDoi)

          this.props.reduxControlModal({showModal:false})
          this.setState({selections:[],
            allNotInCart:false})
        },

        issues: this.props.publication.normalizedRecords.findAll( record => record.type === 'issue' )
      }
    });
  }


  addIssue = () => {
    this.props.reduxControlModal({
      showModal: true,
      title: 'Create new issue/volume',
      style: 'addIssueModal',
      Component: AddIssueModal,
      props: {
        pubDoi: this.state.doi
      }
    })
  }


  newArticle = () =>
      browserHistory.push(`${routes.publications}/${encodeURIComponent(this.state.doi)}/addarticle`)


  transferTitle = () => {
    this.props.reduxControlModal({
      showModal: true,
      title: 'Transfer title',
      style: 'transferTitleModal',
      Component: TransferTitleModal,
      props: {
        publicationTitle: this.props.publication.message.title.title,
        pubDoi: this.state.doi,
        ownerPrefix: this.state.ownerPrefix
      }
    })
  }
  bulkUpdate = () => {
    this.props.reduxControlModal({
      showModal: true,
      title: <div>Bulk update  <small> <small>(Resource deposit)</small></small></div> ,
      style: 'bulkUpdateModal',
      Component: BulkUpdateModal,
      props: {
        publicationTitle: this.props.publication.message.title.title,
        ownerPrefix: this.state.ownerPrefix,
        resultModal: this.bulkUpdateResult
      }
    })
  }
  bulkUpdateResult = (msg,filename) => {
    this.props.reduxControlModal({
      showModal: true,
      title: <div>Bulk update successful</div> ,
      style: 'bulkUpdateResultModal',
      Component: BulkUpdateResultModal,
      props: {        
        result: msg,
        uploadedFile:filename
      }
    })
  }

  handleFilter = (type) => {
    this.setState({
      filterBy: type
    })
  }


  render () {

    const { publication } = this.props
    const contains = (publication && publication.message && publication.message.contains) || []
    const {doi, ownerPrefix} = this.state

    return (
      <div>
        {this.props.publication && !this.state.serverError
          ? <div className='publication'>
              <Filter
                handleFilter={this.handleFilter}
              />

              <TitleBar
                publication={publication}
                search={this.props.search}
                ownerPrefix={ownerPrefix}
                cart={this.props.cart}
                reduxControlModal={this.props.reduxControlModal}
                reduxCartUpdate={this.props.reduxCartUpdate}
                asyncSearchRecords={this.props.asyncSearchRecords}/>

              <ActionBar
                selections={this.state.selections}
                newArticle={this.newArticle}
                addIssue={this.addIssue}
                transferTitle={this.transferTitle}
                bulkUpdate={this.bulkUpdate}
                handleAddCart={this.handleAddCart}
                deleteSelections={this.deleteSelections}
                duplicateSelection={this.duplicateSelection}
                moveSelection={this.moveSelection}
                newToCart={this.state.allNotInCart}/>

              <div className='publication-children'>
                {contains.length
                  ? <Listing
                      filterBy={this.state.filterBy}
                      publication={publication}
                      triggerModal={this.props.location.query && this.props.location.query.modal}
                      selections={this.state.selections}
                      cart={this.props.cart}
                      handleRemoveFromList={this.handleRemoveFromList}
                      handleAddToList={this.handleAddToList}
                      reduxControlModal={this.props.reduxControlModal}
                      reduxCartUpdate={this.props.reduxCartUpdate}/>

                  : <div className='empty-message'>No articles, please create one!</div>}
              </div>
            </div>

          : <div>
              <br/><br/><br/> {/*TEMPORARY STYLING, SHOULD USE CSS*/}
              {this.state.serverError
                ? <div>Sorry, this DOI ({doi}) is not retrieving valid Publication data. <br/><br/> Error: {this.state.serverError} </div>
                : <div>Loading...</div>
              }
            </div>
        }
      </div>
    )
  }
}
