import React, { Component } from 'react'
import is from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { stateTrackerII } from 'my_decorators'

import client from '../client'
import fetch from '../utilities/fetch'
const languages = require('../utilities/language.json')



export default class AddPublicationCard extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,
    asyncSubmitPublication: is.func.isRequired,
    crossmarkAuth: is.bool.isRequired,
    reduxAddDOIs: is.func,
    reduxStorePublications: is.func,

    Journal: is.shape({
      journal_metadata: is.object.isRequired
    }),

    searchResult: is.shape({
      doi: is.string.isRequired,
      issns: is.array.isRequired,
      prefix: is.string.isRequired,
      publicationId: is.node,
      title: is.string
    })
  };

  constructor(props) {
    super();

    if(props.Journal) {
      const data = props.Journal.journal_metadata;
      const archive = props.Journal.archive_locations ? props.Journal.archive_locations.archive : {};
      let version = Number(props['mdt-version'])+1;
      const doi_data = data.doi_data || {};
      this.state = {
        'mdt-version': version.toString(),
        title: data.full_title,
        abbreviation: data.abbrev_title,
        printISSN: (data.issn || {})['#text'],
        electISSN: ((data.issn || {})[1] || data.issn || {})['#text'],
        url: doi_data.resource,
        DOI: doi_data.doi,
        language: data['-language'],
        archivelocation: archive['-name'],
        crossmarkDoi: '',
        ...inactiveErrors
      }
    }
    else if (props.searchResult) {
      const data = props.searchResult;
      let pissn, eissn;
      if(Array.isArray(data.issns)) {
        data.issns.forEach(issn => {
          if(issn.type === 'pissn') pissn = issn.issn;
          if(issn.type === 'eissn') eissn = issn.issn;
        })
      }
      this.state = {
        'mdt-version': '1',
        title: data.title,
        abbreviation: '',
        DOI: data.prefix,
        url: '',
        printISSN: pissn,
        electISSN: eissn,
        language: '',
        archivelocation: '',
        crossmarkDoi: '',
        ...inactiveErrors
      }
    }
    else this.state = {
      title: '',
      abbreviation: '',
      DOI: '',
      url: '',
      printISSN: '',
      electISSN: '',
      language: '',
      archivelocation: '',
      crossmarkDoi: '',
      ...inactiveErrors
    }
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
      <select name='language' onChange={this.inputHandler} value={this.state.language}>
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

  onSubmit = (e) => {
    e.preventDefault();
    if(this.state['mdt-version']) {return this.saveEdit()};
    this.validation().then((errors) => {
      if (!errors) { // false = no errors
        this.props.asyncSubmitPublication(this.state, publication => {
          this.props.reduxAddDOIs(publication.message.doi);
          this.props.reduxControlModal({showModal:false})
        })
      }
    })
  }

  saveEdit () {
    this.props.asyncSubmitPublication(this.state, publication => {
      if(this.props.searchResult) this.props.reduxAddDOIs(publication.message.doi);
      this.props.reduxControlModal({showModal:false})
    })
  }

  inputHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  closeModal = () => {
    this.props.reduxControlModal({showModal:false})
  }

  render () {

    const isSearch = this.props.searchResult ? true : false;
    const isEdit = (this.state['mdt-version'] && !isSearch) ? true : false;
    const disabledInput = isEdit ? {disabled: true} : {};

    return (
      <div className='addPublicationCard'>
        <form onSubmit={this.onSubmit} className='addPublications'>
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
                    onChange={this.inputHandler} />
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
                    onChange={this.inputHandler} />
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
                    onChange={this.inputHandler} />
                </div>
              </div>
            </div>
            <div className={(this.state.showDOIError || this.state.showDOIInvalidError || this.state.showDOIEmptyError ? 'fieldinput invalid' : 'fieldinput')}>
              <div className='left-indent-36'>Journal DOI</div>
              <div className='inputholder'>
                <div className='inputinnerholder'>
                  <div className={ isEdit ? 'notrequired' : 'required'}>{!isEdit && <span>*</span>}</div>
                  <input
                    {...disabledInput}
                    type='text'
                    name='DOI'
                    value={this.state.DOI}
                    onChange={this.inputHandler} />
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
                    onChange={this.inputHandler} />
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
                  <select name='archivelocation' value={this.state.archivelocation}
                    onChange={this.inputHandler}
                  >
                    <option value='' />
                    <option value='CLOCKSS'>CLOCKSS</option>
                    <option value='LOCKSS'>LOCKSS</option>
                    <option value='Portico'>Portico</option>
                    <option value='Koninklijke Bibliotheek'>Koninklijke Bibliotheek</option>
                    <option value='Deep Web Technologies'>Deep Web Technologies</option>
                    <option value='Internet Archive'>Internet Archive</option>
                  </select>
                </div>
              </div>
            </div>
            {this.props.crossmarkAuth &&
              <div className='fieldinput'>
                <div className='left-indent-36'>Crossmark Policy Page DOI</div>
                <div className='inputholder'>
                  <div className='inputinnerholder'>
                    <input
                      type='text'
                      name='crossmarkDoi'
                      value={this.state.crossmarkDoi}
                      onChange={this.inputHandler}/>
                  </div>
                </div>
              </div>}
          </div>
          <div className='fieldRowHolder buttonholder'>
            <div className='fieldinput' />
            <div className='fieldinput'>
              <input
                onClick={this.closeModal}
                className='button-anchor button-white-cancel'
              />
              <input
                type='submit'
                className='button-anchor'
              />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

const inactiveErrors = {
  showURLError: false,
  showURLEmptyError: false,
  showTitleError: false,
  showTitleEmptyError: false,
  showISSNError: false,
  showISSNEmptyError: false,
  showDOIError: false,
  showDOIEmptyError: false,
  showDOIInvalidError: false,
}