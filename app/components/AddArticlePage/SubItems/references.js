import React from 'react'
import is from 'prop-types'

import * as api from '../../../actions/api'
import FormTextArea from '../../Common/formTextArea'
import {routes} from '../../../routing'



export default class References extends React.Component {

  static propTypes = {
    references: is.array.isRequired,
    setReferences: is.func.isRequired,
    errorUtility: is.object.isRequired,
    tooltipUtility: is.object.isRequired,
    tooltip: is.bool
  }

  state = {
    referenceText: '',
    loading: false,
    tooltipText: ''
  }


  componentWillReceiveProps (nextProps) {
    if(nextProps.references.length > this.props.references.length) {
      this.setState({referenceText: '', loading: false})
    }
  }


  getReferences = () => {
    if(this.state.referenceText.length > 1) {
      this.setState({loading: true})
      api.getReference(this.state.referenceText.split('\n').filter( text => text.length > 1)).then( result => {
        this.props.setReferences({references: [...this.props.references, ...result.map( reference => reference.message[0])]})
      })
    }
  }


  rejectReference = (index, item) => {
    const newArray = [...this.props.references]
    newArray.splice(index, 1, {reference: item.reference || `https://doi.org/${item.DOI}`})
    this.props.setReferences({references: newArray})
  }


  onFocus = () => {
    const tooltip = "Depositing DOIs for each of your references will ensure precise citations. Paste article references into the text box and click 'Match reference'. The system will return any DOI matches found. Review the accuracy of a reference, by clicking on 'Review Match'. If the match is incorrect, click Reject to drop the match. All references pasted will be deposited. You can remove them by clicking 'Remove all references'."
    this.props.tooltipUtility.assignFocus('referencesTooltip', tooltip)
  }


  referenceMouseover = (doi, i) => {
    this.setState({tooltipText: 'Loading...'})
    api.getFormattedReference(doi).then(response=>{
      const newReferences = [...this.props.references]
      let formatedCitation = response.message[0]['formatted-citation']
      const doiIndex = formatedCitation.indexOf('doi:')
      const splicedDoi = formatedCitation.substring(doiIndex  + 4)
      formatedCitation = formatedCitation.substring(0, doiIndex)
      formatedCitation = formatedCitation + 'https://doi.org/' + splicedDoi

        newReferences[i]['formatted-citation'] = formatedCitation
      this.props.setReferences({references: newReferences})
    })
  }


  render () {
    const isFocus = this.props.tooltipUtility.getFocusedInput() === 'referencesTooltip'

    return (
      <div className="references">

        <p className="topText">Reference list or bibliography</p>

        <div style={{position:'relative', width: '80.5%'}}>
          {isFocus && this.props.tooltip && <img className='infoFlag infoFlagTextArea' src={`${routes.images}/AddArticle/Asset_Icons_GY_HelpFlag.svg`} />}

          <textarea
            className={`textBox ${isFocus && this.props.tooltip ? 'infoFlagBorder' : ''}`}
            value={this.state.referenceText}
            onChange={ e => this.setState({referenceText: e.target.value})}
            placeholder="Type or paste references here"
            onFocus={this.onFocus}/>
        </div>

        <div className="getReferencesButton" onClick={this.getReferences}>
          Match references {this.state.loading && <div className="referencesLoader"/>}
        </div>

        {this.props.references.length > 0 &&
          <div className="resultsContainer">

            <div className="removeAllReferences">
              <span onClick={()=> this.props.setReferences({references: []})}>Remove all references</span>
            </div>

            {this.props.references.map((item, i) => {
              if(item['formatted-citation']) {
                let formatedCitation = item['formatted-citation']
                const doiIndex = formatedCitation.indexOf('doi:')
                const splicedDoi = formatedCitation.substring(doiIndex  + 4)
                if(!splicedDoi.startsWith('https://doi.org/')) {
                  formatedCitation = formatedCitation.substring(0, doiIndex)
                  item['formatted-citation'] = formatedCitation + 'https://doi.org/' + splicedDoi
                }
              }

              return <div key={`${i}_${item.reference || item.DOI}`} className="result">
                <p className="referenceText"><span>{`${i+1}. `}</span>{`${item.reference || (item.DOI ? `https://doi.org/${item.DOI}` : undefined)}`}</p>

                <div className={`referenceDiv ${item.DOI ? 'referenceTooltipHover' : ''}`}>
                  <div className="referenceTooltip">{item['formatted-citation'] || this.state.tooltipText}</div>

                  {item.DOI ?
                    <a className="referenceReview"
                       onMouseOver={item['formatted-citation'] ? null : () => this.referenceMouseover(item.DOI, i)}
                       target="_blank"
                       href={`https://doi.org/${item.DOI}`}>
                      Review match
                    </a>
                  :
                    <p className="referenceReview noMatch">No match</p>}
                  </div>

                  {item.DOI && <p className="referenceRemove" onClick={() => this.rejectReference(i, item)}>Reject</p>}

                </div>
              }
            )}
          </div>}

      </div>
    )
  }
}