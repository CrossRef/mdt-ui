import _ from 'lodash'


export default function cartReducer (state = [], action) {
  switch (action.type) {
    case 'CART_UPDATE':
      var newState = [...state]

    function mergeByDoi(arr) {
      return _(arr).groupBy(function(item) { // group the items using the lower case
        return item.doi
      })
        .map(function(group) { // map each group
          return _.mergeWith.apply(_, [{}].concat(group, function(obj, src) { // merge all items, and if a property is an array concat the content
            if (Array.isArray(obj)) {
              return obj.concat(src)
            }
          }))
        })
        .values() // get the values from the groupBy object
        .value()
    }
      newState.push(action.cart[0])
      newState = mergeByDoi(newState) //does 2 things, removes dupes and also merge the content if there was 2 of the same that way there is more info if there is more info

      return [...newState]
    case 'REMOVE_FROM_CART':
      var removeIndex = _.findIndex(state, (item) => {
        return action.doi.toLowerCase() === item.doi.toLowerCase()
      })
      if(removeIndex !== -1) {
        var newState = [...state]
        newState.splice(removeIndex, 1)
        return newState
      } else return state
    case 'CLEAR_CART':
      var cart = []
      return [...cart]
    default:
      return state
  }
}