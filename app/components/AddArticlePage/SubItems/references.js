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


  dummyData = [
    {
      reference: 'Dummy Text 1.',
      doi: '10.5555/awgawgaerh',
      matchValuation: 98
    },
    {
      reference: 'Dummy Text 2',
      doi: '10.5555/awgawgaerh',
      matchValuation: 23
    },
    {
      reference: 'Dummy Text 3',
      doi: '10.5555/awgawgaerh',
      matchValuation: 52
    },
    {
      reference: 'Dummy Text 4',
      doi: '10.5555/awgawgaerh',
      matchValuation: 44
    },
    {
      reference: 'Dummy Text 5',
      doi: '10.5555/awgawgaerh',
      matchValuation: 87
    },
    {
      reference: 'Dummy Text 6',
      doi: '10.5555/awgawgaerh',
      matchValuation: 100
    }
  ]


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


  removeReference = (index) => {
    const newArray = [...this.props.references]
    newArray.splice(index, 1)
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
          Get References {this.state.loading && <div className="referencesLoader"/>}
        </div>

        {this.props.references.length > 0 &&
          <div className="resultsContainer">
            {this.props.references.map((item, i) =>
              <div key={`${i}_${item.reference}`} className="result">
                <p className="referenceText"><span>{`${i+1}. `}</span>{`${item.reference}`}</p>
                <p className="referenceRemove" onClick={() => this.removeReference(i)}>Remove</p>
                {item.matchValuation > 60 ?
                  <a href={`https://doi.org/${item.DOI}`}>{`https://doi.org/${item.DOI}`}</a>
                  : <div className="clearReference"/>}
              </div>
            )}
          </div>}

      </div>
    )
  }
}