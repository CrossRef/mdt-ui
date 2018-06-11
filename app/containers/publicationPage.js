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
import {routes} from  '../routing'
import {compareDois, errorHandler} from '../utilities/helpers'
import AddIssueModal from './addIssueModal';





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
      ownerPrefix: props.routeParams.pubDoi.split('/')[0],
      serverError: null,
      filterBy: 'all',
      selections: []
    }
  }


  componentDidMount () {
    this.props.asyncGetPublications(this.props.routeParams.pubDoi)
      .catch( e => {
        errorHandler(`Error retrieving or reading publication (${this.props.routeParams.pubDoi}): ${e.toString()}`, e)
        this.setState({serverError: e.toString()})
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
    item.pubDoi = this.state.doi
    newSelections.push(item);
    this.setState({selections: newSelections})
  }


  handleRemoveFromList = (item) => {
    var selections = this.state.selections
    const filteredSelections = selections.filter((selection)=>{
      return !compareDois(item.doi, selection.doi) || JSON.stringify(item.title) !== JSON.stringify(selection.title)
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
        this.setState({selections:[]})
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
          this.setState({selections:[]})
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
          this.setState({selections:[]})
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
        pubDoi: this.state.doi
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
                handleAddCart={this.handleAddCart}
                deleteSelections={this.deleteSelections}
                duplicateSelection={this.duplicateSelection}
                moveSelection={this.moveSelection}/>

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
