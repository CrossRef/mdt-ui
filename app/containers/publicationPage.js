import React, { Component } from 'react'
import is from 'prop-types'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getPublications, controlModal, cartUpdate, clearCart, deleteRecord, searchRecords } from '../actions/application'
import Listing from '../components/Publication/listing'
import Filter from '../components/Publication/filter'
import ActionBar from '../components/Publication/actionBar'
import TitleBar from '../components/Publication/titleBar'
import {routes} from  '../routing'
import {compareDois} from '../utilities/helpers'




const mapStateToProps = (state, props) => ({
  publication: state.publications[props.routeParams.pubDoi] || state.publications[props.routeParams.pubDoi.toLowerCase()],
  cart: state.cart,
  search: state.search
})

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxControlModal: controlModal,
  reduxCartUpdate: cartUpdate,
  reduxClearCart: clearCart,

  asyncGetPublications: getPublications,
  asyncDeleteRecord: deleteRecord,
  asyncSearchRecords: searchRecords,
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

    reduxControlModal: is.func.isRequired,

    asyncGetPublications: is.func.isRequired,
    asyncSearchRecords: is.func.isRequired,
    asyncDeleteRecord: is.func.isRequired,
  }

  constructor (props) {
    super ()
    this.state = {
      doi: props.routeParams.pubDoi,
      ownerPrefix: props.routeParams.pubDoi.split('/')[0],
      serverError: null,
      filterBy: 'all',
      selections: []
    }
  }


  componentDidMount () {
    this.props.asyncGetPublications(this.props.routeParams.pubDoi, undefined, error => {
      this.setState({ serverError: error })
    })
  }

  handleAddToList = (item) => {
    const selections = this.state.selections;
    const newSelections = [...selections]
    for (let i in selections) {
      if (compareDois(item.article.doi, selections[i].article.doi) && JSON.stringify(item.article.title) === JSON.stringify(selections[i].article.title)) {
        return
      }
    }
    item.article.pubDoi = this.props.publication.message.doi;
    newSelections.push(item);
    this.setState({selections: newSelections})
  }

  handleRemoveFromList = (item) => {
    var selections = this.state.selections
    const filteredSelections = selections.filter((selection)=>{
      return !compareDois(item.article.doi, selection.article.doi) || JSON.stringify(item.article.title) !== JSON.stringify(selection.article.title)
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
      const parentIssue = this.state.selections[0].article.issueDoi ? { issueDoi: this.state.selections[0].article.issueDoi } : {}
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
    const { publication, reduxControlModal } = this.props
    const contains = (publication && publication.message && publication.message.contains) || []
    const {doi, ownerPrefix} = this.state

    return (
      <div>
        {this.props.publication ?
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

              asyncSearchRecords={this.props.asyncSearchRecords}/>

            <ActionBar
              ownerPrefix={ownerPrefix}
              doi={doi}
              selections={this.state.selections}
              publication={publication}

              handleAddCart={this.handleAddCart}
              deleteSelections={this.deleteSelections}
              duplicateSelection={this.duplicateSelection}

              reduxControlModal={reduxControlModal}
              reduxCartUpdate={this.props.reduxCartUpdate}/>

            <div className='publication-children'>
              {contains.length ?
                <Listing
                  filterBy={this.state.filterBy}
                  ownerPrefix={ownerPrefix}
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
        :
          <div>
            <br/><br/><br/> {/*TEMPORARY STYLING, SHOULD USE CSS*/}
            {this.state.serverError ?
              <div>Sorry, this DOI ({doi}) is not retrieving a publication... <br/><br/> Error: {this.state.serverError} </div>
              : <div>Loading...</div>
            }
          </div>
        }
      </div>
    )
  }
}
