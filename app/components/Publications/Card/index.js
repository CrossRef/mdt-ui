import React, { Component } from 'react'
import { Link } from 'react-router'

const backgrounds = [
  '/images/Publications/PublicationButtonArtLarge_Publication Art 1.svg',
  '/images/Publications/PublicationButtonArtLarge_Publication Art 2.svg',
  '/images/Publications/PublicationButtonArtLarge_Publication Art 3.svg',
]

import { stateTrackerII } from 'my_decorators'


export default class PublicationCard extends Component {

  constructor(props) {
    super();
    this.state = { mouseOver: false, overEdit: false }
  }

  render () {
    const publicationContents = this.props.doi.message
    const { type, doi } = publicationContents || {};

    const title = publicationContents.title.title
    const backgroundIndex = (Math.floor(Math.random() * backgrounds.length) % backgrounds.length)
    const background = backgrounds[backgroundIndex]
    const style = this.state.mouseOver ? { backgroundColor: '#3f4746' } : {
      background: `url('${background}') no-repeat center center`,
      backgroundSize: 'contain'
    };
    const whiteText = this.state.mouseOver ? { color: 'white' } : null;
    return (
      <Link to={this.state.overEdit ? null: `/publications/${encodeURIComponent(doi)}`} className='publication-card'>
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
            onClick={()=> this.props.editSelection(this.props.doi)} 
            className='publication-edit'
            >Edit
          </button>}
        </div>
      </Link>
    )
  }
}