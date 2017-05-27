import React, { Component } from 'react'
import is from 'prop-types'
import { stateTrackerII, updateReporterPP } from 'my_decorators'

import PublicationCard from '../containers/publicationCard'


Publications.propTypes = {
  dois: is.array.isRequired,
}


export default function Publications (props) {
  const { dois } = props;
  return (
    <div className='content'>
      <div className='tools' />
      <div className='cards'>
        {dois.map((doi, i) => <PublicationCard doi={doi} key={i} />)}
      </div>
    </div>
  )
}
