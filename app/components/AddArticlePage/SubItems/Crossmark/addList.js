import React from 'react'
import is from 'prop-types'




export default class AddList extends React.Component {

  static propTypes = {
    addList: is.array.isRequired,
    addCrossmarkCard: is.func.isRequired,
    toggle: is.func.isRequired
  }


  componentDidMount () {
    document.addEventListener('click', this.handleClick, false)
  }


  handleClick = (e) => {
    if(!this.node.contains(e.target)) {
      this.props.toggle()
    }
  }


  componentWillUnmount () {
    document.removeEventListener('click', this.handleClick, false)
  }


  render () {
    return (
      <div className='crossmarkAddList' ref={ ref => this.node = ref }>
        {this.props.addList.map((value, index) =>
          <a className='crossmark' onClick={()=>this.props.addCrossmarkCard(value)} key={index}>{value}</a>
        )}
      </div>
    )
  }
}
