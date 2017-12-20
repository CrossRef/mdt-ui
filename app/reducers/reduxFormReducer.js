import {Map, fromJS} from 'immutable'

export default function reduxFormReducer (state = Map({}), action) {
  switch (action.type) {
    case 'REDUXFORM_ADD':
      if(typeof action.value === 'object' && !Map.isMap(action.value)) {
        action.value = fromJS(action.value)
      }

      if(action.value === '') {
        const [cardKey, index, fieldKey] = action.keyPath
        const fieldGroup = state.getIn([cardKey, index])

        if(fieldGroup.size === 1 && fieldGroup.get(fieldKey)) {  // if this property is the last one, delete parent
          const card = state.get(cardKey)
          if(card.size === 1 && card.get(index)) {
            return state.delete(cardKey)
          } else {
            return state.deleteIn([cardKey, index])
          }
        } else {
          return state.deleteIn(action.keyPath)
        }
      } else {
        let newValue = action.value
        const oldValue = state.getIn(action.keyPath)
        if(typeof oldValue === 'object') {
          newValue = oldValue.merge(newValue)
        }
        return state.setIn(action.keyPath, newValue)
      }
    case 'REDUXFORM_DELETE':
      return state.deleteIn(action.keyPath)
    case 'REDUXFORM_CLEAR':
      return Map({})
    default:
      return state
  }
}