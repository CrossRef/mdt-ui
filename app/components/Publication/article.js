import React, { Component } from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import is from 'prop-types'
import * as api from '../../actions/api'
import {routes} from '../../routing'


export default class Article extends Component {
  static propTypes = {
    record: is.object.isRequired,
    selections: is.array.isRequired,
    issue: is.string,

    handleRemoveFromList: is.func.isRequired,
    handleAddToList: is.func.isRequired
  }
constructor(){
  super()
  this.state = {showUrl:false}

}
  toggleCheckBox (e) {
    const { record } = this.props
    if(e.currentTarget.checked) {
      const selection = this.props.issueDoi || this.props.issueTitle ? {...record, issueDoi: this.props.issueDoi, issueTitle: this.props.issueTitle} : record
      this.props.handleAddToList({ article: selection })
    } else {
      this.props.handleRemoveFromList({ article: record })
    }
  }
  componentDidMount = async()=>{
    let {  status,doi } = this.props.record
    var showUrl = !(status==='Failed')
    if (showUrl) {   
    await api.getItem(doi, true).catch(e => {showUrl=false})     
    }
    this.setState({showUrl: showUrl})
  }
  render() {
    let { title, status, type, date, doi } = this.props.record
    const publicationDoi = this.props.publication.message.doi
    const issueDoi = this.props.issueDoi
    const issueTitle = this.props.issueTitle
    date = moment(date || undefined).format('MMM Do YYYY')
    title = title.title
    if(title.length > 35) {
      title = title.substring(0, 35) + '...'
    }
   const showUrl=this.state.showUrl
    const url = showUrl?(doi && doi.length > 25) ? `https://doi.org/${doi.substr(0,25)}...` : (doi ? `https://doi.org/${doi}` : ''):''

    
    const checked = !this.props.selections.length ? {checked:false} : {}

    return (<tr className={status}>
      <td className='checkbox'><label><input type='checkbox' onClick={this.toggleCheckBox.bind(this)} {...checked} /><span>&nbsp;</span></label></td>
      <td className='title'>
        {issueDoi || issueTitle ?
          <Link className='pull-left add-record' to={`${routes.publications}/${encodeURIComponent(publicationDoi)}/${encodeURIComponent(issueDoi || JSON.stringify(issueTitle))}/addarticle/${encodeURIComponent(doi)}`}>{title}</Link>
          :
          <Link className='pull-left add-record' to={`${routes.publications}/${encodeURIComponent(publicationDoi)}/addarticle/${encodeURIComponent(doi)}`}>{title}</Link>
        }
      </td>
      <td className='date'>{date}</td>
      <td className='type'>{type}</td>
      <td className='status'>{status}</td>
      <td className='url'>{url && <a target='_blank' href={url}>{url}</a>}</td>
    </tr>)
  }
}
