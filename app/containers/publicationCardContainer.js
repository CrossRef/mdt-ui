import React, { Component } from 'react'
import is from 'prop-types'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { stateTrackerII, updateReporterII } from 'my_decorators'
import ObjTree from 'xml-objtree'
const objTree = new ObjTree;

import { controlModal, storePublications, submitPublication } from '../actions/application'
import AddPublication from '../components/Modal/AddPublication'



const mapStateToProps = (state, props) => ({
  publication: state.publications[props.doi]
})

const mapDispatchToProps = dispatch => bindActionCreators({
  reduxStorePublications: storePublications,
  reduxControlModal: controlModal,
  asyncSubmitPublication: submitPublication
}, dispatch)


@connect(mapStateToProps, mapDispatchToProps)
export default class PublicationCardContainer extends Component {
  
  static propTypes = {
    reduxStorePublications: is.func.isRequired,
    reduxControlModal: is.func.isRequired,
    asyncSubmitPublication: is.func.isRequired,
    doi: is.string.isRequired,
    publication: is.object,
  }

  constructor() {
    super();
    const backgroundIndex = (Math.floor(Math.random() * backgrounds.length) % backgrounds.length)
    const background = backgrounds[backgroundIndex];
    this.state = { mouseOver: false, overEdit: false, background }
  }
  
  openEditPublicationModal = () => {
    const publication = this.props.publication;
    if(!publication) return console.error(`${this.props.doi} is not fetching from server`);
    const parsedXMLContent = objTree.parseXML(publication.message.content)
    const savedMetaData = {
      ...parsedXMLContent, 'mdt-version': publication.message['mdt-version']
    };

    this.props.reduxControlModal({
      showModal:true, 
      title:'Edit Journal Record',
      Component: AddPublication,
      props:{
        ...savedMetaData, 
        reduxStorePublications: this.props.reduxStorePublications,
        asyncSubmitPublication: this.props.asyncSubmitPublication
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
      <Link to={this.state.overEdit ? null : `/publications/${encodeURIComponent(this.props.doi)}`} className='publication-card'>
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

const backgrounds = [
  '/images/Publications/PublicationButtonArtLarge_Publication Art 1.svg',
  '/images/Publications/PublicationButtonArtLarge_Publication Art 2.svg',
  '/images/Publications/PublicationButtonArtLarge_Publication Art 3.svg',
];

