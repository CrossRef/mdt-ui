import {SearchableRecords} from '../utilities/helpers'



export default function publicationsReducer (state = new SearchableRecords(), action) {
  switch (action.type) {
    case 'STOREPUBLICATIONS':

      function normalize (publications) {  //Redux likes normalized state: store items in an object, with the IDs of the items as keys and the items themselves as the values.
        if(!Array.isArray(publications)) {
          publications = [publications]
        }

        return publications.reduce( (normalizedData, thisPublication) => {

          try {
            if(thisPublication.doi) {
              normalizedData[thisPublication.doi] = {message: thisPublication}
              return normalizedData
            }

            const normalizedRecords = new SearchableRecords()

            const contains = thisPublication.message.contains
            if(contains && contains.length) {
              contains.forEach( thisRecord => {
                if (!thisRecord || (!thisRecord.doi && !thisRecord.title)) {
                  return console.warn(`Had trouble retrieving data for a Record`, thisRecord || contains)
                }
                normalizedRecords[thisRecord.doi || JSON.stringify(thisRecord.title)] = thisRecord
              })
            }

            normalizedData[thisPublication.message.doi] = {...thisPublication, normalizedRecords}

            return normalizedData

          } catch (e) {
            console.warn(`Had trouble retrieving data for a Publication`, thisPublication, e)
            return normalizedData
          }

        }, {})
      }

      return new SearchableRecords({...state, ...normalize(action.publications)})
    default:
      return state
  }
}