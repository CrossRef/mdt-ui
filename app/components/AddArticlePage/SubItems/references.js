import React from 'react'
import is from 'prop-types'





export default class References extends React.Component {

  static propTypes = {
    references: is.array.isRequired,
    setReferences: is.func.isRequired
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


  getReferences = () => {
    const apiCallResult = this.dummyData
    this.props.setReferences({references: apiCallResult})
  }


  render () {
    return (
      <div className="references">
        <p className="topText">Reference list or bibliography</p>
        <textarea className="textBox" placeholder="Type or paste references here"></textarea>
        <div className="getReferencesButton" onClick={this.getReferences}>Get References</div>

        {this.props.references.length > 0 &&
          <div className="resultsContainer">
            {this.props.references.map((item, i) =>
              <div className="result">
                <p key={i}>{`${i+1}. ${item.reference}`}</p>
                {item.matchValuation > 80 && <a href={`https://doi.org/${item.doi}`}>{`https://doi.org/${item.doi}`}</a>}
              </div>
            )}
          </div>}
      </div>
    )
  }
}