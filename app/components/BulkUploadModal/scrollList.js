import React from 'react'
import is from 'prop-types'

import {routes} from '../../routing'

export default class ScrollList extends React.Component {
    static propTypes = {
        id:is.string.isRequired,
        handleSelectedId:is.func.isRequired,
        handleClick:is.func.isRequired
    }
    render() {
        <li className="mimeScroll"
          key={ this.props.id }
          onClick={this.handleClick(option,depthLevel)}   
          onMouseEnter={ this.handleSelectedId(option.id, depthLevel) }
          onClick={this.handleClick(option,depthLevel)}           
        >


        </li>
    }
}