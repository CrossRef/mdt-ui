import React, { Component } from 'react'
import is from 'prop-types'
import { stateTrackerII, updateReporterPP } from 'my_decorators'

import PublicationCardContainer from '../../containers/publicationCardContainer'


Publications.propTypes = {
  dois: is.array.isRequired
}


export default function Publications (props) {
  const { dois } = props;
  console.log(`Showing ${dois.length} DOIs`)
  return (
    <div className='content'>
      <div className='tools' />
      <div className='cards'>
        {dois.map((doi, i) => <PublicationCardContainer doi={doi} key={i} />)}
      </div>
    </div>
  )
}
