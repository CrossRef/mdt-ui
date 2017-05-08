import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ModalCard from '../ModalCard'

import client from '../../client'
import fetch from '../../utilities/fetch'
const languages = require('../ModalCard/language.json')
import { stateTrackerII } from 'my_decorators'

export default class AddPublicationCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showURLError: false,
      showURLEmptyError: false,
      showTitleError: false,
      showTitleEmptyError: false,
      showISSNError: false,
      showISSNEmptyError: false,
      showDOIError: false,
      showDOIEmptyError: false,
      showDOIInvalidError: false,
      title: '',
      abbreviation: '',
      DOI: '',
      url: '',
      printISSN: '',
      electISSN: '',
      language: '',
      archivelocation: ''
    }
  }

  componentDidMount () {
    const child = this.refs.child
  }

  checkDupeDOI (callback) {
    return Promise.resolve(fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${this.state.DOI}`, { headers: client.headers })
      .then(data => callback(data.status === 200))
    )
  }

  getLanguages () {
    var lgOpt = [
      <option key='-1' />,
      ...languages.map((language, i) => (<option key={i} value={language.abbr}>{language.name}</option>))
    ]

    return (
      <select onChange={this.handleLanguageChange.bind(this)}>
        {lgOpt}
      </select>
    )
  }

  validateURL () {
    var re = /^(ftp|http|https):\/\/[^ "]+$/
    return re.test(this.state.url)
  }

  validateDOI () {
    var re = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i
    return re.test(this.state.DOI)
  }

  validation () {
    var errorCnt = 0
    this.setState({
      showURLError: false,
      showURLEmptyError: false,
      showTitleError: false,
      showTitleEmptyError: false,
      showISSNError: false,
      showISSNEmptyError: false,
      showDOIError: false,
      showDOIEmptyError: false,
      showDOIInvalidError: false
    })

    return this.checkDupeDOI((isDupe) => {
      const errorStates = {
        showTitleEmptyError: (this.state.title.length <= 0),
        showISSNEmptyError: (this.state.electISSN.length <= 0),
        showURLEmptyError: (this.state.url.length <= 0),
        showURLError: !this.validateURL() && (this.state.url.length > 0),
        showDOIEmptyError: (this.state.DOI.length <= 0),
        showDOIInvalidError: !this.validateDOI() && (this.state.DOI.length > 0),
        showDOIError: isDupe
      }

      this.setState(errorStates)
      for (var key in errorStates) { // checking all the properties of errorStates to see if there is a true
        if (errorStates[key]) {
            return errorStates[key]
          }
      }
    })
  }

  onSubmit (e) {
    e.preventDefault()

    this.validation().then((errors) => {
      if (!errors) { // false = no errors
        this.props.onAddPublication({
          message: {
            'title': {'title': this.state.title},
            'doi': this.state.DOI,
            'type': 'Publication',
            'mdt-version': '0',
            'status': 'draft',
            'content': '<Journal xmlns="http://www.crossref.org/xschema/1.1"><journal_metadata language="' + this.state.language + '"><full_title>' + this.state.title + '</full_title><abbrev_title>' + this.state.abbreviation + '</abbrev_title><issn media_type="print"></issn><issn media_type="electronic">' + this.state.electISSN + '</issn></journal_metadata><archive_locations><archive name="' + this.state.archivelocation + '"/></archive_locations></journal_metadata></Journal>',
            'contains': []
          }
        }).then(() =>
          fetch(`http://mdt.crossref.org/mdt/v1/work?doi=${this.state.DOI}`, { headers: client.headers })
          .then(doi => doi.json())
          .then((dois) => {
            this.setState({
              dois
            })

            this.closeModal()

            this.props.addDOIs([dois.message.doi])
          })
        )
      }
    })
  }

  handleTitleChange (e) {
    this.setState({
      title: e.target.value
    })
  }

  handleAbbreviationChange (e) {
    this.setState({
      abbreviation: e.target.value
    })
  }

  handleDOIChange (e) {
    this.setState({
      DOI: e.target.value
    })
  }

  handleURLChange (e) {
    this.setState({
      url: e.target.value
    })
  }

  handlePrintISSNChange (e) {
    this.setState({
      printISSN: e.target.value
    })
  }

  handleelectISSNChange (e) {
    this.setState({
      electISSN: e.target.value
    })
  }

  handleLanguageChange (e) {
    this.setState({
      language: e.target.value
    })
  }

  handleArchiveLocationChange (e) {
    this.setState({
      archivelocation: e.target.value
    })
  }

  closeModal () {
    this.setState({
      showURLError: false,
      showURLEmptyError: false,
      showTitleError: false,
      showISSNError: false,
      showISSNEmptyError: false,
      showDOIError: false,
      showDOIEmptyError: false,
      showDOIInvalidError: false,
      title: '',
      abbreviation: '',
      DOI: '',
      url: '',
      printISSN: '',
      electISSN: '',
      language: '',
      archivelocation: ''
    })
    this.child.handleCloseModal()
  }

  render () {
    return (
      <div className='addPublicationCard'>
        <div>
          <ModalCard
            cardtitle={'Create Journal Record'}
            buttonTitle={'New Publication'}
            buttonClassStyle={'addPublication'}
            onRef={ref => (this.child = ref)}
          >
            <form onSubmit={this.onSubmit.bind(this)} className='addPublications'>
              <div className='fieldRowHolder'>
                <div className={(this.state.showTitleEmptyError ? 'fieldinput invalid' : 'fieldinput')}>
                  <div className='left-indent-36'>Journal Title (Required)</div>
                  <div className='inputholder'>
                    <div className='inputinnerholder'>
                      <div className='required'><span>*</span></div>
                      <input
                        type='text'
                        name='title'
                        value={this.state.title}
                        onChange={this.handleTitleChange.bind(this)} />
                    </div>
                    {this.state.showTitleEmptyError && <div className='inputinnerholder'><div className='invalid'>Required. Please provide required information.</div></div>}
                  </div>
                </div>
                <div className={(this.state.showURLError || this.state.showURLEmptyError ? 'fieldinput invalid' : 'fieldinput')}>
                  <div className='left-indent-36'>Journal URL (Required)</div>
                  <div className='inputholder'>
                    <div className='inputinnerholder'>
                      <div className='required'><span>*</span></div>
                      <input
                        type='text'
                        name='url'
                        value={this.state.url}
                        onChange={this.handleURLChange.bind(this)} />
                    </div>
                    {this.state.showURLEmptyError && <div className='inputinnerholder'><div className='invalid'>Required. Please provide required information.</div></div>}
                    {this.state.showURLError && <div className='inputinnerholder'><div className='invalid'>Invalid URL. Please check your URL is correct.</div></div>}
                  </div>
                </div>
              </div>
              <div className='fieldRowHolder'>
                <div className='fieldinput'>
                  <div className='left-indent-36'>Journal Abbreviation</div>
                  <div className='inputholder'>
                    <div className='inputinnerholder'>
                      <div className='notrequired' />
                      <input
                        type='text'
                        name='abbreviation'
                        value={this.state.abbreviation}
                        onChange={this.handleAbbreviationChange.bind(this)} />
                    </div>
                  </div>
                </div>
                <div className={(this.state.showDOIError || this.state.showDOIInvalidError || this.state.showDOIEmptyError ? 'fieldinput invalid' : 'fieldinput')}>
                  <div className='left-indent-36'>Journal DOI</div>
                  <div className='inputholder'>
                    <div className='inputinnerholder'>
                      <div className='required'><span>*</span></div>
                      <input
                        type='text'
                        name='doi'
                        value={this.state.doi}
                        onChange={this.handleDOIChange.bind(this)} />
                    </div>
                    {this.state.showDOIError && <div className='inputinnerholder'><div className='invalid'>Duplicate DOI. Registering a new DOI? This one already exists.</div></div>}
                    {this.state.showDOIInvalidError && <div className='inputinnerholder'><div className='invalid'>Invalid DOI. Please check your DOI (10.xxxx/xx...).</div></div>}
                    {this.state.showDOIEmptyError && <div className='inputinnerholder'><div className='invalid'>Required. Please provide required information.</div></div>}
                  </div>
                </div>
              </div>
              <div className='fieldRowHolder'>
                <div className='fieldinput'>
                  <div className='left-indent-36'>Language</div>
                  <div className='inputholder'>
                    <div className='inputinnerholder'>
                      <div className='notrequired' />
                      {this.getLanguages()}
                    </div>
                  </div>
                </div>
                <div className={(this.state.showISSNError || this.state.showISSNEmptyError ? 'fieldinput invalid' : 'fieldinput')}>
                  <div className='left-indent-36'>ISSN (required)</div>
                  <div className='inputholder'>
                    <div className='inputinnerholder'>
                      <div className='required'><span>*</span></div>
                      <input
                        type='text'
                        name='electISSN'
                        value={this.state.electISSN}
                        onChange={this.handleelectISSNChange.bind(this)} />
                    </div>
                    {this.state.showISSNError && <div className='inputinnerholder'><div className='invalid'>Duplicate ISSN. Registering a new ISSN? This one already exists.</div></div>}
                    {this.state.showISSNEmptyError && <div className='inputinnerholder'><div className='invalid'>Required. Please provide required information.</div></div>}
                  </div>
                </div>
              </div>
              <div className='fieldRowHolder'>
                <div className='fieldinput'>
                  <div className='left-indent-36'>Archive Locations</div>
                  <div className='inputholder'>
                    <div className='inputinnerholder'>
                      <div className='notrequired' />
                      <select name='archivelocation'
                        onChange={this.handleArchiveLocationChange.bind(this)}
                      >
                        <option value='' />
                        <option value='CLOCKSS'>CLOCKSS</option>
                        <option value='LOCKSS'>LOCKSS</option>
                        <option value='Portico'>Portico</option>
                        <option value='Koninklijke Bibliotheek'>Koninklijke Bibliotheek</option>
                        <option values='Deep Web Technologies'>Deep Web Technologies</option>
                        <option values='Internet Archive'>Internet Archive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className='fieldRowHolder buttonholder'>
                <div className='fieldinput' />
                <div className='fieldinput'>
                  <input
                    onClick={this.closeModal.bind(this)}
                    className='button-anchor button-white-cancel'
                    value='Cancel'
                  />
                  <input
                    type='submit'
                    className='button-anchor'
                    value='Save' />
                </div>
              </div>
            </form>
          </ModalCard>
        </div>
      </div>
    )
  }
}
