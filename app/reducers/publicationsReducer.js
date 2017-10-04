import {SearchableRecords} from '../utilities/helpers'



export default function publicationsReducer (state = new SearchableRecords(), action) {
  switch (action.type) {
    case 'PUBLICATIONS':

    function normalize (publications) {  //Redux likes normalized state: store items in an object, with the IDs of the items as keys and the items themselves as the values.
      let normalizedData = {}

      if(Array.isArray(publications)) {
        publications.forEach( thisPublication => {
          if(!thisPublication || !thisPublication.message || !thisPublication.message.doi) {
            return console.warn(`Had trouble retrieving data for a Publication`, thisPublication || 'Empty Array Value')
          }
          const normalizedRecords = new SearchableRecords()

          if((thisPublication.message.contains || []).length) {
            thisPublication.message.contains.forEach( thisRecord => {
              if (!thisRecord || !thisRecord.doi) return console.warn(`Had trouble retrieving data for a Record`, thisRecord || 'Empty Array Value')
              normalizedRecords[thisRecord.doi] = thisRecord
            })
          }
          normalizedData[thisPublication.message.doi] = {...thisPublication, normalizedRecords}
        })

      } else if(publications.message.contains.length) {
        const normalizedRecords = new SearchableRecords()

        publications.message.contains.forEach(thisRecord => {
          if(!thisRecord || !thisRecord.doi) return console.warn(`Had trouble retrieving data for a Record`, thisRecord || 'Empty Array Value')
          normalizedRecords[thisRecord.doi] = thisRecord
        })
        normalizedData[publications.message.doi] = {...publications, normalizedRecords}

      } else normalizedData[publications.message.doi] = publications

      return normalizedData
    }

      return new SearchableRecords({...state, ...normalize(action.publications)})
    default:
      return state
  }
}