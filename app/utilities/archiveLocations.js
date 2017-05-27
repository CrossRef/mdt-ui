import React from 'react'

export const ArchiveLocations = [
    {'value':'CLOCKSS', 'name':'CLOCKSS'},
    {'value':'LOCKSS', 'name':'LOCKSS'},
    {'value':'Portico', 'name':'Portico'},
    {'value':'KB', 'name':'Koninklijke Bibliotheek'},
    {'value':'Internet Archive', 'name':'Internet Archive'},
    {'value':'DWT', 'name':'Deep Web Technologies'}
]

export const displayArchiveLocations = (handler, value) => {

    var locations = [
    <option key='-1'></option>,
    ...ArchiveLocations.map((location, i) => (<option key={i} value={location.value}>{location.name}</option>))
    ]

    return (
        <select
        ref='issue.archiveLocation'
        className='height32'
        name='issue.archiveLocation'
        onChange={(event) => handler(event)}
        value={value}
        >
            {locations}
        </select>
    )
}