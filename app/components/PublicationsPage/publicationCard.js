import React, { Component } from 'react'
import is from 'prop-types'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { connect } from 'react-redux'


import {routes} from '../../routing'
import {xmldoc} from '../../utilities/helpers'
import { controlModal, submitPublication, cartUpdate, getPublications } from '../../actions/application'
import AddPublicationModal from '../../containers/addPublicationModal'



const mapStateToProps = (state, props) => ({
  publication: state.publications[props.doi] || state.publications[props.doi.toLowerCase()],
  crossmarkPrefixes: state.login['crossmark-prefixes']
})

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxControlModal: controlModal,
  reduxCartUpdate: cartUpdate,
  asyncSubmitPublication: submitPublication,
  asyncGetPublications: getPublications
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class PublicationCardContainer extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    reduxCartUpdate: is.func.isRequired,
    asyncSubmitPublication: is.func.isRequired,
    asyncGetPublications: is.func.isRequired,
    doi: is.string.isRequired,
    publication: is.object,
    crossmarkPrefixes: is.array.isRequired,
    buttonCount: is.number.isRequired
  }

  constructor(props) {
    super();

    const background = `${routes.images}/Publications/Journal-Button-1_Journal Button - ${props.buttonCount}.svg`
    this.state = { mouseOver: false, overEdit: false, background }
  }


  openEditPublicationModal = () => {
    const publication = this.props.publication
    if(!publication) {
      return console.error(`${this.props.doi} is not fetching from server`)
    }

    const parsedXMLContent = publication.message.content ? xmldoc(publication.message.content) : {}

    const savedMetaData = {
      ...parsedXMLContent,
      'mdt-version': publication.message['mdt-version'],
      state: publication.message.state || {}
    }

    this.props.reduxControlModal({
      showModal:true,
      title:'Edit journal record',
      Component: AddPublicationModal,
      props:{
        mode: 'edit',
        doi: this.props.publication.message.doi,        
        crossmarkDoi:publication.message['crossmark-policy-doi'],
        title: do { try { this.props.publication.message.title.title } catch(e){}} || '',
        ...savedMetaData
      }
    })
  }


  render () {
    const publication = this.props.publication

    if(!publication) {
      return null
    }

    const publicationContents = publication.message
    const type = publicationContents.type
    const title = publicationContents.title.title
    const style = this.state.mouseOver
      ? { backgroundColor: '#4f5858' }
      : {
          background: `url('${this.state.background}') no-repeat center center`,
          backgroundSize: 'contain'
        }
    const whiteText = this.state.mouseOver ? { color: 'white' } : null
    return (
      <Link to={this.state.overEdit ? null : `${routes.publications}/${encodeURIComponent(this.props.doi)}`} className='publication-card'>
        <div className='card'
          style={style}
          onMouseOver={()=> this.setState({mouseOver:true})}
          onMouseLeave={()=> this.setState({mouseOver:false})}
        >
          <div style={whiteText} className='publication-type'>{type}</div>
          <div style={whiteText} className='publication-name'>{title}</div>
          {this.state.mouseOver && <button
            onMouseOver={()=> this.setState({overEdit:true})}
            onMouseLeave={()=> this.setState({overEdit:false})}
            onClick={this.openEditPublicationModal}
            className='publication-edit'
            >Edit
          </button>}
        </div>
      </Link>
    )
  }
}


