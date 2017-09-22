


export default function toastReducer (state = {
  doi: '',
  title: '',
  recordType: '',
  updateType: ''
}, action) {
  switch (action.type) {
    case 'CART_UPDATE':
      const record = action.cart[0]
      if(record.type === 'article') {
        return {doi: record.doi, title: record.title.title, recordType: record.type, updateType: 'addToCart'}
      }
      else if(record.type === 'issue') {
        return {
          title: `${record.title.volume ? `, Volume ${record.title.volume}, ` : ''}Issue ${record.title.issue}`,
          recordType: record.type,
          updateType: 'addToCart'
        }
      }
      else return state
    case 'REMOVE_FROM_CART':
      return {doi: action.doi, title: action.title, recordType: action.recordType, updateType: 'removeFromCart'}
    case 'NEW_TOAST':
      return action.toast
    case 'CLEAR_TOAST':
      return {doi: '', title: '', recordType: '', updateType: ''}
    default:
      return state
  }
}