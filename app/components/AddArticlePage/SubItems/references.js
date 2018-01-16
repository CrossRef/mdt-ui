import React from 'react'
import is from 'prop-types'

import * as api from '../../../actions/api'



export default class References extends React.Component {

  static propTypes = {
    references: is.array.isRequired,
    setReferences: is.func.isRequired,
  }

  state = {
    referenceText: '',
    loading: false
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


  rejectReference = (index, reference) => {
    const newArray = [...this.props.references]
    newArray.splice(index, 1, {reference})
    this.props.setReferences({references: newArray})
  }


  render () {
    return (
      <div className="references">

        <p className="topText">Reference list or bibliography</p>

        <textarea
          className="textBox"
          value={this.state.referenceText}
          onChange={ e => this.setState({referenceText: e.target.value})}
          placeholder="Type or paste references here"/>

        <div className="getReferencesButton" onClick={this.getReferences}>
          Match Reference {this.state.loading && <div className="referencesLoader"/>}
        </div>

        {this.props.references.length > 0 &&
          <div className="resultsContainer">

            <div className="removeAllReferences">
              <span onClick={()=> this.props.setReferences({references: []})}>Remove All</span>
            </div>

            {this.props.references.map((item, i) =>
              <div key={`${i}_${item.reference}`} className="result">
                <p className="referenceText"><span>{`${i+1}. `}</span>{`${item.reference}`}</p>

                {item.DOI ?
                  <a className="referenceReview" target="_blank" href={`https://doi.org/${item.DOI}`}>Review match</a>
                  : <p className="referenceReview noMatch">No match</p>}

                {item.DOI && <p className="referenceRemove" onClick={() => this.rejectReference(i, item.reference)}>Reject</p>}

              </div>
            )}
          </div>}

      </div>
    )
  }
}