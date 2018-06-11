import {SearchableRecords, normalize} from '../utilities/helpers'



export default function publicationsReducer (state = new SearchableRecords(), action) {
  switch (action.type) {
    case 'STOREPUBLICATIONS': {

      //const normalizedPublications = normalize(action.publications)

      //If user's initial load is a publication page, the api.getItem for that publication might come back before the
      //getDraftWorks. In which case we dont want the getDraftworks to overwrite the already loaded publication
      const newState = action.getDraftWorks ?
        {...action.publications, ...state}
        : {...state, ...action.publications}

      return new SearchableRecords(newState)
    }

    case 'RESETPUBLICATIONS': {
      return new SearchableRecords()
    }

    case 'DELETEPUBLICATION': {
      const newState = {...state}
      delete newState[action.doi]
      return newState
    }

    default:
      return state
  }
}