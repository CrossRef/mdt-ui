import { handleActions } from 'redux-actions'
import client from '../client'

export default handleActions({

  'SET_AUTH_BEARER' (state, action) {
    client.headers.Authorization = action.payload
    localStorage.setItem('auth', action.payload)
    return {
      ...state,
      auth: action.payload
    }
  }
}, {
  auth: localStorage.getItem('auth') || null,
})
