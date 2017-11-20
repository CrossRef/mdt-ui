import {recordTitle} from '../utilities/helpers'


export default function toastReducer (state = {
  doi: '',
  title: '',
  recordType: '',
  updateType: ''
}, action) {
  switch (action.type) {
    case 'CART_UPDATE':
      const record = action.cart[0]
      if (record.type !== 'article' && action.inCart && !action.addToCart) {
        //If issue or title are saved but already in cart, dont show a toast
        return state
      }
      return {
        doi: record.doi,
        title: recordTitle(record.type, record.title),
        recordType: record.type,
        updateType: action.inCart ? 'updateCart' : 'addToCart'
      }
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