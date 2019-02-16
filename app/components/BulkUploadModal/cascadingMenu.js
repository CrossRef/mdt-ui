import React, { Component } from 'react'
import is from 'prop-types'
var classNames = require('classnames')
export const shape = {
    id: is.string.isRequired,
    text: is.string.isRequired,
    link: is.string
  }
  shape.options= is.arrayOf(is.shape(shape))

export default class CascadingMenu extends Component {

      static propTypes = {
        options: is.arrayOf(
          is.shape(shape).isRequired
        ).isRequired
      }
   
      static defaultProps = {
        hasCaret: false,
        openDirection: 'left'
      }
    
      constructor(props) {
        super(props)
    
        this.state = {
          showDropdown: true,
          selectedIds: []
        }
      }
      
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.options !== nextProps.options
      || this.state.showDropdown !== nextState.showDropdown
      || this.state.selectedIds !== nextState.selectedIds
  }

  handleDropdownToggle = () => {
    let nextState = !this.state.showDropdown

    this.setState({
      showDropdown: nextState,
      selectedIds: []
    })
  }

  handleDropdownClose = () => {
    this.setState({
      showDropdown: false,
      selectedIds: []
    })
  }

  handleSelectedId = (selected, depthLevel) => {
    return () => {
      const updatedArray = this.state.selectedIds.slice(0)

      updatedArray[depthLevel] = selected

      this.setState({
        selectedIds: updatedArray
      })
    }
  }

  renderDisplay() {
    const classes = classNames({
            'dropdown__display': true, 
            'dropdown__display--with-caret': this.props.hasCaret
          }),
          caret = (<svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"
          className="dropdown__display">
         <path
             d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"/>
    </svg>
          )

    return (
      <div className={ classes }>
        { this.props.text }
        { this.props.hasCaret ? caret : null }
      </div>
    )
  }

  renderSubMenu(options, depthLevel = 0) {
    if (this.state.showDropdown !== true) {
      return null
    }

    const classes = ['dropdown__options']
    if (depthLevel>0){classes.push('dropdown--nested')}

    classes.push(`dropdown__options--${this.props.openDirection}-align`)
    
    const menuOptions = options.map(option => {
      const hasOptions = (option.options
                            && option.options.length > 0 )
      const expandCarret=(hasOptions?<span>></span>:'')
      const display   = (option.link
              ? <a href={ option.link }>{ option.text }</a>
              : <span>{ option.text }</span>
            )
          
      let subMenu
      const liClasses=[]

      if (this.state.selectedIds[depthLevel] === option.id)
      {
        liClasses.push('selected')
        // only render selected submenu and only if nested options exist
        if (hasOptions){
          const newDepthLevel = depthLevel + 1
          subMenu = this.renderSubMenu(option.options, newDepthLevel)
        }

      }


      return (
        <li className={classNames.apply(null,liClasses)}
          key={ option.id }
          onMouseEnter={ this.handleSelectedId(option.id, depthLevel) }
        >
          { display }{expandCarret}
          { subMenu }
        </li>
      )
    })

    return (
      <div className={ classNames.apply(null, classes) }>
        <ul>
          { menuOptions }
        </ul>
      </div>
    )
  }

  render () {
    return(
        <div className="cascadingMenu">
          
            { this.renderDisplay() }
            { this.renderSubMenu(this.props.options) }
          
        </div>
      )
  }
      

}
