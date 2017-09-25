import React, { Component } from 'react'
import is from 'prop-types'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { connect } from 'react-redux'


import {routes} from '../routing'
import {xmldoc} from '../utilities/helpers'
import { controlModal, submitPublication } from '../actions/application'
import AddPublicationCard from '../components/addPublicationCard'



const mapStateToProps = (state, props) => ({
  publication: state.publications[props.doi] || state.publications[props.doi.toLowerCase()],
  crossmarkPrefixes: state.login['crossmark-prefixes']
})

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxControlModal: controlModal,
  asyncSubmitPublication: submitPublication
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class PublicationCardContainer extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    asyncSubmitPublication: is.func.isRequired,
    doi: is.string.isRequired,
    publication: is.object,
    crossmarkPrefixes: is.array.isRequired
  }

  constructor() {
    super();
    const backgrounds = [
      `${routes.images}/Publications/PublicationButtonArtLarge_Publication Art 1.svg`,
      `${routes.images}/Publications/PublicationButtonArtLarge_Publication Art 2.svg`,
      `${routes.images}/Publications/PublicationButtonArtLarge_Publication Art 3.svg`,
    ]
    const backgroundIndex = (Math.floor(Math.random() * backgrounds.length) % backgrounds.length)
    const background = backgrounds[backgroundIndex];
    this.state = { mouseOver: false, overEdit: false, background }
  }

  openEditPublicationModal = () => {
    const publication = this.props.publication;
    if(!publication) return console.error(`${this.props.doi} is not fetching from server`);
    const parsedXMLContent = xmldoc(publication.message.content)
    const savedMetaData = {
      ...parsedXMLContent, 'mdt-version': publication.message['mdt-version']
    };

    this.props.reduxControlModal({
      showModal:true,
      title:'Edit Journal Record',
      Component: AddPublicationCard,
      props:{
        ...savedMetaData,
        asyncSubmitPublication: this.props.asyncSubmitPublication,
        crossmarkPrefixes: this.props.crossmarkPrefixes
      }
    })
  }

  renderLoadingCard = () => ({
    message: {
      type: '',
      doi: this.props.doi,
      title: {title:`loading...`},
    }
  })

  render () {
    const publication = this.props.publication || this.renderLoadingCard();
    const publicationContents = publication.message;
    const type = publicationContents.type;
    const title = publicationContents.title.title
    const style = this.state.mouseOver ? { backgroundColor: '#3f4746' } : {
      background: `url('${this.state.background}') no-repeat center center`,
      backgroundSize: 'contain'
    };
    const whiteText = this.state.mouseOver ? { color: 'white' } : null;
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


