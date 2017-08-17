import React, { Component } from 'react'
import is from 'prop-types'
import update from 'immutability-helper'
import _ from 'lodash'
import Switch from 'react-toggle-switch'
import $ from 'jquery'

import {makeDateDropDown} from  '../utilities/date'
import SubItem from './SubItems/subItem'
import checkDupeDOI from '../utilities/dupeDOI'
import isDOI from '../utilities/isDOI'
import isURL from '../utilities/isURL'
import xmldoc from '../utilities/xmldoc'
import JSesc from '../utilities/jsesc'
import objectSearch from '../utilities/objectSearch'
import { displayArchiveLocations } from '../utilities/archiveLocations'
import { getIssueXml } from '../utilities/xmlGenerator'
import {routes} from '../routing'
import {stateTrackerII} from 'my_decorators'



const defaultState = {
  showIssueDoiReq: false,
  showHelper: false,
  on: false,
  error: false,
  version: '1',
  errors: {
    issueUrl: false,
    printDateYear: false,
    onlineDateYear: false,
    invalidissueurl: false,
    dupeissuedoi: false,
    invalidissuedoi: false,
    issuedoi: false,
    volumeUrl: false,
    invalidvolumeurl: false,
    dupevolumedoi: false,
    invalidvolumedoi: false,
    volumedoi: false,
    dupeDois: false
  },
  issue: {
    issue: '',
    issueTitle: '',
    issueDoi: '',
    issueUrl: '',
    printDateYear: '',
    printDateMonth: '',
    printDateDay: '',
    onlineDateYear: '',
    onlineDateMonth: '',
    onlineDateDay: '',
    archiveLocation: '',
    specialIssueNumber: '',
    volume: '',
    volumeDoi: '',
    volumeUrl: ''
  },
  optionalIssueInfo: [{
    firstName: '',
    lastName: '',
    suffix: '',
    affiliation: '',
    orcid: '',
    alternativeName: '',
    role: ''
  }]
}


export default class AddIssueCard extends Component {

  static propTypes = {
    reduxControlModal: is.func.isRequired,

    asyncSubmitIssue: is.func.isRequired,
    asyncGetItem: is.func,
    asyncGetPublications: is.func.isRequired
  }

  constructor (props) {
    super(props);
    this.state = defaultState;
    this.state.issue.issueDoi = props.ownerPrefix + '/'
  }

  componentDidMount () {
    if(this.props.mode === 'edit') {
      const { doi } = this.props.issue
      this.props.asyncGetItem(doi).then((Publication) => {
        const message = Publication.message
        const Issue = message.contains[0]
        const version = Issue['mdt-version']

        const parsedIssue = xmldoc(Issue.content)
        const journal_issue = objectSearch(parsedIssue, 'journal_issue');
        const journal_volume = objectSearch(parsedIssue, 'journal_volume');

        if (journal_volume) {
          delete journal_issue['journal_volume'];
          var theVolume = objectSearch(journal_volume, 'volume') || '';
          var volumeDoiData = objectSearch(journal_volume, 'doi_data') || ''
          var volumeDoi = objectSearch(volumeDoiData, 'doi') || ''
          var volumeUrl = objectSearch(volumeDoiData, 'resource') || ''
        }

        const issueTitle = objectSearch(journal_issue, 'title') || ''
        const issue = objectSearch(journal_issue, 'issue') || ''
        const issueDoi = objectSearch(journal_issue, 'doi') || ''
        const issueUrl = objectSearch(journal_issue, 'resource') || ''
        const special_numbering = objectSearch(parsedIssue, 'special_numbering') || ''
        let publication_date = objectSearch(journal_issue, 'publication_date');

        if(!Array.isArray(publication_date)) publication_date = [publication_date]; //Code below wants array of values, but if we accept only 1 date, we get only 1 object, so we transform into array

        const onlinePubDate = _.find(publication_date, (pubDate) => {
          if (pubDate) {
            if (pubDate['-media_type'] === 'online') {
              return pubDate
            }
          }
        })

        const printPubDate = _.find(publication_date, (pubDate) => {
          if (pubDate) {
            if (pubDate['-media_type'] === 'print') {
              return pubDate
            }
          }
        })
        var printDateYear = ''
        var printDateMonth = ''
        var printDateDay = ''
        if (printPubDate) {
          printDateYear = printPubDate['year'] ? printPubDate['year'] : ''
          printDateMonth = printPubDate['month'] ? printPubDate['month'] : ''
          printDateDay = printPubDate['day'] ? printPubDate['day'] : ''
        }

        var onlineDateYear = ''
        var onlineDateMonth = ''
        var onlineDateDay = ''
        if (onlinePubDate) {
          onlineDateYear = onlinePubDate['year'] ? onlinePubDate['year'] : ''
          onlineDateMonth = onlinePubDate['month'] ? onlinePubDate['month'] : ''
          onlineDateDay = onlinePubDate['day'] ? onlinePubDate['day'] : ''
        }

        const archiveLocations = objectSearch(parsedIssue, 'archive_locations')
        var archive = ''
        if (archiveLocations) {
          archive = archiveLocations.archive['-name']
        }

        const setIssue = {
          issue: issue,
          issueTitle: issueTitle,
          issueDoi: this.props.duplicate ? this.props.ownerPrefix + '/' : issueDoi,
          issueUrl: this.props.duplicate ?  '' : issueUrl,
          printDateYear: printDateYear,
          printDateMonth: printDateMonth,
          printDateDay: printDateDay,
          onlineDateYear: onlineDateYear,
          onlineDateMonth: onlineDateMonth,
          onlineDateDay: onlineDateDay,
          archiveLocation: archive,
          specialIssueNumber: special_numbering,
          volume: theVolume || '',
          volumeDoi: volumeDoi || '',
          volumeUrl: volumeUrl || ''
        }

        // contributor loading
        const contributors = objectSearch(parsedIssue, 'contributors')
        var contributee = []
        // contributors are divied into 2 types
        // person_name and organization
        var person_name = undefined
        if (contributors) {
          person_name = objectSearch(contributors, 'person_name')

          if (person_name) { // if exist
            if (!Array.isArray(person_name)) {
              // there is ONE funder
              contributee.push(
                {
                  firstName: person_name.given_name ? person_name.given_name : '',
                  lastName: person_name.surname ? person_name.surname : '',
                  suffix: person_name.suffix ? person_name.suffix : '',
                  affiliation: person_name.affiliation ? person_name.affiliation : '',
                  orcid: person_name.ORCID ? person_name.ORCID : '',
                  alternativeName: person_name['alt-name'] ? person_name['alt-name'] : '',
                  role: person_name['-contributor_role'] ? person_name['-contributor_role'] : ''
                }
              )
            } else { // its an array
              _.each(person_name, (person) => {
                contributee.push(
                  {
                    firstName: person.given_name ? person.given_name : '',
                    lastName: person.surname ? person.surname : '',
                    suffix: person.suffix ? person.suffix : '',
                    affiliation: person.affiliation ? person.affiliation : '',
                    orcid: person.ORCID ? person.ORCID : '',
                    alternativeName: person['alt-name'] ? person['alt-name'] : '',
                    role: person['-contributor_role'] ? person['-contributor_role'] : ''
                  }
                )
              })
            }
          }
        }

        if (contributee.length <= 0) {
          contributee.push(
            {
              firstName: '',
              lastName: '',
              suffix: '',
              affiliation: '',
              orcid: '',
              role: '',
              alternativeName: ''
            }
          )
        }

        this.setState({
          version: version,
          issueDoiDisabled: true,
          volumeDoiDisabled: !!volumeDoi,
          issue:  update(this.state.issue, {$set: setIssue }),
          optionalIssueInfo: update(this.state.optionalIssueInfo, {$set: contributee })
        })
      })
    }
  }

  optionalIssueInfoHandler (index, OptIssueInfo) {
    var optIssueInfo = {}
    for(var i in OptIssueInfo.refs){
      if(OptIssueInfo.refs[i]){
        optIssueInfo[i] = OptIssueInfo.refs[i].value
      }
    }

    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
      optionalIssueInfo: update(this.state.optionalIssueInfo, {[index]: {$set: optIssueInfo }})
    })
  }

  addOptionalIssueInfo () {
    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
     optionalIssueInfo: update(this.state.optionalIssueInfo, {$push:
      [{
        firstName: '',
        lastName: '',
        suffix: '',
        affiliation: '',
        orcid: '',
        alternativeName: '',
        role: ''
      }]
     })
    })
  }

  removeOptionalIssueInfo (index) {
    this.setState({ // this situation, state did NOT update immediately to see change, must pass in a call back
      optionalIssueInfo: update(this.state.optionalIssueInfo, {$splice: [[index, 1]] })
    })
  }

  checkdate(yearfield,monthfield,dayfield){
    if (monthfield){
      if (monthfield>12 || monthfield < 1) return true;
    }
    if (!dayfield){
      return false;
    }
    // we have a year, month and day.
    var dayobj = new Date(yearfield, monthfield-1, dayfield)
    if ((dayobj.getMonth()+1!=monthfield)||(dayobj.getDate()!=dayfield)||(dayobj.getFullYear()!=yearfield))
      return true;
    return false;
  }

  handler = (e) => {
    const name = e.currentTarget.name.substr(e.currentTarget.name.indexOf('.') + 1, e.currentTarget.name.length-1)

    if (name === 'issueUrl') {
      (e.currentTarget.value.trim().length > 0) ? this.setState({showIssueDoiReq:true}) : this.setState({showIssueDoiReq:false})
    }

    this.setState({
      issue: update(this.state.issue, {[name]: {$set: e.currentTarget.value ? e.currentTarget.value : '' }})
    })
  }

  validation (callback) {
    var errorStates = {

      issue: false,
      issueUrl: false,
      printDateYear: false,
      onlineDateYear: false,
      onlineDateInvalid: false ,
      printDateInvalid: false ,
      invalidissueurl: false,
      dupeissuedoi: false,
      invalidissuedoi: false,
      issuedoi: false,
      volumeUrl: false,
      invalidvolumeurl: false,
      dupevolumedoi: false,
      invalidvolumedoi: false,
      volumedoi: false,
      dupeDois: false
    }
    this.setState({
      error: false,
      errors: errorStates
    })

    return checkDupeDOI([this.state.issue.issueDoi, this.state.issue.volumeDoi], (isDupe , isValid) => {

        var hasPrintYear = false, hasOnlineYear = false
        if ((this.state.issue.printDateYear.length > 0) || (this.state.issue.onlineDateYear.length > 0)) {
          //hasDate = true
          if ((this.state.issue.printDateYear.length > 0)) {
            hasPrintYear = true
          }
          if ((this.state.issue.onlineDateYear.length > 0)) {
            hasOnlineYear = true
          }
        }

        const issueDoiDisabled = this.state.issueDoiDisabled;
        const isNotValidIssueDoi = this.state.issue.issueDoi ? !isDOI(this.state.issue.issueDoi) : false;
        const validateOwnerPrefix = () => this.state.issue.issueDoi.split('/')[0] === this.props.ownerPrefix;

        errorStates = {
          issue: !this.state.issue.issue,
          issueUrl: !this.state.issue.issueUrl,
          printDateYear: !this.state.issue.printDateYear,
          printDateInvalid:this.state.issue.printDateYear ? this.checkdate(this.state.issue.printDateYear,this.state.issue.printDateMonth,this.state.issue.printDateDay): false,
         
          onlineDateYear: !this.state.issue.onlineDateYear,
          onlineDateInvalid:this.state.issue.onlineDateYear ? this.checkdate(this.state.issue.onlineDateYear,this.state.issue.onlineDateMonth,this.state.issue.onlineDateDay): false,
          invalidissueurl: this.state.issue.issueUrl ? !isURL(this.state.issue.issueUrl) : false,
          issuedoi: !this.state.issue.issueDoi,
          invalidissuedoi: isNotValidIssueDoi,
          invalidDoiPrefix: !isNotValidIssueDoi ? !validateOwnerPrefix() : false,
          dupeissuedoi: !issueDoiDisabled && !isNotValidIssueDoi && validateOwnerPrefix() ? isDupe[0] : false,
          dupeDois: this.state.issue.issueDoi === this.state.issue.volumeDoi
        }

        if (hasPrintYear) { // has print year, don't care if there is a online year
          errorStates.onlineDateYear = false
        }
        if (hasOnlineYear) { // has online year, don't care if there is a print year
          errorStates.printDateYear = false
        }

        if (this.state.issue.volume || this.state.issue.volumeDoi || this.state.issue.volumeUrl) {
          errorStates.volumeUrl = this.state.issue.volumeDoi && !this.state.issue.volumeUrl;
          errorStates.dupevolumedoi = (!this.state.volumeDoiDisabled && this.state.issue.volumeDoi) ? (isDupe[1] ? isDupe[1] : false) : false; // we only care IF there is a DOI
          errorStates.invalidvolumedoi = this.state.issue.volumeDoi && !isDOI(this.state.issue.volumeDoi); // we only care IF there is a DOI
          errorStates.invalidvolumeurl = this.state.issue.volumeUrl ? !isURL(this.state.issue.volumeUrl) : false;

        }



        this.setState({
          errors: errorStates
        }, ()=>{
          //var errors = ['issuedoi','invalidissuedoi','dupeissuedoi', 'issue', 'invalidDoiPrefix']  // These would be the essential errors to prevent submission

          for(var key in this.state.errors) { // checking all the properties of errors to see if there is a true
              if (this.state.errors[key]) {
                this.setState({error: true})
                //return (errors.indexOf(key) > -1) ? callback(false) : callback(true)  //Leaving this here in case we decide to validate against only essential errors, for now decided to validate all.

                return callback(false)
              }
          }
          return callback(true) // iterated the entire object, no true, returning valid
        })
    })
  }


  onSubmit = (e) => {
    e.preventDefault()

    this.validation((valid) => { // need it to be a callback because setting state does not happen right away
      if (valid) {
        const { publication, asyncSubmitIssue, asyncGetPublications, mode } = this.props;

        const issueXML = getIssueXml(this.state)

        let version = this.state.version

        if (mode === 'edit') {
          version = String(parseInt(this.state.version) + 1)
        }

        const title = JSesc(this.state.issue.issueTitle);
        const issue = JSesc(this.state.issue.issue);
        const volume = JSesc(this.state.issue.volume);

        const newRecord = {
          'title': {title, issue, volume},
          'date': new Date(),
          'doi': this.state.issue.issueDoi,
          'owner-prefix': this.state.issue.issueDoi.split('/')[0],
          'type': 'issue',
          'mdt-version': version,
          'status': 'draft',
          'content': issueXML.replace(/(\r\n|\n|\r)/gm,'')
        }

        publication.message.contains = [newRecord]
        asyncSubmitIssue(publication, () => {
          asyncGetPublications(publication.message.doi)
          this.setState({version: version})
          if (!this.state.error) {
            this.closeModal()
          }
        })
      }
    })
  }

  closeModal () {
    this.setState(defaultState);
    this.props.reduxControlModal({showModal:false})
  }


  componentDidUpdate() {
    var firstError = $(".fieldError").first()
    if (firstError.length > 0) {
      $('.fullError').find('.tooltips').css({
        'top': ((firstError.offset().top + (firstError.position().top - (firstError.position().top * .5)) - ($('.switchLicense').first().position().top + 15) - ($('.switchLicense').first().offset().top + 15))) + 15
      })
    }
  }


  render () {
    const { errors } = this.state;
    return (
      <div className='addIssueCard'>
        <div>
          <form onSubmit={this.onSubmit} className='addIssues'>
            <div className='articleInnerForm'>
              <div className='body'>
                <div className='row infohelper'>
                  <div className='errorHolder'>
                    <div className='switchOuterHolder'>
                        <div className='switchInnerHolder'>
                            <div className='switchLicense'>
                                <div className='switchLabel'><span>Show Help</span></div>
                                <Switch
                                    ref='showHelper'
                                    onClick={() => {
                                        this.setState({on: !this.state.on}, ()=>{
                                          this.setState({showHelper: this.state.on})
                                        })
                                    }}
                                    on={this.state.on}
                                />
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='fieldHolder'>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Issue</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder'>
                          <div className='required height32'>
                            <span>*</span>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className={`height32 ${errors.issue && 'fieldError'}`}
                              type='text'
                              name='issue.issue'
                              onChange={this.handler}
                              value={this.state.issue.issue}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Issue Title</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder norequire'>
                          <div className='required height32'>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className='height32'
                              type='text'
                              onChange={this.handler}
                              value={this.state.issue.issueTitle}
                              name='issue.issueTitle'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {(!this.state.error && this.state.showHelper) &&
                    <div className='errorHolder talltooltip helpers'>
                      <div className='toolTipHolder'>
                        <a className="tooltips">
                          <div className='toolmsgholder'>
                            <div className='errormsgholder'>
                              <div className='errormsginnerholder'>
                                <img src={`${routes.images}/AddArticle/Asset_Icons_White_Help.svg`} />
                                Please provide a Title that fully describes your Issue
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  }
                  {(this.state.error) &&
                    <div className='errorHolder talltooltip fullError'>
                      <div className='toolTipHolder'>
                        <a className="tooltips">
                          <div className='toolmsgholder'>
                            <div className='errormsgholder'>
                              <div className='errormsginnerholder'>
                                <div><img src={`${routes.images}/AddArticle/Asset_Icons_White_Help.svg`} /></div>
                                {(()=>{

                                  let requiredError = [];
                                  if(errors.issue) requiredError.push('Please provide an issue number.');
                                  if(errors.issuedoi) requiredError.push('Please provide required DOI.');
                                  if(errors.issueUrl) requiredError.push('Please provide required Issue URL.');
                                  if(errors.printDateYear || errors.onlineDateYear) requiredError.push('Please provide either a print or online date.');
                                  if(errors.volumeUrl) requiredError.push('Please provide required Volume URL.');
                                  if(requiredError.length) return (
                                    <div><b>Required.</b><br />{requiredError.length > 1 ? 'Please provide required information.' : requiredError[0]}</div>
                                  );
                                })()}
                                {errors.invalidissuedoi &&
                                  <div><b>Invalid Issue DOI.</b><br />Please check your issue DOI (10.xxxx/xx...).</div>
                                }
                                {errors.invalidDoiPrefix &&
                                <div><b>Invalid Issue DOI.</b><br />DOI prefix needs to match journal DOI prefix.</div>
                                }
                                {(errors.invalidissueurl) &&
                                  <div><b>Invalid URL.</b><br />Please check your URL.</div>
                                }
                                {(errors.dupeissuedoi) &&
                                  <div><b>Duplicate Issue DOI.</b><br />Registering a new DOI? This one already exists.</div>
                                }
                                {errors.invalidvolumedoi &&
                                  <div><b>Invalid Volume DOI.</b><br />Please check your volume DOI (10.xxxx/xx...).</div>
                                }
                                {(errors.dupevolumedoi) &&
                                  <div><b>Duplicate Volume DOI.</b><br />Registering a new DOI? This one already exists.</div>
                                }
                                {(errors.dupeDois) &&
                                  <div><b>Duplicate DOIs.</b><br />Issue and Volume DOIs cannot be the same.</div>
                                }
                                {errors.printDateInvalid &&
                                  <div><b>Invalid Print Date.</b><br />Please verify date.</div>
                                }
                                {errors.onlineDateInvalid &&
                                  <div><b>Invalid Online Date.</b><br />Please verify date.</div>
                                }
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  }
                </div>
                <div className='row'>
                  <div className='fieldHolder'>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Issue DOI (Required)</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder'>
                          <div className='required height32'>
                            <span>*</span>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className={`height32 ${(errors.issuedoi || errors.dupeissuedoi || errors.invalidissuedoi || errors.invalidDoiPrefix) && 'fieldError'} ${this.state.issueDoiDisabled && 'disabledDoi'}`}
                              type='text'
                              name='issue.issueDoi'
                              onChange={this.handler}
                              value={this.state.issue.issueDoi}
                              disabled={this.state.issueDoiDisabled && !this.props.duplicate}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Issue URL (Required)</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder'>
                          <div className='required height32'>
                            <span>*</span>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className={'height32' + ((errors.issueUrl || errors.invalidissueurl) ? ' fieldError': '')}
                              type='text'
                              name='issue.issueUrl'
                              value={this.state.issue.issueUrl}
                              onChange={this.handler}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='fieldHolder'>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Print Date</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className={'requiredholder' + (((this.state.issue.onlineDateYear ? this.state.issue.onlineDateYear : '').length === 0)? ' dateselectrequire':' norequire')}>
                          <div className='required height32'>
                            {((this.state.issue.onlineDateYear ? this.state.issue.onlineDateYear : '').length === 0 ? <span>*</span> : <span></span>)}
                          </div>
                        </div>
                        <div className='field'>
                          <div className='datepickerholder'>
                            <div className='dateselectholder'>
                              <div>Year {((this.state.issue.onlineDateYear ? this.state.issue.onlineDateYear : '').length === 0 ? '(*)' : '')}</div>
                              <div>{makeDateDropDown(this.handler, 'issue.printDateYear', 'y', this.state.issue.printDateYear, errors.printDateInvalid || errors.printDateYear)}</div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Month</div>
                              <div>
                                {makeDateDropDown(this.handler, 'issue.printDateMonth', 'm', this.state.issue.printDateMonth, errors.printDateInvalid)}
                              </div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Day</div>
                              <div>
                                {makeDateDropDown(this.handler, 'issue.printDateDay', 'd', this.state.issue.printDateDay, errors.printDateInvalid)}
                              </div>
                            </div>
                            <div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Online Date</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className={'requiredholder' + (((this.state.issue.printDateYear ? this.state.issue.printDateYear : '').length === 0)? ' dateselectrequire':' norequire')}>
                          <div className='required height32'>
                            {((this.state.issue.printDateYear ? this.state.issue.printDateYear : '').length === 0 ? <span>*</span> : <span></span>)}
                          </div>
                        </div>
                        <div className='field'>
                          <div className='datepickerholder'>
                            <div className='dateselectholder'>
                              <div>Year {((this.state.issue.printDateYear ? this.state.issue.printDateYear : '').length === 0 ? '(*)' : '')}</div>
                              <div>{makeDateDropDown(this.handler, 'issue.onlineDateYear', 'y', this.state.issue.onlineDateYear, errors.onlineDateInvalid || errors.onlineDateYear)}</div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Month</div>
                              <div>
                                {makeDateDropDown(this.handler, 'issue.onlineDateMonth', 'm', this.state.issue.onlineDateMonth, errors.onlineDateInvalid)}
                              </div>
                            </div>
                            <div className='dateselectholder'>
                              <div>Day</div>
                              <div>
                                {makeDateDropDown(this.handler, 'issue.onlineDateDay', 'd', this.state.issue.onlineDateDay, errors.onlineDateInvalid)}
                              </div>
                            </div>
                            <div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='fieldHolder'>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Archive Location</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder norequire'>
                          <div className='required height32'>
                          </div>
                        </div>
                        <div className='field'>
                          {displayArchiveLocations(this.handler, this.state.issue.archiveLocation)}
                        </div>
                      </div>
                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Special Issue Number</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder norequire'>
                          <div className='required height32'>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className='height32'
                              type='text'
                              name='issue.specialIssueNumber'
                              onChange={this.handler}
                              value={this.state.issue.specialIssueNumber}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='errorHolder'>
                  </div>
                </div>
                <hr />
                <div className='row'>
                  <div className='fieldHolder'>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Volume</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder norequire'>
                          <div className='required height32'>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className='height32'
                              type='text'
                              name='issue.volume'
                              onChange={this.handler}
                              value={this.state.issue.volume}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='errorHolder'>
                  </div>
                </div>
                <div className='row'>
                  <div className='fieldHolder'>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Volume DOI</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className='requiredholder norequire'>
                          <div className='required height32'>
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className={`height32 ${(errors.dupevolumedoi || errors.invalidvolumedoi || errors.dupeDois) && 'fieldError'} ${this.state.volumeDoiDisabled && 'disabledDoi'}`}
                              type='text'
                              name='issue.volumeDoi'
                              onChange={this.handler}
                              value={this.state.issue.volumeDoi}
                              disabled={this.state.volumeDoiDisabled}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='fieldinnerholder halflength'>
                      <div className='labelholder'>
                        <div></div>
                        <div className='labelinnerholder'>
                          <div className='label'>Volume URL</div>
                        </div>
                      </div>
                      <div className='requrefieldholder'>
                        <div className={`requiredholder ${!this.state.issue.volumeDoi && 'norequire'}`}>
                          <div className='required height32'>
                            {this.state.issue.volumeDoi && <span>*</span>}
                          </div>
                        </div>
                        <div className='field'>
                          <input
                              className={'height32' + ((errors.volumeUrl || errors.invalidvolumeurl) ? ' fieldError': '')}
                              type='text'
                              name='issue.volumeUrl'
                              onChange={this.handler}
                              value={this.state.issue.volumeUrl}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <SubItem
                title={'Optional Issue Information (Contributorship)'}
                arrowType={'dark'}
                addable={true}
                incomingData={this.state.optionalIssueInfo}
                handler={this.optionalIssueInfoHandler.bind(this)}
                addHandler={this.addOptionalIssueInfo.bind(this)}
                remove={this.removeOptionalIssueInfo.bind(this)}
              />
              <div className='saveButtonAddIssueHolder'>
                <button type='submit' className='saveButton addIssue'>Submit</button>
                <button onClick={() => this.closeModal()} type='button' className='cancelButton addIssue'>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

