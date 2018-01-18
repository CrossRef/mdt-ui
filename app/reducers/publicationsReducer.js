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

      const normalizedPublications = normalize(action.publications)

      //If user's initial load is a publication page, the api.getItem for that publication might come back before the
      //getDraftWorks. In which case we dont want the getDraftworks to overwrite the already loaded publication
      const newState = action.getDraftWorks ?
        {...normalizedPublications, ...state}
      : {...state, ...normalizedPublications}

      return new SearchableRecords(newState)

    case 'RESETPUBLICATIONS':
      return new SearchableRecords()
    default:
      return state
  }
}