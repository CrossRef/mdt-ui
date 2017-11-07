import React from 'react'
import is from 'prop-types'

import {routes} from '../../routing'


export default class TourModal extends React.Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired
  }

  state = {slide: 1}

  nextSlide = () => {
    if(this.state.slide === 5) {
      return this.props.reduxControlModal({showModal:false})
    } else {
      this.setState({slide: this.state.slide + 1})
    }
  }

  render () {
    return (
      <div>
        <div className={`slideButton-${this.state.slide}`} onClick={this.nextSlide}> </div>
        <img src={`${routes.images}/Modal/tutorial_image-${this.state.slide}.png`}/>
      </div>
    )
  }


}